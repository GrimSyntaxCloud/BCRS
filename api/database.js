const mongoose = require('mongoose');
const { seedInvoices, users } = require('./demo');
let ready;
async function database() {
  if (!ready) ready = (async () => {
    if (!process.env.MONGODB_URI) throw new Error('Database is not configured.');
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DATABASE || 'bcrs-demo',
      retryWrites: false, autoIndex: false, autoCreate: false,
      maxPoolSize: 5, serverSelectionTimeoutMS: 15000,
    });
    const db = mongoose.connection.db;
    const collection = db.collection(process.env.MONGODB_COLLECTION || 'demo');
    await collection.updateOne({ _id: 'shared-demo' },
      { $setOnInsert: { invoices: seedInvoices() } }, { upsert: true });
    await collection.updateOne({ _id: 'shared-demo' }, { $set: { userName: 'demo', guest: true, profile: { firstName: users[0].firstName, lastName: users[0].lastName, email: users[0].email, phoneNumber: users[0].phoneNumber, address: users[0].address } } });
    await collection.updateOne({ _id: 'account-registry' }, { $setOnInsert: { names: [] } }, { upsert: true });
    return { db, collection };
  })().catch(error => { ready = undefined; throw error; });
  return ready;
}
module.exports = { database };
