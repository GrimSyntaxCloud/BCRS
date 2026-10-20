const { randomBytes, scrypt, timingSafeEqual, createHash } = require('node:crypto');
const { promisify } = require('node:util');
const derive = promisify(scrypt);
const SESSION_MS = 8 * 60 * 60 * 1000;
const digest = value => createHash('sha256').update(value).digest('hex');
function fail(status, message) { throw Object.assign(new Error(message), { status }); }
function username(value) {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9_-]{3,32}$/.test(value)) fail(400, 'Use 3–32 letters, numbers, underscores or hyphens for your username.');
  return value.toLowerCase();
}
function password(value) {
  if (typeof value !== 'string' || value.length < 12 || Buffer.byteLength(value) > 128) fail(400, 'Use a password of at least 12 characters and at most 128 bytes.');
  return value;
}
async function hashPassword(value, salt = randomBytes(16).toString('hex')) {
  const hash = await derive(value, salt, 64, { N: 65536, r: 8, p: 2, maxmem: 96 * 1024 * 1024 });
  return `${salt}:${hash.toString('hex')}`;
}
async function verifyPassword(value, stored) {
  if (typeof value !== 'string' || Buffer.byteLength(value) > 128) return false;
  // Missing users still pay the same password-hash cost.
  const expected = stored || `${'0'.repeat(32)}:${'0'.repeat(128)}`;
  const actual = await hashPassword(value, expected.split(':')[0]);
  return timingSafeEqual(Buffer.from(actual.split(':')[1], 'hex'), Buffer.from(expected.split(':')[1], 'hex')) && !!stored;
}
function profile(body) {
  const result = {};
  for (const [key, max] of Object.entries({ firstName: 60, lastName: 60, email: 120, phoneNumber: 30, address: 240 })) {
    const value = body?.[key] ?? '';
    if (typeof value !== 'string' || value.length > max) fail(400, `Invalid ${key}.`);
    result[key] = value.trim();
  }
  if (!result.firstName || !result.lastName) fail(400, 'First and last name are required. Use fictional details.');
  if (result.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)) fail(400, 'Enter a valid example email address.');
  return result;
}
function publicUser(user) {
  return { _id: user._id, userName: user.userName, ...user.profile, role: { text: user.guest ? 'admin' : 'standard' }, guest: !!user.guest, isDisabled: false };
}
function sessionCookie(token, secure = true, maxAge = SESSION_MS / 1000) {
  return `bcrs_session=${token}; Path=/api; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure ? '; Secure' : ''}`;
}
function readSession(request) {
  const token = (request.headers.get('cookie') || '').split(';').map(x => x.trim()).find(x => x.startsWith('bcrs_session='))?.slice(13);
  if (!token || !/^[a-z0-9_-]{3,32}\.[a-f0-9]{64}$/.test(token)) return null;
  return { userName: token.split('.')[0], hash: digest(token) };
}
async function authenticate(request, collection, time) {
  const session = readSession(request);
  if (!session) fail(401, 'Please sign in to continue.');
  const id = session.userName === 'demo' ? 'shared-demo' : `user:${session.userName}`;
  const user = await collection.findOne({ _id: id, sessions: { $elemMatch: { hash: session.hash, expiresAt: { $gt: time } } } });
  if (!user) fail(401, 'Your session has expired. Please sign in again.');
  return { user, session };
}
async function issueSession(collection, user, time, secure, passwordHash) {
  const token = `${user.userName}.${randomBytes(32).toString('hex')}`;
  const filter = { _id: user._id };
  // A concurrent password change must invalidate a login using the old password.
  if (passwordHash) filter.passwordHash = passwordHash;
  const result = await collection.updateOne(filter, { $push: { sessions: { $each: [{ hash: digest(token), expiresAt: time + SESSION_MS }], $slice: user.guest ? -100 : -3 } } });
  if (!result.matchedCount) fail(401, 'Please sign in again.');
  return sessionCookie(token, secure);
}
module.exports = { fail, username, password, hashPassword, verifyPassword, profile, publicUser, sessionCookie, readSession, authenticate, issueSession };
