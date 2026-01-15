# Runtime Execution Flow

This document describes the runtime execution flow for VERA’s
conversational pipeline.

It defines what happens from the moment a message is sent
to the moment a response is returned.

---

## Entry Point

A user sends a message from the client.

The client does not supply:
- identity authority
- entitlement state
- access tier
- governance decisions

All such state is recomputed server-side.

---

## Identity Resolution

The server resolves identity using Clerk.

- Clerk is the sole identity provider
- Anonymous sessions are identified via server-issued session identifiers
- Client-supplied identity fields are ignored

---

## Entitlement Resolution

The server resolves access state from the database.

- Entitlements are derived from `user_entitlements`
- The database is the authoritative source of tier
- Client input cannot elevate access

---

## Pre-Generation Enforcement

Before any model execution, the server enforces:

- quotas and usage limits
- gate conditions
- entitlement-based capabilities
- sanctuary capability constraints

If enforcement fails, the system returns a governed response
without invoking a model.

---

## Governance Evaluation

### SIM Evaluation

The Signal Integrity Model evaluates conversational state.

SIM evaluation always occurs, even if its effects are gated
by configuration.

---

### IBA Routing

IBA determines:
- interaction mode
- challenge eligibility
- response constraints

IBA routing occurs before model selection.

---

## Model Execution

If permitted, the server executes a model call.

- Models are selected based on policy
- Model calls are bounded by hard timeouts
- No automatic retries occur by default

Models are treated as downstream dependencies.

---

## Post-Generation Enforcement

After model output is received:

1. Output is normalized
2. No-drift enforcement is applied
3. Governance contracts are revalidated

Violations trigger fallback behavior.

---

## Finalization

All user-visible output passes through `finalizeResponse()`.

Finalization:
- enforces boundary guarantees
- strips internal annotations
- ensures exit language where required

There are no alternate return paths.

---

## Assertions

Before returning a response, invariant assertions are applied
to ensure that:

- no surface or navigation semantics are introduced
- sanctuary remains a capability state, not a destination

Violations fail loudly.

---

## Return

The server returns a single response envelope.

Responses never include:
- routing instructions
- navigation hints
- entitlement details
- internal provenance

---

## Telemetry and Audit

Telemetry captures:
- enforcement decisions
- SIM state
- governance outcomes
- model provenance

Logs are sufficient to reconstruct system behavior
without exposing policy logic.

---

## Notes

This execution order is mandatory.

Any deviation requires architectural review.
