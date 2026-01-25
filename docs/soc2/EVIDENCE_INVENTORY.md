# VERA SOC 2 Evidence Inventory

> **Document ID:** SOC2-EI-001  
> **Version:** 1.0  
> **Last Updated:** January 25, 2026  
> **Status:** Active  

---

## Overview

This document catalogs evidence demonstrating VERA's compliance with SOC 2 Trust Service Criteria. Each evidence item is mapped to specific control requirements and includes location, retention, and collection frequency.

---

## Evidence Categories

| Category | Description |
|----------|-------------|
| **POL** | Policy documents |
| **PROC** | Procedures and processes |
| **TECH** | Technical controls and configurations |
| **LOG** | Logs and audit trails |
| **DOC** | Documentation and records |
| **TEST** | Testing evidence |

---

## Security (CC Series)

### CC1: Control Environment

| ID | Evidence | Location | Type | Frequency |
|----|----------|----------|------|-----------|
| CC1.1 | Information Security Policy | `docs/policies/INFORMATION_SECURITY_POLICY.md` | POL | Annual review |
| CC1.2 | Acceptable Use Policy | `docs/policies/ACCEPTABLE_USE_POLICY.md` | POL | Annual review |
| CC1.3 | Security Officer designation | Organization chart | DOC | On change |
| CC1.4 | Security training records | Training platform | DOC | Annual |
| CC1.5 | Background check records | HR records | DOC | On hire |

### CC2: Communication and Information

| ID | Evidence | Location | Type | Frequency |
|----|----------|----------|------|-----------|
| CC2.1 | Privacy Policy | `/legal/privacy` (pending) | POL | Annual review |
| CC2.2 | Terms of Service | `/legal/terms` (pending) | POL | Annual review |
| CC2.3 | Security disclosure page | `SECURITY.md` | DOC | On change |
| CC2.4 | User documentation | `README.md`, Help center | DOC | On change |

### CC3: Risk Assessment

| ID | Evidence | Location | Type | Frequency |
|----|----------|----------|------|-----------|
| CC3.1 | Threat model | `docs/internal/threat-model.md` | DOC | Annual |
| CC3.2 | Vendor risk assessments | Vendor Management records | DOC | Per vendor tier |
| CC3.3 | Risk register | Security Officer records | DOC | Quarterly |
| CC3.4 | Penetration test results | Security testing records | TEST | Annual |

### CC4: Monitoring

| ID | Evidence | Location | Type | Frequency |
|----|----------|----------|------|-----------|
| CC4.1 | Audit logging implementation | `src/lib/audit.ts` | TECH | Continuous |
| CC4.2 | Audit log records | `audit_logs` table in Supabase | LOG | 365 days retained |
| CC4.3 | Security monitoring dashboards | Supabase analytics | TECH | Continuous |
| CC4.4 | Governance stress tests | `tests/invariants/*.test.ts` | TEST | Every PR |

### CC5: Control Activities

| ID | Evidence | Location | Type | Frequency |
|----|----------|----------|------|-----------|
| CC5.1 | Access control matrix | Role definitions in Supabase | TECH | On change |
| CC5.2 | RLS policies | `supabase/migrations/` | TECH | On change |
| CC5.3 | Authentication configuration | Clerk dashboard | TECH | On change |
| CC5.4 | MFA enforcement | Clerk configuration | TECH | Continuous |

### CC6: Logical and Physical Access

| ID | Evidence | Location | Type | Frequency |
|----|----------|----------|------|-----------|
| CC6.1 | User authentication logs | Clerk audit logs | LOG | 90 days |
| CC6.2 | API authentication | `src/middleware.ts` | TECH | On change |
| CC6.3 | Database access controls | Supabase RLS | TECH | On change |
| CC6.4 | Encryption at rest | Supabase configuration | TECH | Continuous |
| CC6.5 | Encryption in transit | TLS certificates | TECH | Continuous |
| CC6.6 | Secret management | Environment variables (Vercel) | TECH | On change |

### CC7: System Operations

| ID | Evidence | Location | Type | Frequency |
|----|----------|----------|------|-----------|
| CC7.1 | Change management policy | `docs/policies/CHANGE_MANAGEMENT_POLICY.md` | POL | Annual |
| CC7.2 | PR review records | GitHub PR history | LOG | Continuous |
| CC7.3 | Deployment logs | Vercel deployment history | LOG | Continuous |
| CC7.4 | CI/CD configuration | `.github/workflows/`, `vitest.config.ts` | TECH | On change |
| CC7.5 | Dependency scanning | `npm audit`, `no_leak_scan.mjs` | TECH | Every build |

### CC8: Change Management

| ID | Evidence | Location | Type | Frequency |
|----|----------|----------|------|-----------|
| CC8.1 | Git commit history | GitHub repository | LOG | Continuous |
| CC8.2 | PR approvals | GitHub PR reviews | LOG | Continuous |
| CC8.3 | CI test results | GitHub Actions | LOG | Every PR |
| CC8.4 | Prompt change controls | `scripts/prompt_change_guard.mjs` | TECH | Every PR |

