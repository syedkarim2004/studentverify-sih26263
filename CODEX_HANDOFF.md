# StudentVerify handoff

Read `README.md`, `AGENTS.md`, `docs/ARCHITECTURE.md` and `docs/DEVELOPMENT.md` before changing the application.

## Current implementation

- React 19 and TypeScript with Vinext and Cloudflare Workers
- Cloudflare D1 workspace and policy-scenario persistence
- 10,000-record synthetic dataset across 12 institutions and six programmes
- Interactive command-centre dashboard and admissions analytics
- CSV preview/import, manual records, corrections and pagination
- Optimized duplicate, APAAR-format, reference-data and intake validation
- Explainable cross-institution investigation and Policy Digital Twin
- Purpose-bound, consent-gated synthetic verification response
- Reports, certificate display, API contract and activity history

## Important files

- `app/page.tsx`: portal workflows and visualizations
- `app/globals.css`: responsive design system
- `app/api/workspace/route.ts`: workspace reads and writes
- `app/api/verification/route.ts`: limited demo verification response
- `app/api/integration/route.ts`: institutional batch validation contract
- `app/api/policy-twin/route.ts`: policy scenarios
- `lib/model.ts`: types, synthetic seed and validation rules
- `lib/state-storage.ts`: transparent gzip workspace serialization
- `db/schema.ts` and `drizzle/`: append-only D1 schema history

## Non-negotiable boundaries

All included records and APAAR responses are synthetic. Never describe format checks or repository matches as official APAAR verification. The current role selector, local owner fallback and consent controls are demonstration mechanisms, not production security. Do not infer deployment ownership from this source export.

Before production use, implement real institution-scoped authorization, actual student consent, normalized enrolments, official adapters, least-privilege disclosure, encryption, retention controls and immutable audit storage.

## Before handing off code

```sh
pnpm exec tsc --noEmit
pnpm run test:validation
pnpm run build
```

Do not commit dependencies, local databases, build output, runtime state, screenshots, credentials or environment files.
