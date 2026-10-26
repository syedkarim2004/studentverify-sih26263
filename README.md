# StudentVerify — SIH26263

Working independent prototype for APAAR-linked admissions monitoring using synthetic data.

## Implemented
- React/TypeScript dashboard, institution perspectives, searchable paginated student records.
- CSV import with preview, structural validation, 500-row/2 MB UI limits.
- Missing/invalid ID checks, exact-identifier potential duplicate flags, configurable demo intake checks.
- Record corrections, reasoned finding review, timestamped activity history.
- Synthetic consent grant/revoke and limited verification record export.
- Server persistence in Cloudflare D1 with revision-based concurrent-update protection.

## Run
See [CODEX_HANDOFF.md](CODEX_HANDOFF.md) for portable local setup and continuation instructions.

Install with the Sites dependency helper, generate schema migrations (`npm run db:generate` only after schema changes), build, apply pending local D1 migrations, and start the managed Sites preview. Hosting manifest: `.openai/hosting.json`.

## Limits and next steps
This hosted prototype uses TypeScript server routes and D1 rather than the proposed FastAPI/PostgreSQL production stack. Role switching is a demo perspective selector, not institution authentication. All record operations are within the private owner's workspace. API handlers must not be deployed publicly without authenticated operator and institution permissions. Header identity is provided by Sites dispatch; absent headers fall back to a private-preview workspace.

APAAR, AICTE and DigiLocker services are not connected. IDs are format-checked and matched against synthetic data only. No authenticity claims. Consent controls demonstrate a scenario; production consent must be recorded from the actual student and enforced on the server. The API returns the full owner workspace because this is a private demonstration, not a third-party verification endpoint.

Student profiles and enrolments currently share one prototype record; production should normalize identity, enrolment, institution, programme/intake, consent, findings and audit tables. Intake rules are demonstration settings and need official versioned category-specific requirements. Name similarity/anomaly ML, XLSX import, signed certificates and external integration adapters are future work. Activity history is traceable but not an immutable compliance ledger.
