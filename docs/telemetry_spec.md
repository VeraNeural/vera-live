# VERA Telemetry & Audit Specification
Version: 1.0.0
Status: Production
Owner: Core Intelligence

## Purpose

This document defines the telemetry and audit logging system for VERA.

The goals are to:
- Preserve Signal Integrity over time
- Prevent architectural drift
- Provide safety, quality, and compliance auditability
- Establish IP defensibility through demonstrable governance
- Enable internal tuning without exposing user data

This telemetry system is **not analytics**.
It is a **governance ledger**.

---

## Design Principles

1. **Safety-first logging**
   - Log decisions, not diagnoses
   - Log structure, not judgments

2. **Minimal user data**
   - No raw user text by default
   - No permanent storage of sensitive content
   - Use hashes and fingerprints wherever possible

3. **Append-only**
   - Logs are immutable once written
   - No updates or deletions (except retention expiry)

4. **Layer transparency (internal only)**
   - Routing, governance, and model choice must be provable
   - Internal layers are never exposed to users

---

## Event Model

Each user turn produces **one audit event**.

### Event Name
`decision_audit_event`

### Cardinality
- Exactly one per user turn
- Zero tolerance for silent turns

---

## Required Fields (Tier 1 – Always Logged)

### Identifiers
- `event_id` (UUID, primary key)
- `timestamp` (UTC, ISO-8601)
- `conversation_id` (UUID)
- `turn_id` (integer, monotonic per conversation)
- `session_id` (UUID)
- `user_hash` (SHA-256, salted)

### Decision Object
- `intent_primary`
- `intent_secondary[]`
- `state_arousal`
- `state_confidence`
- `state_signals[]`

### Adaptive Codes
- `adaptive_codes[]`
  - `code`
  - `band`
  - `confidence`

### Routing & Governance
- `lead_layer` (N | V)
- `challenge` (none | gentle | direct)
- `pace` (slow | normal | directive)
- `depth` (light | medium | deep)
- `questions_allowed` (integer)
- `somatic_allowed` (boolean)

### Model Execution
- `model_selected` (anthropic | openai | grok_like)
- `model_version`
- `model_fallback_applied` (boolean)
- `model_selection_reason`

### Prompt & Policy Integrity
- `vera_prompt_hash`
- `neural_prompt_hash`
- `iba_prompt_hash`
- `policy_version`

### Output Metrics
- `response_length_chars`
- `response_time_ms`
- `unifier_applied` (boolean)
- `leak_scan_passed` (boolean)

---

## Optional Fields (Tier 2 – Restricted Access)

> Tier 2 is OFF by default and must be explicitly enabled.

- `user_text_excerpt` (max 240 chars, redacted)
- `response_excerpt` (max 240 chars)
- `risk_flags[]` (e.g., distress_detected)

Tier 2 data:
- Encrypted at rest
- Access-limited
- Short retention window

---

## Explicitly Prohibited Data

- Full raw user messages (Tier 1)
- Diagnoses or clinical labels
- Permanent emotional profiling
- Any content implying ownership or dependency

---

## Storage Schema (Postgres)

Table: `decision_audit_events`

- Append-only
- Indexed on `timestamp`, `conversation_id`, `user_hash`
- JSONB for flexible structured fields
- Daily or weekly partitions recommended

---

## Retention Policy

- Tier 1: 12–24 months (configurable)
- Tier 2: 7–30 days (max)
- Aggregates may be retained longer

---

## Security & Integrity

- Row-level security enforced
- Write-only service role
- No client-side writes
- Optional hash chaining for tamper detection

---

## Operational Metrics (Derived)

Track (aggregated only):
- % VERA-led vs Neural-led turns
- % challenge = direct
- Safety fallback frequency
- Band 2/3 prevalence
- Leak scan failure rate (target: 0)
- Post-challenge distress indicators

---

## IP Defensibility Statement

This telemetry demonstrates that VERA:
- Uses governed routing, not ad-hoc prompting
- Applies biological safety constraints
- Selects models by policy, not convenience
- Enforces a unified intelligence layer
- Preserves user dignity and agency

This audit trail is part of the system’s **intellectual property**.

---

## Change Control

Any change to:
- Logged fields
- Retention
- Access
- Policy versions

Requires:
- Architecture review
- Version bump
- Documentation update

End of document.
