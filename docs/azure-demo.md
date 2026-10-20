# BCRS fictional demo on Azure

This deployment preserves the repair catalog, cart, invoice preview, persistent
sample invoices, and purchases chart. User, role, and security-question screens
show read-only fictional examples. Registration, recovery, password changes and
account edits are disabled in the UI and rejected independently by the API.
Opening the demo is not authentication. There are no real orders or payments.

## Data and costs

- Azure Static Web Apps **Free**, with an included managed Node.js 22 Functions API.
- The existing Cosmos DB MongoDB API free-tier account is reused; no second Cosmos
  account, App Service plan, dedicated Functions plan or logging resource is created.
- Database `bcrs-demo`, collection `demo`, dedicated throughput **400 RU/s**.
  Nodebucket uses 400 RU/s separately: aggregate **800 RU/s**, within the existing
  **1,000 RU/s** account cap and free allowance.
- One fixed document retains the latest **50** invoices using an atomic bounded
  append. Invoice content comes from the fixed service catalog; arbitrary names,
  descriptions, email addresses, passwords and security answers are not stored.
  Pricing is recalculated server-side. Adjustment amounts and request sizes are bounded.
- The API throttles each warm instance to 120 requests/minute. This is not a
  distributed rate limit; Cosmos throughput and bounded storage are separate safeguards.
- Total free-tier Cosmos storage is 25 GB across the account. The deployment uses
  the existing single region and backup settings.
- Subscription **spending limit stays On**. The Free Trial expires after 30 days
  or credit exhaustion; services can stop then. Do not upgrade or remove the limit.

## Provisioning and deployment

`infra/main.bicep` references the existing account in resource group `nodebucket-demo`.
Check account free tier, throughput and spending limit before provisioning.
Run `az deployment group validate` and `what-if` before `create`. The template
puts the connection string directly in API app settings without outputting it.

GitHub Actions tests and builds pull requests. Deployment is enabled by repository
variable `AZURE_DEPLOY_ENABLED=true`, uses secret `AZURE_STATIC_WEB_APPS_API_TOKEN`,
and runs only from `main` in the `azure` environment. The environment must be
restricted to `main`. The deploy job checks `/api/health` against a real database ping.

`scripts/package-azure.mjs` allowlists the frontend and API runtime files. It excludes
legacy server source, local preview code, database config, tests and Git history.
The database credential is never included in the browser or deployment archive.
The account key grants server-side access to this shared Cosmos account; keep it secret.

## Local development

Use Node 22. Run `npm ci`, `npm ci --prefix api`, `npm run build`,
and `npm run test:api`. Tests use an ephemeral local MongoDB process and fictional
data, not the original Atlas database.

For a local preview, set `MONGODB_URI` and `MONGODB_DATABASE=bcrs-demo` as server
environment variables, then run `node api/local.js`. For a private `.env`, use
`node --env-file=.env api/local.js`. Never commit `.env`.

The original Angular 14 frontend and its build dependencies are legacy software.
This is a portfolio demo, not a production account or commerce system.

## Original database

No original MongoDB Atlas data was accessed or copied. The original database
connection string is removed from the current configuration, but remains in Git
history. Its owner should rotate/revoke those old credentials if still active.
Legacy model/route source remains for coursework reference and is not deployed.

Original project contributors: Andres Macias, Patrick Wolff, and April Yang.
