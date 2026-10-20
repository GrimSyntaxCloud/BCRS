const { database } = require('./database');
const { users, roles, questions, invoiceFrom, purchases } = require('./demo');
function createHandler({ prepare = database, limit = 120, now = Date.now } = {}) {
  let windowStart = now(), count = 0;
  const reply = (status, message, data = null) => ({
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
    jsonBody: { httpCode: status, message, data },
  });
  return async request => {
    if (now() - windowStart >= 60000) { windowStart = now(); count = 0; }
    if (++count > limit) return reply(429, 'The shared demo is busy. Try again in a minute.');
    try {
      const method = request.method;
      const path = '/' + (request.params.path || '').replace(/\/$/, '');
      let body;
      if (method === 'POST' || method === 'PUT') {
        if (Number(request.headers.get('content-length')) > 16384) return reply(413, 'Request is too large.');
        const raw = await request.text();
        if (Buffer.byteLength(raw) > 16384) return reply(413, 'Request is too large.');
        try { body = JSON.parse(raw); } catch { return reply(400, 'Invalid JSON.'); }
      }
      if (method === 'POST' && path === '/session/login') {
        if (body?.userName !== 'demo') return reply(401, 'Open the shared demo with the demo account.');
        // This is a public demo selector, not authentication. No password is saved.
        return reply(200, 'Shared demo opened.', users[0]);
      }
      if (method === 'GET' && path.startsWith('/session/verify/users/')) {
        const user = users.find(u => u.userName === path.split('/').pop());
        return user ? reply(200, 'Fictional demo user.', user) : reply(404, 'Demo user not found.');
      }
      if (path.startsWith('/session/')) return reply(403, 'Registration and account recovery are disabled in this public demo.');
      const match = /^\/(users|roles|security-questions)(?:\/([^/]+))?(?:\/(role))?$/.exec(path);
      if (match) {
        if (method !== 'GET') return reply(403, 'Fictional account and security records are read-only.');
        const [, type, id, field] = match;
        const list = type === 'users' ? users : type === 'roles' ? roles : questions;
        if (!id) return reply(200, 'Read-only fictional examples.', list);
        const item = list.find(x => x._id === id || x.userName === id);
        if (!item) return reply(404, 'Demo record not found.');
        if (field && type !== 'users') return reply(404, 'API route not found.');
        return reply(200, 'Read-only fictional example.', field ? item.role : item);
      }
      if (method === 'GET' && path === '/health') {
        const { db } = await prepare();
        await db.command({ ping: 1 });
        return { ...reply(200, 'Healthy.'), jsonBody: { status: 'ok' } };
      }
      if (method === 'GET' && ['/invoices', '/invoices/purchases-graph'].includes(path)) {
        const { collection } = await prepare();
        const data = await collection.findOne({ _id: 'shared-demo' });
        return reply(200, 'Latest 50 shared sample invoices.', path.endsWith('purchases-graph') ? purchases(data.invoices) : data.invoices);
      }
      if (method === 'POST' && path === '/invoices/demo') {
        const invoice = invoiceFrom(body);
        const { collection } = await prepare();
        // Atomic append and trim bounds storage even with simultaneous visitors.
        await collection.updateOne({ _id: 'shared-demo' },
          { $push: { invoices: { $each: [invoice], $slice: -50 } } });
        return reply(200, 'Sample invoice saved. No real order or payment was placed.', invoice);
      }
      if (method === 'DELETE' && /^\/invoices\/[a-f0-9-]{36}$/.test(path)) {
        const { collection } = await prepare();
        const result = await collection.updateOne({ _id: 'shared-demo' },
          { $pull: { invoices: { _id: path.split('/').pop() } } });
        return result.modifiedCount ? reply(200, 'Sample invoice removed.') : reply(404, 'Sample invoice not found.');
      }
      return reply(404, 'API route not found.');
    } catch (error) {
      if (error.status === 400) return reply(400, error.message);
      return reply(503, 'The demo is temporarily unavailable. Please try again.');
    }
  };
}
module.exports = { createHandler };
