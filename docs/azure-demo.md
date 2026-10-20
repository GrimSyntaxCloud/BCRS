# BCRS fictional demo on Azure

This is a full-stack portfolio application: visitors register a fictional account,
sign in, edit their profile, change their password, create/read/delete invoices,
and view their own purchases chart. Accounts and invoices persist in Cosmos DB.
The optional guest account shares fictional invoices and read-only administration
examples. Guest access never lists or changes registered accounts.
There are no real orders or payments. Email recovery is not configured; the
original unauthenticated password-reset/security-answer routes remain disabled.

## Authentication and account boundaries

- Passwords use salted scrypt (`N=65536, r=8, p=2`, 64-byte output), following an
  [OWASP recommended configuration](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).
  Plaintext passwords are never stored or returned. Password length is 12–128
  characters, with an additional 128-byte maximum enforced by the API.
- Sessions use random 256-bit tokens in `HttpOnly; Secure; SameSite=Strict` cookies,
  scoped to `/api`, with an eight-hour expiry. Only token hashes are stored.
  Up to three sessions per registered account are retained. Logout revokes a
  token; password changes revoke all tokens. Local preview omits `Secure` only.
- The legacy `sessionuser` cookie is a display hint, never authorization. Route
  guards check the server session; every protected API independently checks it.
- The API derives invoice ownership and roles from the server session, ignores
  client-supplied roles/totals, and allowlists editable profile fields. Registered
  users receive `standard` access. The guest's administrator label is only a
  preview of fictional seed records, with no access to registered accounts.
- Writes require a custom same-origin request header and JSON bodies. No
  cross-origin CORS access is granted. Requests identified as cross-site fail.
- Password operations are limited to two concurrent hashes and 20 per minute
  per warm instance. Ten login attempts per account per 15 minutes are enforced
  in the database across instances. Successful sign-in resets that account limit.
- Profile changes, password changes, and account deletion require a valid
  session. Password changes/deletion also verify the current password. Deleting
  an account removes its invoices and releases its reserved username.

## Data and costs

- Azure Static Web Apps **Free**, with an included managed Node.js 22 Functions API.
- The existing Cosmos DB MongoDB API free-tier account is reused; no second Cosmos
  account, App Service plan, dedicated Functions plan or logging resource is created.
- Database `bcrs-demo`, collection `demo`, dedicated throughput **400 RU/s**.
  Nodebucket uses 400 RU/s separately: aggregate **800 RU/s**, within the existing
  **1,000 RU/s** account cap and free allowance.
- At most **100 registered accounts**, each retaining its latest **50** invoices,
  plus a shared guest account with 50 invoices. An atomic registry reserves
  canonical usernames and enforces the account cap without a second collection.
  Profile fields, sessions, request sizes and invoice item counts are bounded.
  No arbitrary invoice descriptions or security answers are stored. Prices are
  recalculated from the catalog on the server.
- Registered accounts persist until their owner deletes them or the demo is
  reset. Use fictional details and a unique demo password. No real email is
  needed for registration. At capacity, new registrations receive a clear error;
  existing accounts continue working. On an uncertain registration failure, the
  reserved username is retained conservatively; an operator can reconcile any
  orphan reservation after checking whether its account document exists.
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
