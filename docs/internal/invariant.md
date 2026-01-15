# VERA System Invariants

This document defines guarantees that must hold true across all
changes to the VERA codebase.

Breaking any invariant requires explicit architectural review.

## Identity & Access

- Clerk is the sole identity provider.
- Supabase is DB-only and never used for authentication or session state.
- All access and tier decisions are derived server-side from `user_entitlements`.
- The client never supplies tier, access level, or SIM state.

## Execution Order

For `/api/chat`, the following execution order is mandatory:

1. Identity resolution
2. Entitlement resolution
3. Gates and quota enforcement
4. Governance evaluation (IBA + SIM)
5. Model execution (if permitted)
6. noDrift enforcement
7. Finalization
8. Telemetry and audit logging

No model call may occur before steps 1–4.

## Model Control

- Models are downstream dependencies, not decision-makers.
- No model determines depth, pacing, tier, or consent state.
- All model calls are bounded by hard server-side timeouts.
- Provider calls do not retry automatically.

## Output Finalization

`finalizeResponse()` is the single user-visible exit gate for `/api/chat`.

No user-facing natural language content may be returned without
passing through this function, including:
- gate responses
- templates
- consent flows
- crisis paths
- provider-failure fallbacks

## Consent

- Challenge consent must be explicit and scoped to a single interaction.
- Consent artifacts must be server-authentic.
- Invalid or malformed consent fails closed.
- The client may express intent, but the server determines eligibility.

## Memory

- Persistent memory is sanctuary-only.
- Memory extraction output must be schema-validated and size-capped.
- Injection-like or directive content must not be stored.
- Memory may influence future prompts but is never returned verbatim.

## Observability

- Enforcement decisions, SIM state, and model provenance are logged server-side.
- Provenance is never exposed to the client.
- Audit logs must be sufficient to reconstruct decisions without revealing policy code.

## Sanctuary Surface Invariant

Sanctuary is an entitlement-backed capability state, not a navigable surface.

No server response, client route, or UI control may imply that Sanctuary is a separate page, mode switch, or destination. All Sanctuary behavior occurs within the primary chat surface.
