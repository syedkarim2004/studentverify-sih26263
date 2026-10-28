# StudentVerify development guide

## Requirements

- Node.js 22.13 or newer
- pnpm 11
- Git

The repository runs in portable mode outside the original managed host. No AICTE, APAAR, DigiLocker or ABC credentials are required because every included record and response is synthetic.

## Clean setup

```sh
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit
pnpm run test:validation
pnpm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 migrations apply DB --local --config dist/server/wrangler.json --persist-to .wrangler/state
pnpm run dev
```

Use the URL printed by the development server. Apply only migrations that have not already been applied; migrations are append-only.

## Current local dataset

- 10,000 synthetic student enrolment records
- 12 synthetic institutions
- Six programmes
- General, NRI, OCI, Foreign National and Supernumerary categories
- Active, transferred and withdrawn lifecycle states
- Controlled missing, malformed, same-institution duplicate and cross-institution overlap signals

The workspace document is gzip-serialized before D1 persistence to remain within local D1 value limits. This is a prototype optimization, not the recommended production data model.

## Required verification after changes

For code changes, run:

```sh
pnpm exec tsc --noEmit
pnpm run test:validation
pnpm run build
```

For validation or workflow changes, also exercise relevant synthetic cases through the API or browser: CSV import, correction, duplicate review, intake checks, consent-gated verification and activity history.

## Trust and security boundaries

- A local format check or repository match is not official APAAR verification.
- The role selector is a perspective demonstration, not authentication.
- The verification API enforces expiring demo consent and limited responses, but verifier identity and student authorization remain synthetic.
- The unauthenticated local preview fallback must be removed before shared or public production use.
- Repeated enrolments require human review for transfers, corrections and legitimate concurrent study.

## Production backlog

1. Real identity, institution tenancy and operator permissions.
2. Normalized students, identities, enrolments, institutions, programmes and consent records.
3. Authorized AICTE and APAAR integration adapters.
4. Field-level disclosure policy, rate limits, revocation and immutable audit storage.
5. XLSX ingestion, idempotent imports and versioned intake rules.
6. Digitally signed credentials and certificate QR verification.
7. Automated API, authorization, accessibility and mobile-browser testing.

## Known engineering debt

The production build and TypeScript checks pass, but the current single-file portal predates the repository's strict ESLint defaults. `pnpm run lint` still reports explicit-`any` and React effect-style findings in `app/page.tsx` and the workspace request parser. Split the page into typed feature modules and remove those suppressible patterns before treating lint as a required CI gate.
