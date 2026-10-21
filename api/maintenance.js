const mongoose = require('mongoose');
(async () => {
  if (process.env.DEMO_MAINTENANCE === 'true') throw new Error('Migration in progress');
  const { collection } = await require('./database').database();
  console.log(JSON.stringify(await require('./retention').cleanup(collection)));
})().catch(() => { console.error('Cleanup failed; no records or credentials are logged.'); process.exitCode = 1; }).finally(() => mongoose.disconnect());
