const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { HttpRequest } = require('@azure/functions');
const { createHandler } = require('../handler');
const { seedInvoices } = require('../demo');
let mongo, collection, handler;
const call = (method, path, body, target = handler) => target(new HttpRequest({
  method, url: `http://localhost/api${path}`,
  params: { path: path.slice(1) },
  headers: { 'content-type': 'application/json' },
  ...(body === undefined ? {} : { body: { string: JSON.stringify(body) } }),
}));
before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri(), { dbName: 'bcrs-test' });
  const db = mongoose.connection.db;
  collection = db.collection('demo');
  await collection.insertOne({ _id: 'shared-demo', invoices: seedInvoices() });
  handler = createHandler({ prepare: async () => ({ db, collection }), limit: 500 });
});
after(async () => { await mongoose.disconnect(); await mongo?.stop(); });
test('demo access returns only fictional public records; private account operations are blocked', async () => {
  const result = await call('POST', '/session/login', { userName: 'demo' });
  assert.equal(result.status, 200);
  assert.equal(result.jsonBody.data.email, 'demo@example.com');
  assert(!JSON.stringify(result.jsonBody).includes('password'));
  assert.equal((await call('POST', '/session/login', { userName: { $ne: '' } })).status, 401);
  for (const path of ['/session/register', '/session/users/demo/reset-password', '/users', '/roles', '/security-questions']) {
    assert.equal((await call('POST', path, { password: 'never-save-this' })).status, 403);
  }
  assert.equal((await call('GET', '/users/demo/role')).jsonBody.data.text, 'admin');
  assert.equal((await call('GET', '/health')).jsonBody.status, 'ok');
});
test('invoice persists canonical catalog prices and ignores client-supplied identity or totals', async () => {
  const result = await call('POST', '/invoices/demo', {
    userName: 'real-person', email: 'private@example.test',
    lineItems: [{ id: 100, title: 'forged', price: 0, laborHours: 0 }],
    total: -100, adjustedParts: 10, adjustedLabor: 5,
  });
  assert.equal(result.status, 200);
  const invoice = result.jsonBody.data;
  assert.equal(invoice.total, 104.99);
  assert.equal(invoice.userName, 'demo');
  assert.equal(invoice.lineItems[0].title, 'Password Reset');
  assert(!JSON.stringify(invoice).includes('private@example'));
  const stored = (await call('GET', '/invoices')).jsonBody.data.find(x => x._id === invoice._id);
  assert.equal(stored.total, 104.99);
  assert((await call('GET', '/invoices/purchases-graph')).jsonBody.data.some(x => x._id.title === 'Password Reset'));
  assert.equal((await call('DELETE', `/invoices/${invoice._id}`)).status, 200);
});
test('rejects unknown services, excessive items, negative adjustments and other invoice owners', async () => {
  for (const body of [
    { lineItems: [] }, { lineItems: [{ id: 999 }] },
    { lineItems: Array(15).fill({ id: 100 }) },
    { lineItems: [{ id: 100 }], adjustedParts: -1 },
    { lineItems: [{ id: 100 }], adjustedLabor: 2001 },
    { lineItems: [{ id: 100 }], adjustedParts: '100' },
  ]) assert.equal((await call('POST', '/invoices/demo', body)).status, 400);
  assert.equal((await call('POST', '/invoices/another-user', { lineItems: [{ id: 100 }] })).status, 404);
});
test('atomic concurrent submissions retain only the latest 50 invoices', async () => {
  const results = await Promise.all(Array.from({ length: 60 }, () => call('POST', '/invoices/demo', { lineItems: [{ id: 105 }] })));
  assert(results.every(x => x.status === 200));
  const invoices = (await collection.findOne({ _id: 'shared-demo' })).invoices;
  assert.equal(invoices.length, 50);
  assert.equal(new Set(invoices.map(x => x._id)).size, 50);
});
test('throttles warm instances, bounds request bodies, and sanitizes database errors', async () => {
  const limited = createHandler({ limit: 1 });
  assert.equal((await call('POST', '/session/login', { userName: 'demo' }, limited)).status, 200);
  assert.equal((await call('GET', '/users', undefined, limited)).status, 429);
  assert.equal((await call('POST', '/invoices/demo', { padding: 'x'.repeat(17000) })).status, 413);
  const broken = createHandler({ prepare: async () => { throw new Error('secret-host-and-key'); } });
  const response = await call('GET', '/health', undefined, broken);
  assert.equal(response.status, 503);
  assert(!JSON.stringify(response).includes('secret-host-and-key'));
});
