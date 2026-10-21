const RETENTION_MS = 96 * 60 * 60 * 1000;
const active = (user, now) => Boolean(user && (user.guest || user.expiresAt === undefined || user.expiresAt > now));
const visibleInvoices = (invoices, now) => (invoices || []).filter(invoice => invoice.isDemo === true || invoice.expiresAt === undefined || invoice.expiresAt > now);
async function cleanup(collection, now = Date.now()) {
  const expired = await collection.find({ _id: { $regex: '^user:' }, isDemo: false, expiresAt: { $lte: now } }).project({ _id: 1, userName: 1, expiresAt: 1 }).limit(100).toArray();
  let accountsDeleted = 0;
  for (const user of expired) {
    const result = await collection.deleteOne({ _id: user._id, isDemo: false, expiresAt: user.expiresAt });
    accountsDeleted += result.deletedCount;
  }
  // Recover an interrupted account deletion or failed registration. A generation ID
  // prevents a stale cleanup run from releasing a newly reused username.
  const registry = await collection.findOne({ _id: 'account-registry' });
  for (const name of registry?.names || []) {
    const reservation = registry.reservations?.[name];
    if (!reservation?.id || reservation.createdAt > now - 15 * 60 * 1000) continue;
    if (await collection.findOne({ _id: `user:${name}` }, { projection: { _id: 1 } })) continue;
    await collection.updateOne({ _id: 'account-registry', [`reservations.${name}.id`]: reservation.id }, {
      $pull: { names: name }, $unset: { [`reservations.${name}`]: '' }
    });
  }
  const result = await collection.updateOne({ _id: 'shared-demo' }, { $pull: {
    invoices: { isDemo: false, expiresAt: { $lte: now } }, sessions: { expiresAt: { $lte: now } }
  } });
  return { accountsDeleted, guestRecordsCleaned: result.modifiedCount };
}
module.exports = { RETENTION_MS, active, visibleInvoices, cleanup };
