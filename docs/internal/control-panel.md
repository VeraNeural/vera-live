# VERA Control Plane Overview

This document describes the server-side execution flow of VERA.
It is intentionally high-level and non-exhaustive.

## Control Plane Flow

1. A request enters `/api/chat`.
2. Identity is resolved server-side (Clerk or anonymous session).
3. Entitlements are resolved from `user_entitlements`.
4. Gates and quotas are enforced.
5. Governance is evaluated (IBA + SIM).
6. A model is executed only if permitted.
7. Post-generation enforcement is applied (noDrift).
8. Output is finalized via `finalizeResponse()`.
9. Telemetry and audit events are recorded.

## Boundaries

- The client does not control prompts, temperature, or safety behavior.
- Governance is not enforced in the UI.
- Models never bypass server-side policy enforcement.
