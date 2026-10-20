const { database } = require('./database');
const { users, roles, questions, invoiceFrom, purchases } = require('./demo');
const A = require('./accounts');
function createHandler({ prepare = database, limit = 120, authLimit = 20, now = Date.now, secure = true, accountLimit = 100 } = {}) {
  let windowStart = now(), count = 0, authCount = 0, hashing = 0;
  const reply = (status, message, data = null, cookie) => ({
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...(cookie ? { 'Set-Cookie': cookie } : {}) },
    jsonBody: { httpCode: status, message, data },
  });
  async function hashWork(work) {
    if (++authCount > authLimit || hashing >= 2) A.fail(429, 'Too many sign-in attempts. Try again in a minute.');
    hashing++;
    try { return await work(); } finally { hashing--; }
  }
  return async request => {
    const time = now();
    if (time - windowStart >= 60000) { windowStart = time; count = 0; authCount = 0; }
    if (++count > limit) return reply(429, 'The demo is busy. Try again in a minute.');
    try {
      const method = request.method;
      const path = '/' + (request.params.path || '').replace(/\/$/, '');
      let body;
      if (['POST', 'PUT', 'DELETE'].includes(method)) {
        // A cross-origin site cannot send this header without a CORS preflight.
        // This API deliberately grants no cross-origin access.
        if (request.headers.get('x-bcrs-request') !== '1' || request.headers.get('sec-fetch-site') === 'cross-site') return reply(403, 'Invalid request origin.');
      }
      if (method === 'POST' || method === 'PUT') {
        if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return reply(415, 'Use JSON.');
        if (Number(request.headers.get('content-length')) > 16384) return reply(413, 'Request is too large.');
        const raw = await request.text();
        if (Buffer.byteLength(raw) > 16384) return reply(413, 'Request is too large.');
        try { body = JSON.parse(raw); } catch { return reply(400, 'Invalid JSON.'); }
        if (!body || typeof body !== 'object' || Array.isArray(body)) return reply(400, 'Invalid JSON object.');
      }
      if (method === 'GET' && path === '/health') {
        const { db } = await prepare();
        await db.command({ ping: 1 });
        return { ...reply(200, 'Healthy.'), jsonBody: { status: 'ok' } };
      }
      const { collection } = await prepare();
      if (method === 'POST' && path === '/session/register') {
        const name = A.username(body.userName);
        if (['demo', 'sample-customer', 'admin'].includes(name)) return reply(409, 'That username is unavailable.');
        const details = A.profile(body);
        const hash = await hashWork(() => A.hashPassword(A.password(body.password)));
        // Atomic name reservation enforces uniqueness and a hard account bound
        // across function instances without a second collection or paid throughput.
        const reserved = await collection.updateOne({ _id: 'account-registry', names: { $ne: name }, [`names.${accountLimit - 1}`]: { $exists: false } }, { $push: { names: name } });
        if (!reserved.modifiedCount) return reply(409, 'That username is unavailable or this demo has reached its account capacity.');
        const user = { _id: `user:${name}`, userName: name, profile: details, passwordHash: hash, sessions: [], invoices: [], createdAt: time, authAttempts: 0, authWindow: time };
        // On an uncertain database failure, retain the reservation rather than
        // allowing an unbounded number of accounts. No secret is logged.
        await collection.insertOne(user);
        return reply(201, 'Account created.', A.publicUser(user), await A.issueSession(collection, user, time, secure, hash));
      }
      if (method === 'POST' && path === '/session/guest') {
        const user = await collection.findOne({ _id: 'shared-demo' });
        return reply(200, 'Guest demo opened.', A.publicUser(user), await A.issueSession(collection, user, time, secure));
      }
      if (method === 'POST' && path === '/session/login') {
        let name;
        try { name = A.username(body.userName); } catch { return reply(401, 'Username or password is incorrect.'); }
        const user = await collection.findOne({ _id: `user:${name}` });
        if (user) {
          await collection.updateOne({ _id: user._id, authWindow: { $lte: time - 15 * 60000 } }, { $set: { authWindow: time, authAttempts: 0 } });
          const attempt = await collection.updateOne({ _id: user._id, authAttempts: { $lt: 10 } }, { $inc: { authAttempts: 1 } });
          if (!attempt.modifiedCount) return reply(429, 'Too many sign-in attempts. Try again in 15 minutes.');
        }
        const valid = await hashWork(() => A.verifyPassword(body.password, user?.passwordHash));
        if (!valid || !user) return reply(401, 'Username or password is incorrect.');
        const cookie = await A.issueSession(collection, user, time, secure, user.passwordHash);
        await collection.updateOne({ _id: user._id }, { $set: { authAttempts: 0, authWindow: time } });
        return reply(200, 'Signed in.', A.publicUser(user), cookie);
      }
      if (method === 'POST' && path === '/session/logout') {
        const session = A.readSession(request);
        if (session) await collection.updateOne({ _id: session.userName === 'demo' ? 'shared-demo' : `user:${session.userName}` }, { $pull: { sessions: { hash: session.hash } } });
        return reply(200, 'Signed out.', null, A.sessionCookie('', secure, 0));
      }
      const { user, session } = await A.authenticate(request, collection, time);
      if (method === 'GET' && (path === '/session/me' || path === `/session/verify/users/${user.userName}`)) return reply(200, 'Your account.', A.publicUser(user));
      if (method === 'PUT' && path === '/session/profile') {
        if (user.guest) return reply(403, 'Register an account to edit your profile.');
        const details = A.profile(body);
        const updated = await collection.updateOne({ _id: user._id, sessions: { $elemMatch: { hash: session.hash, expiresAt: { $gt: time } } } }, { $set: { profile: details } });
        if (!updated.matchedCount) return reply(401, 'Please sign in again.');
        return reply(200, 'Profile saved.', A.publicUser({ ...user, profile: details }));
      }
      if (method === 'POST' && ['/session/password', '/session/delete-account'].includes(path)) {
        if (user.guest) return reply(403, 'The shared guest account cannot be changed.');
        return await hashWork(async () => {
          if (!await A.verifyPassword(body.currentPassword, user.passwordHash)) return reply(401, 'Current password is incorrect.');
          if (path === '/session/delete-account') {
            const removed = await collection.deleteOne({ _id: user._id, passwordHash: user.passwordHash });
            if (!removed.deletedCount) return reply(409, 'Account changed. Sign in again.');
            await collection.updateOne({ _id: 'account-registry' }, { $pull: { names: user.userName } });
            return reply(200, 'Account and invoices deleted.', null, A.sessionCookie('', secure, 0));
          }
          const hash = await A.hashPassword(A.password(body.newPassword));
          const updated = await collection.updateOne({ _id: user._id, passwordHash: user.passwordHash }, { $set: { passwordHash: hash, sessions: [], authAttempts: 0, authWindow: time } });
          if (!updated.modifiedCount) return reply(409, 'Account changed. Sign in again.');
          return reply(200, 'Password changed. Sign in again.', null, A.sessionCookie('', secure, 0));
        });
      }
      const match = /^\/(users|roles|security-questions)(?:\/([^/]+))?(?:\/(role))?$/.exec(path);
      if (match) {
        const [, type, id, field] = match;
        if (method === 'GET' && type === 'users' && id === user.userName) return reply(200, 'Your account.', field ? A.publicUser(user).role : A.publicUser(user));
        // Guest administration is explicitly a preview of fictional seed data;
        // it never enumerates or edits registered users.
        if (!user.guest || method !== 'GET') return reply(403, 'This preview contains only read-only fictional examples.');
        const list = type === 'users' ? users : type === 'roles' ? roles : questions;
        const item = id ? list.find(x => x._id === id || x.userName === id) : list;
        if (!item || (field && type !== 'users')) return reply(404, 'Example not found.');
        return reply(200, 'Fictional examples.', field ? item.role : item);
      }
      if (method === 'GET' && ['/invoices', '/invoices/purchases-graph'].includes(path)) return reply(200, 'Your latest 50 sample invoices.', path.endsWith('purchases-graph') ? purchases(user.invoices) : user.invoices);
      if (method === 'POST' && path.startsWith('/invoices/')) {
        if (path !== `/invoices/${user.userName}`) return reply(403, 'You can only save your own invoices.');
        const invoice = { ...invoiceFrom(body), userName: user.userName };
        const result = await collection.updateOne({ _id: user._id, sessions: { $elemMatch: { hash: session.hash, expiresAt: { $gt: time } } } }, { $push: { invoices: { $each: [invoice], $slice: -50 } } });
        if (!result.matchedCount) return reply(401, 'Please sign in again.');
        return reply(200, 'Sample invoice saved. No order or payment was placed.', invoice);
      }
      if (method === 'DELETE' && /^\/invoices\/[a-f0-9-]{36}$/.test(path)) {
        const result = await collection.updateOne({ _id: user._id, sessions: { $elemMatch: { hash: session.hash, expiresAt: { $gt: time } } } }, { $pull: { invoices: { _id: path.split('/').pop() } } });
        if (!result.matchedCount) return reply(401, 'Please sign in again.');
        return result.modifiedCount ? reply(200, 'Sample invoice removed.') : reply(404, 'Sample invoice not found.');
      }
      return reply(404, 'API route not found.');
    } catch (error) {
      if ([400, 401, 403, 409, 429].includes(error.status)) return reply(error.status, error.message);
      return reply(503, 'The demo is temporarily unavailable. Please try again.');
    }
  };
}
module.exports = { createHandler };
