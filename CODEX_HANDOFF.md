# Continue StudentVerify in Codex

## What to do first
1. Inspect `AGENTS.md`, `README.md`, `lib/model.ts`, and the workspace API.
2. Install project dependencies using the included pnpm lockfile.
3. A clean clone defaults to the portable execution profile.
4. Build, apply the existing schema migration to the local database, and run the app.
5. Verify CSV import, record correction, potential duplicate handling, intake checks, review persistence, and consent demo.

## Requirements and local commands
Node.js >=22.13.0; pnpm; Git. Cloudflare Workers are simulated locally; no APAAR credentials are needed for the synthetic demo.

```sh
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit
pnpm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_chief_argent.sql
pnpm run dev
```

Clean clones have no ignored `.sites-runtime/execution-profile.json` and automatically use portable mode. Do not copy runtime state from the original host. Only apply migrations not already applied. Use the actual URL printed by the development server.

## Validation already completed on the original host
- TypeScript compilation and production build passed.
- Browser: CSV sample download and import, duplicate/missing-ID findings, record correction, saved review, and consent-gated synthetic response.
- Model checks: initial findings, duplicate detection, transfer handling, missing/invalid ID corrections, programme intake and supernumerary exclusion.
- Private Sites deployment succeeded. Its hosted data is separate from a cloned repository's local database.

## Production backlog
1. Real authentication and institution/operator permissions.
2. Normalized PostgreSQL schema and FastAPI migration, if retaining the agreed production stack.
3. Server-enforced consent with actual student authorization and limited verification endpoints.
4. Authorized APAAR/AICTE integration adapters; retain a clearly labelled mock when access is unavailable.
5. XLSX import, idempotent imports, stronger batch validation and configurable versioned intake rules.
6. Verifiable certificate issuance and a durable audit design.
7. Accessibility and mobile-browser testing; automated API integration tests.

## Suggested first Codex task
“Read AGENTS.md and CODEX_HANDOFF.md. Set up and run StudentVerify locally, verify the existing flows, and implement institution-scoped authentication and authorization. Preserve synthetic data and explicit mock APAAR labels. Report architecture decisions before a larger backend migration.”
