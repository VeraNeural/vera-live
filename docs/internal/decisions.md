# Architectural Decisions

This document records major, irreversible architectural decisions.
Minor refactors and routine changes are excluded.

## 2024-XX-XX — Universal Finalization Gate

Decision:
All user-visible responses from `/api/chat` must pass through
`finalizeResponse()`.

Rationale:
To guarantee uniform output shaping and prevent drift across
early-return branches.

Scope:
Applies to all user-facing responses, including gates, templates,
consent flows, crisis paths, and provider-failure fallbacks.

Non-Changes:
Governance logic (IBA, SIM), noDrift logic, and tier enforcement
were not modified.
