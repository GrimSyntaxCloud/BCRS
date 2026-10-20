// Disposable local preview. It never uses a supplied cloud connection string.
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
(async () => {
  const mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri();
  process.env.MONGODB_DATABASE = 'bcrs-preview';
  process.env.HOST = '127.0.0.1';
  const server = require('../local');
  const shutdown = () => server.close(async () => {
    await mongoose.disconnect();
    await mongo.stop();
    process.exit(0);
  });
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
})().catch(() => { console.error('Local preview failed.'); process.exitCode = 1; });
