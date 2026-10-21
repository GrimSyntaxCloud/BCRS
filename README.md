# BCRS — Bob’s Computer Repair Shop

A full-stack computer repair shop demo with registration, account profiles,
service selection, saved invoices, and a purchases chart. The Angular interface
calls a Node.js API; accounts and invoices persist in Azure Cosmos DB through its
MongoDB-compatible API.

**[Open the live demo](https://brave-river-09cd8f10f.6.azurestaticapps.net)** ·
[Portfolio](https://grimsyntaxcloud.github.io/projects/bcrs/)

Originally a team coursework project by **Andres Macias, Patrick Wolff, and
April Yang**, using teaching material by Professor Krasso. Contributor credits
remain in the source. The portfolio version adapts the project for Azure hosting
and adds isolated demo accounts and automated deployment checks.

## Try it

1. Register with fictional names and a unique demo password (at least 12 characters).
2. Edit your profile, choose a repair service, and open your cart.
3. Review and save a sample invoice, then visit **My invoices** and the purchases chart.
4. Sign out and back in to see the saved data. You can change your password or
   delete your account and its invoices from your profile.

You can also open the guest demo without registering. Guest visitors share sample
invoices and can browse read-only fictional administration records. Registered
accounts have their own profiles and invoices. No real repair orders, payments,
or email messages are sent.

## How it works

```text
Angular browser app → /api → Node.js Azure Functions → Cosmos DB (MongoDB API)
```

- **Frontend:** Angular 21 (LTS), TypeScript, Angular Material, PrimeNG, and Chart.js.
  Forms collect input, services call the API, and route guards check the session.
- **API:** `api/handler.js` handles sessions, profiles, and invoices. The API checks
  authorization independently of the frontend and calculates prices from its own
  service catalog rather than trusting browser totals.
- **Accounts:** passwords are salted scrypt hashes. Random session tokens use
  HttpOnly cookies; the database stores only token hashes. Password changes revoke
  existing sessions. Registered users cannot read another account’s invoices.
- **Storage:** Azure database `portfolio-demos`, collection `bcrs_demo` (local defaults remain `bcrs-demo` / `demo`). Each account document owns
  its profile, sessions, and invoices. A separate registry document reserves
  usernames and bounds registrations; a guest document holds the shared samples.
- **Deployment:** GitHub Actions tests, builds, and packages pull requests. An
  enabled deployment from `main` publishes to Azure Static Web Apps and checks a
  real database ping. CI does not create cloud resources.

| Location | Purpose |
| --- | --- |
| `src/app/pages/`, `src/app/shared/` | Screens, forms, models, and Angular services |
| `api/accounts.js` | Password hashing, sessions, and account validation |
| `api/demo.js` | Fictional data, service prices, and invoice calculations |
| `api/database.js` | Cosmos/MongoDB connection and initial demo records |
| `api/test/` | Database integration tests and disposable local preview |
| `infra/`, `.github/workflows/azure.yml` | Azure configuration and CI/CD |

## Run locally without Azure

Use **Node.js 22.12 or newer within Node 22**, and npm.

```sh
npm ci
npm ci --prefix api
npm run build
npm run preview
```

Open **http://127.0.0.1:3000**. The preview starts a disposable local MongoDB
process, seeds fictional records, and runs the same API handler used on Azure.
It downloads a MongoDB binary on first use, so that first run needs internet
access. Stop it with Ctrl+C; its data is temporary. No Azure credentials or cloud
subscription are needed.

To use your own **local** MongoDB instead, create the `demo` collection in a
`bcrs-demo` database, copy `.env.example` to `.env`, and run:

```sh
npm run build
node --env-file=.env api/local.js
```

That database persists between runs. `npm start` runs only the Angular development
server; it is not a complete backend/database setup. See
[the setup guide](docs/azure-demo.md) for deployment and environment details.

## Verify changes

```sh
npm audit
npm audit --prefix api
npm run test:api
npm run test:ui
npm run build
npm run package:azure
```

API tests use disposable MongoDB and cover registration, session revocation,
account isolation, invoice validation, concurrent requests, and capacity limits.
Vitest tests cover cart recovery, catalog prices, totals, persistence, and real
Angular/Material/PrimeNG template rendering. Tests use jsdom; Chrome is not required.
Packaging includes only the built site and the API’s production dependencies.

## Framework maintenance

The frontend uses Angular 21.2, Material/CDK 21.2, PrimeNG 21, TypeScript 5.9,
and Angular’s application builder. Native CSS replaces retired Flex Layout.
NgModules, zone-based updates, the original routes, and the existing API remain.
The build output stays in `dist/bcrs`, preserving local and Azure packaging.

The npm overrides pin Vite 7.3.7 and the Angular CLI’s MCP SDK 1.32.1 to
patched compatible versions. Recheck those overrides when upgrading the CLI.

## Credentials and demo boundaries

- Azure holds `MONGODB_URI` in server-only application settings. GitHub Actions
  holds the deployment token in `AZURE_STATIC_WEB_APPS_API_TOKEN`. Neither belongs
  in source code, browser configuration, screenshots, or logs. `.env` is ignored.
- The demo accepts up to 100 accounts and retains each account’s latest 50 invoices.
  Use fictional details. Email recovery and a production administration system
  are not implemented; the guest admin screens are examples only.
- Azure uses Static Web Apps Free and a shared 400 RU/s database pool in the Cosmos
  free-tier account. Keep the subscription spending limit enabled. Free Trial
  expiration can make the live demo unavailable; local development remains available.
- Angular 21 and its UI libraries use patched, locked dependencies. CI audits the
  complete frontend toolchain and the independently locked API. A clean audit
  covers known dependency advisories, not every possible application vulnerability.
- The retired Atlas-backed server has been removed from the current source.
  See [the setup guide](docs/azure-demo.md#original-database) for the status of
  historical credentials; the app does not connect to the original Atlas database.

## Shared demo database and 96-hour retention

Azure uses `portfolio-demos`, a single **400 RU/s manual shared pool** for Nodebucket, BCRS, and Pets-R-Us. Collections share capacity, while separate MongoDB roles restrict each app to its own collections. The account remains free-tier, single-region, capped at 1,000 RU/s; the subscription spending limit stays enabled. Do not upgrade the trial when it expires. The infrastructure template references an existing pool and requires a private scoped credential; it does not create dedicated allocations.

Visitor data expires 96 hours after creation. Edits and task moves do not renew the deadline. BCRS accounts and their invoices expire together; invoices added to its shared guest preview have their own deadline. Nodebucket keeps its employee board and permanent sample task. Server-owned `isDemo` flags protect the fictional samples from cleanup and deletion.

The API rejects expired data at the deadline. `.github/workflows/cleanup.yml` also runs hourly using the `azure` environment secret `DEMO_CLEANUP_MONGODB_URI` and repository variable `DEMO_CLEANUP_ENABLED=true`. It logs counts only. GitHub can delay schedules or disable them after 60 days of repository inactivity, so physical deletion happens on the next successful cleanup, usually within an hour; API requests provide another cleanup opportunity. Check Actions when maintaining the demo.

`DEMO_MAINTENANCE=true` returns HTTP 503 before database access during backups or migration. Existing unclassified visitor data receives a one-time 96-hour grace period during migration. Database credentials stay in server application settings and protected Actions secrets, never frontend code or committed configuration. Local setup instructions and local database defaults above remain unchanged.
