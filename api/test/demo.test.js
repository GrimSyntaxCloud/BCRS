const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { HttpRequest } = require('@azure/functions');
const { createHandler } = require('../handler');
const { seedInvoices, users } = require('../demo');
let mongo, db, collection, handler, alice, bob, guest;
const pass = 'Fictional-only-password!42';
const call = (method, path, body, cookie = '', target = handler, extra = {}) => target(new HttpRequest({
  method, url: `https://demo.test/api${path}`, params: { path: path.slice(1) },
  headers: { 'content-type': 'application/json', 'x-bcrs-request': '1', cookie, ...extra },
  ...(body === undefined ? {} : { body: { string: JSON.stringify(body) } }),
}));
const cookie = res => res.headers['Set-Cookie']?.split(';')[0];
const registration = name => ({ userName: name, password: pass, firstName: 'Fictional', lastName: 'Customer', role: 'admin' });
before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri(), { dbName: 'bcrs-test' });
  db = mongoose.connection.db;
  collection = db.collection('demo');
  await collection.insertMany([
    { _id: 'shared-demo', userName: 'demo', guest: true, profile: users[0], invoices: seedInvoices(), sessions: [] },
    { _id: 'account-registry', names: [] },
  ]);
  handler = createHandler({ prepare: async () => ({ db, collection }), limit: 1000, authLimit: 1000 });
});
after(async () => { await mongoose.disconnect(); await mongo?.stop(); });
test('registration persists hashed credentials, canonical usernames and server-assigned roles', async () => {
  const result = await call('POST', '/session/register', registration('Alice'));
  assert.equal(result.status, 201);
  alice = cookie(result);
  assert.match(result.headers['Set-Cookie'], /HttpOnly; SameSite=Strict; Max-Age=28800; Secure/);
  assert.equal(result.jsonBody.data.userName, 'alice');
  assert.equal(result.jsonBody.data.role.text, 'standard');
  assert(!JSON.stringify(result.jsonBody).includes('password'));
  const stored = await collection.findOne({ _id: 'user:alice' });
  assert(stored.passwordHash && !JSON.stringify(stored).includes(pass));
  assert(!JSON.stringify(stored).includes(alice.split('=')[1]));
  assert.equal((await call('POST', '/session/register', registration('ALICE'))).status, 409);
  assert.equal((await call('POST', '/session/register', registration('demo'))).status, 409);
  assert.equal((await call('POST', '/session/register', { ...registration('weak'), password: 'short' })).status, 400);
  assert.equal((await call('POST', '/session/register', { ...registration('bad'), userName: { $ne: '' } })).status, 400);
  const second = await call('POST', '/session/register', registration('bob'));
  assert.equal(second.status, 201); bob = cookie(second);
});
test('real sessions required; passwords and forged client role/cookies cannot bypass authentication', async () => {
  assert.equal((await call('GET', '/invoices')).status, 401);
  assert.equal((await call('GET', '/session/me', undefined, 'sessionuser=alice')).status, 401);
  assert.equal((await call('GET', '/session/me', undefined, 'bcrs_session=alice.' + '0'.repeat(64))).status, 401);
  assert.equal((await call('POST', '/session/login', { userName: 'alice', password: 'wrong' })).status, 401);
  assert.equal((await call('POST', '/session/login', { userName: { $ne: '' }, password: pass })).status, 401);
  const logged = await call('POST', '/session/login', { userName: 'ALICE', password: pass });
  assert.equal(logged.status, 200);
  const token = cookie(logged);
  assert.equal((await call('GET', '/session/me', undefined, token)).status, 200);
  assert.equal((await call('POST', '/session/logout', {}, token)).status, 200);
  assert.equal((await call('GET', '/session/me', undefined, token)).status, 401);
});
test('profile updates persist, ignore privilege changes and cannot access another account', async () => {
  const changed = await call('PUT', '/session/profile', { firstName: 'Updated', lastName: 'Fictional', role: 'admin', passwordHash: 'forged', userName: 'bob' }, alice);
  assert.equal(changed.status, 200);
  const me = await call('GET', '/session/me', undefined, alice);
  assert.equal(me.jsonBody.data.firstName, 'Updated');
  assert.equal(me.jsonBody.data.role.text, 'standard');
  assert.equal(me.jsonBody.data.userName, 'alice');
  assert.equal((await call('GET', '/users/bob', undefined, alice)).status, 403);
  assert.equal((await call('GET', '/users', undefined, alice)).status, 403);
  assert.equal((await call('POST', '/session/users/bob/reset-password', { password: pass }, alice)).status, 404);
  assert.equal((await call('PUT', '/users/user:bob', { firstName: 'Injected' }, alice)).status, 403);
});
test('invoice ownership and canonical prices are enforced server-side for create, list, graph and delete', async () => {
  const result = await call('POST', '/invoices/alice', { userName: 'bob', total: -1, lineItems: [{ id: 100, price: 0, title: 'fake' }], adjustedParts: 10, adjustedLabor: 5 }, alice);
  assert.equal(result.status, 200);
  const invoice = result.jsonBody.data;
  assert.equal(invoice.userName, 'alice'); assert.equal(invoice.total, 104.99);
  assert.equal(invoice.lineItems[0].title, 'Password Reset');
  assert.equal((await call('GET', '/invoices', undefined, alice)).jsonBody.data.length, 1);
  assert.equal((await call('GET', '/invoices', undefined, bob)).jsonBody.data.length, 0);
  assert.equal((await call('GET', '/invoices/purchases-graph', undefined, alice)).jsonBody.data[0].count, 1);
  assert.equal((await call('GET', '/invoices/purchases-graph', undefined, bob)).jsonBody.data.length, 0);
  assert.equal((await call('POST', '/invoices/bob', { lineItems: [{ id: 100 }] }, alice)).status, 403);
  assert.equal((await call('DELETE', `/invoices/${invoice._id}`, undefined, bob)).status, 404);
  assert.equal((await call('DELETE', `/invoices/${invoice._id}`, undefined, alice)).status, 200);
  for (const body of [{ lineItems: [] }, { lineItems: [{ id: 999 }] }, { lineItems: Array(15).fill({ id: 100 }) }, { lineItems: [{ id: 100 }], adjustedParts: -1 }, { lineItems: [{ id: 100 }], adjustedLabor: 2001 }, { lineItems: [{ id: 100 }], adjustedParts: '100' }]) assert.equal((await call('POST', '/invoices/alice', body, alice)).status, 400);
});
test('guest preview cannot enumerate or modify registered accounts', async () => {
  const result = await call('POST', '/session/guest', {}); assert.equal(result.status, 200); guest = cookie(result);
  const list = (await call('GET', '/users', undefined, guest)).jsonBody.data;
  assert.equal(list.length, 2); assert(!list.some(x => x.userName === 'alice'));
  assert.equal((await call('GET', '/users/alice', undefined, guest)).status, 404);
  assert.equal((await call('PUT', '/session/profile', { firstName: 'X', lastName: 'Y' }, guest)).status, 403);
  assert.equal((await call('POST', '/session/delete-account', { currentPassword: pass }, guest)).status, 403);
  assert.equal((await call('POST', '/invoices/alice', { lineItems: [{ id: 100 }] }, guest)).status, 403);
});
test('atomic submissions retain only the latest 50 invoices per account', async () => {
  const results = await Promise.all(Array.from({ length: 60 }, () => call('POST', '/invoices/alice', { lineItems: [{ id: 105 }] }, alice)));
  assert(results.every(x => x.status === 200));
  const invoices = (await call('GET', '/invoices', undefined, alice)).jsonBody.data;
  assert.equal(invoices.length, 50); assert.equal(new Set(invoices.map(x => x._id)).size, 50);
  assert.equal((await call('GET', '/invoices', undefined, bob)).jsonBody.data.length, 0);
});
test('password changes require the old password and revoke every previous session', async () => {
  assert.equal((await call('POST', '/session/password', { currentPassword: 'wrong', newPassword: pass + 'new' }, alice)).status, 401);
  assert.equal((await call('POST', '/session/password', { currentPassword: pass, newPassword: pass + 'new' }, alice)).status, 200);
  assert.equal((await call('GET', '/session/me', undefined, alice)).status, 401);
  assert.equal((await call('POST', '/session/login', { userName: 'alice', password: pass })).status, 401);
  const signed = await call('POST', '/session/login', { userName: 'alice', password: pass + 'new' }); assert.equal(signed.status, 200); alice = cookie(signed);
});
test('session expiry and per-account login throttling work across handler instances', async () => {
  const future = createHandler({ prepare: async () => ({ db, collection }), now: () => Date.now() + 9 * 3600000 });
  assert.equal((await call('GET', '/session/me', undefined, bob, future)).status, 401);
  await collection.updateOne({ _id: 'user:bob' }, { $set: { authAttempts: 10 } });
  const other = createHandler({ prepare: async () => ({ db, collection }) });
  assert.equal((await call('POST', '/session/login', { userName: 'bob', password: pass }, '', other)).status, 429);
  await collection.updateOne({ _id: 'user:bob' }, { $set: { authWindow: Date.now() - 16 * 60000 } });
  assert.equal((await call('POST', '/session/login', { userName: 'bob', password: pass }, '', other)).status, 200);
});
test('deleting an account requires its password, removes invoices and invalidates sessions', async () => {
  assert.equal((await call('POST', '/session/delete-account', { currentPassword: 'wrong' }, alice)).status, 401);
  assert.equal((await call('POST', '/session/delete-account', { currentPassword: pass + 'new' }, alice)).status, 200);
  assert.equal(await collection.findOne({ _id: 'user:alice' }), null);
  assert.equal((await call('GET', '/session/me', undefined, alice)).status, 401);
  assert(!(await collection.findOne({ _id: 'account-registry' })).names.includes('alice'));
});
test('concurrent duplicate registration and account capacity never exceed reserved names', async () => {
  const limitedCollection = db.collection('limited');
  await limitedCollection.insertOne({ _id: 'account-registry', names: [] });
  const bounded = createHandler({ prepare: async () => ({ db, collection: limitedCollection }), accountLimit: 2, authLimit: 100 });
  let results = await Promise.all([call('POST', '/session/register', registration('same'), '', bounded), call('POST', '/session/register', registration('SAME'), '', bounded)]);
  assert.deepEqual(results.map(x => x.status).sort(), [201, 409]);
  results = await Promise.all([call('POST', '/session/register', registration('next-one'), '', bounded), call('POST', '/session/register', registration('next-two'), '', bounded)]);
  assert.deepEqual(results.map(x => x.status).sort(), [201, 409]);
  assert.equal(await limitedCollection.countDocuments({ passwordHash: { $exists: true } }), 2);
});
test('rejects cross-site writes, oversized input and throttles; database errors stay private', async () => {
  assert.equal((await call('POST', '/session/guest', {}, '', handler, { 'x-bcrs-request': '' })).status, 403);
  assert.equal((await call('POST', '/session/guest', {}, '', handler, { 'sec-fetch-site': 'cross-site' })).status, 403);
  assert.equal((await call('POST', '/session/guest', {}, '', handler, { 'content-type': 'text/plain' })).status, 415);
  assert.equal((await call('POST', '/session/register', { padding: 'x'.repeat(17000) })).status, 413);
  const limited = createHandler({ prepare: async () => ({ db, collection }), limit: 1 });
  assert.equal((await call('GET', '/health', undefined, '', limited)).status, 200);
  assert.equal((await call('GET', '/health', undefined, '', limited)).status, 429);
  const broken = createHandler({ prepare: async () => { throw new Error('secret-host-and-key'); } });
  const response = await call('GET', '/health', undefined, '', broken);
  assert.equal(response.status, 503); assert(!JSON.stringify(response).includes('secret-host-and-key'));
});