### CC9: Risk Mitigation

| ID | Evidence | Location | Type | Frequency |
|----|----------|----------|------|-----------|
| CC9.1 | Vendor contracts/DPAs | Legal records | DOC | Per vendor |
| CC9.2 | Vendor management policy | `docs/policies/VENDOR_MANAGEMENT_POLICY.md` | POL | Annual |
| CC9.3 | Vendor SOC 2 reports | Vendor compliance files | DOC | Annual |

---

## Availability (A Series)

| ID | Evidence | Location | Type | Frequency |
|----|----------|----------|------|-----------|
| A1.1 | Business Continuity Plan | `docs/policies/BUSINESS_CONTINUITY_PLAN.md` | POL | Annual |
| A1.2 | Backup configuration | Supabase backup settings | TECH | Continuous |
| A1.3 | Backup verification tests | Restore test records | TEST | Quarterly |
| A1.4 | Uptime monitoring | Vercel/Supabase status | LOG | Continuous |
| A1.5 | Incident response records | Security Officer records | DOC | Per incident |
| A1.6 | DR test results | DR test documentation | TEST | Annual |

---

## Processing Integrity (PI Series)

| ID | Evidence | Location | Type | Frequency |
|----|----------|----------|------|-----------|
| PI1.1 | Input validation | `src/core/*.ts`, Zod schemas | TECH | On change |
| PI1.2 | Error handling | API routes error handling | TECH | On change |
| PI1.3 | Unit test suite | `tests/**/*.test.ts` | TEST | Every PR |
| PI1.4 | Governance tests | `tests/invariants/*.test.ts` | TEST | Every PR |
| PI1.5 | Test coverage reports | Vitest coverage | TEST | On demand |
| PI1.6 | Data integrity constraints | Database schema, RLS | TECH | On change |

---

## Confidentiality (C Series)

| ID | Evidence | Location | Type | Frequency |
|----|----------|----------|------|-----------|
| C1.1 | Data classification policy | Information Security Policy | POL | Annual |
| C1.2 | Encryption standards | `docs/ENCRYPTION_STANDARDS.md` | DOC | Annual |
| C1.3 | Access control evidence | RLS policies, role assignments | TECH | On change |
| C1.4 | Data retention policy | `docs/policies/DATA_RETENTION_POLICY.md` | POL | Annual |
| C1.5 | Secure deletion evidence | Audit logs, deletion functions | LOG | Per deletion |
| C1.6 | BAA with vendors | Legal records | DOC | Per vendor |

---

## Privacy (P Series)

| ID | Evidence | Location | Type | Frequency |
|----|----------|----------|------|-----------|
| P1.1 | Privacy policy | `/legal/privacy` (pending) | POL | Annual |
| P1.2 | Consent mechanisms | UI consent flows | TECH | On change |
| P1.3 | GDPR compliance documentation | `docs/GDPR_COMPLIANCE.md` | DOC | Annual |
| P1.4 | CCPA compliance documentation | `docs/CCPA_COMPLIANCE.md` | DOC | Annual |
| P1.5 | Data export implementation | `/api/export-my-data` | TECH | On change |
| P1.6 | Account deletion implementation | `/api/delete-my-account` | TECH | On change |
| P1.7 | Data subject request log | Audit logs | LOG | Per request |
| P1.8 | Subprocessor list | Vendor Management records | DOC | On change |

---

## Evidence Collection Schedule

| Frequency | Actions |
|-----------|---------|
| **Continuous** | Automated logging, CI/CD evidence |
| **Weekly** | Review security alerts |
| **Monthly** | Collect vendor status, review access |
| **Quarterly** | Backup tests, access reviews, risk register update |
| **Semi-annually** | DR test, vendor reassessment (High tier) |
| **Annually** | Full policy review, penetration test, vendor SOC 2 collection |

---

## Evidence Gaps (Action Items)

| Gap | Priority | Remediation | Target Date |
|-----|----------|-------------|-------------|
| `/legal/privacy` page | High | Create privacy policy page | Q1 2026 |
| `/legal/terms` page | High | Create terms of service page | Q1 2026 |
| Formal uptime SLA | Medium | Document SLA commitment | Q1 2026 |
| Disaster Recovery test | Medium | Conduct and document DR test | Q2 2026 |
| Penetration test | Medium | Engage third-party tester | Q2 2026 |
| Capacity planning doc | Low | Document capacity approach | Q2 2026 |

---

## Evidence Storage

| Evidence Type | Storage Location | Access Control |
|---------------|------------------|----------------|
| Policies | Git repository (`docs/policies/`) | Code review required |
| Technical | Git repository (code) | Code review required |
| Logs | Supabase, Vercel, Clerk | Admin only |
| Vendor records | Secure document storage | Security Officer |
| HR records | HR system | HR + Security Officer |
| Test results | CI/CD systems | Team access |

---

## Revision History

| Version | Date | Changes | Approved By |
|---------|------|---------|-------------|
| 1.0 | 2026-01-25 | Initial version | Security Officer |
