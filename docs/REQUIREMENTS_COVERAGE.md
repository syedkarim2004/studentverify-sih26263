# SIH 26263 requirement coverage

This matrix describes the source-export prototype honestly. All records, institutions, consent events and APAAR responses are synthetic.

| Requirement | Prototype coverage | Production work still required |
| --- | --- | --- |
| Institution upload and update | CSV preview/import, manual entry, record correction, workspace API, and demo batch integration API | Authenticated institution-scoped write API, idempotency, XLSX, bulk jobs, and durable normalized storage |
| Intake and category fields | Programme intake rules; actual active enrolment; General, Supernumerary, NRI, OCI and Foreign National categories | Versioned AICTE master data and separate normalized flags where regulations allow combinations |
| Automated validation | Missing/format-only APAAR checks, same-institution duplicates, cross-institution overlap, reference-data inconsistencies, suspicious names, academic-year format, and intake breaches | Authorized APAAR validation, configurable rules, probabilistic matching, evidence ingestion, and human-governed model evaluation |
| Monitoring dashboards | AICTE-wide and institution demo perspectives, search, pagination, filters, findings, timelines and policy simulation | Live event ingestion, institution tenancy, service-level monitoring and governed metrics |
| Authorized verification | Purpose-bound, limited server response gated by expiring demo consent and recorded in activity history | Real verifier identity, student authorization, field-level policy, rate limits, revocation and official source adapters |
| Verifiable records | Downloadable limited demo response and certificate identifier preview | Digitally signed credentials, QR validation, issuer keys and revocation/status registry |
| Integration | JSON validation endpoint and CSV ingestion contract | API gateway, OAuth/mTLS, signed requests, idempotency keys, webhooks and production schemas |
| Security, privacy and audit | Clear prototype labels, expiring demo consent, scoped response, revision conflict handling and activity export | Real RBAC/ABAC, no unauthenticated fallback, encryption/key management, immutable audit, retention, DPIA and security testing |
| Reports | Policy-monitoring CSV, category distribution, findings, activity export and policy scenarios | Scheduled/regulatory templates, governed definitions and warehouse/BI integration |
| APAAR on certificates | Printable synthetic preview showing student ID and APAAR ID | Degree-awarding body integration, signed certificate templates and official identifier validation |

## Non-negotiable trust boundary

A 12-digit format check or a match in this local repository is not official APAAR verification. Repeated enrolments are review signals: transfer, correction or legitimate concurrent study must be considered before any adverse conclusion.