test('logout during a profile write or invoice delete cannot report success or change data', async () => {
  const registered = await call('POST', '/session/register', registration('write-race'));
  let sessionCookie = cookie(registered);
  const saved = await call('POST', '/invoices/write-race', { lineItems: [{ id: 100 }] }, sessionCookie);
  const invoiceId = saved.jsonBody.data._id;
  const revokingCollection = new Proxy(collection, {
    get(target, key) {
      if (key === 'findOne') return async (...args) => {
        const user = await target.findOne(...args);
        if (user?._id === 'user:write-race') await target.updateOne({ _id: user._id }, { $set: { sessions: [] } });
        return user;
      };
      const value = target[key];
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });
  const racing = createHandler({ prepare: async () => ({ db, collection: revokingCollection }) });
  assert.equal((await call('PUT', '/session/profile', { firstName: 'Must not save', lastName: 'Customer' }, sessionCookie, racing)).status, 401);
  assert.equal((await collection.findOne({ _id: 'user:write-race' })).profile.firstName, 'Fictional');
  sessionCookie = cookie(await call('POST', '/session/login', { userName: 'write-race', password: pass }));
  assert.equal((await call('DELETE', `/invoices/${invoiceId}`, undefined, sessionCookie, racing)).status, 401);
  assert.equal((await collection.findOne({ _id: 'user:write-race' })).invoices.length, 1);
});

test('fixed 96-hour expiry removes visitors and guest additions, preserves seeds, and frees names', async () => {
  const R = require('../retention');
  const time = Date.now();
  let clock = time;
  const isolated = db.collection('retention');
  await isolated.insertMany([
    { _id: 'shared-demo', userName: 'demo', guest: true, isDemo: true, profile: users[0], invoices: seedInvoices(), sessions: [] },
    { _id: 'account-registry', names: [] },
  ]);
  const target = createHandler({ prepare: async () => ({ db, collection: isolated }), now: () => clock, limit: 1000, authLimit: 1000 });
  const result = await call('POST','/session/register',{...registration('expiryuser'),isDemo:true,expiresAt:9999999999999},'',target);
  assert.equal(result.status,201);
  let token = cookie(result);
  const registered = await isolated.findOne({_id:'user:expiryuser'});
  assert.equal(registered.isDemo,false);
  assert.equal(registered.expiresAt,time+R.RETENTION_MS);
  await call('PUT','/session/profile',{firstName:'Edited',lastName:'Sample'},token,target);
  assert.equal((await isolated.findOne({_id:'user:expiryuser'})).expiresAt,registered.expiresAt);
  const guestResult = await call('POST','/session/guest',{},'',target);
  const guestToken = cookie(guestResult);
  const invoice = await call('POST','/invoices/demo',{lineItems:[{id:100}]},guestToken,target);
  assert.equal(invoice.status,200);
  assert.equal(invoice.jsonBody.data.isDemo,false);
  const seed = (await isolated.findOne({_id:'shared-demo'})).invoices[0];
  assert.equal((await call('DELETE',`/invoices/${seed._id}`,undefined,guestToken,target)).status,403);
  clock=time+R.RETENTION_MS-1;
  const login = await call('POST','/session/login',{userName:'expiryuser',password:pass},'',target);
  assert.equal(login.status,200);token=cookie(login);
  clock++;
  assert.equal((await call('GET','/session/me',undefined,token,target)).status,401);
  assert.equal(await isolated.countDocuments({_id:'user:expiryuser'}),0);
  assert.equal((await isolated.findOne({_id:'shared-demo'})).invoices.length,2);
  assert.deepEqual((await isolated.findOne({_id:'account-registry'})).names,[]);
  assert.equal((await call('POST','/session/register',registration('expiryuser'),'',target)).status,201);
  assert.equal((await R.cleanup(isolated,clock)).accountsDeleted,0);
});
