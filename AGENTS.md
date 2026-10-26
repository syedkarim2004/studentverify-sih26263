# StudentVerify — Codex project context

## Goal
Continue SIH26263: an APAAR-based student data management and verification platform for AICTE-approved institutions.

## Current state
- React/TypeScript with Vinext; server API at app/api/workspace/route.ts.
- Hosted prototype uses Cloudflare D1, not FastAPI/PostgreSQL.
- Shared types, synthetic data and validation rules: lib/model.ts.
- Schema: db/schema.ts. Existing schema migration: drizzle/0000_chief_argent.sql.
- UI: app/page.tsx and app/globals.css.
- Features: CSV preview/import, paginated student search, institution dashboards, duplicate/format/intake flags, corrections, reasoned reviews, activity history, synthetic consent/verification demo.
- Source export contains no database data, credentials, installed dependencies or build output. Original Sites project identity has been removed from the export. Do not infer deployment ownership from this repository.

## Product boundaries
Use synthetic records until actual data access is authorized. Never label format checks or local matches as official APAAR verification. Current role selector and consent controls are demonstrations, not production security. Keep those labels explicit.

The private prototype returns the owner workspace. Before any shared/public production use, implement real institution-scoped authorization, server-enforced consent and limited verifier responses; remove the unauthenticated preview workspace fallback. Normalize student identities separately from enrolments. Repeated APAAR enrolments require review for transfers and legitimate concurrent study, not automatic misconduct conclusions.

## Development
Read README.md and CODEX_HANDOFF.md first. Preserve Sites/Vinext build integration if continuing that deployment target. Local setup must use portable mode outside the original managed host. Never replay applied migrations; append new schema migrations. Run TypeScript checks and a production build for code changes. Test changed validation behavior with synthetic cases.

## Agreed future direction
The proposed production stack was React + TypeScript, Python FastAPI, PostgreSQL and Pandas; Supabase Auth/Storage were recommended. The current implementation is a hosted TypeScript/D1 prototype. Any migration should preserve working flows and explain infrastructure requirements rather than silently replacing functionality.
