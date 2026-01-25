# VERA HIPAA Compliance Documentation

> **Classification**: Internal  
> **Last Updated**: 2026-01-25  
> **Version**: 1.0  

---

## 1. Applicability Statement

VERA is a wellness and mental health support tool that provides:
- Nervous system regulation guidance
- Trauma-informed conversational support
- Educational mental health content
- Sanctuary emotional continuity experiences

**VERA is NOT:**
- A medical provider or covered entity
- A substitute for professional mental health treatment
- A diagnostic tool
- A crisis intervention service

While VERA may not be legally required to comply with HIPAA as it is not a covered entity under 45 CFR § 160.103, we implement HIPAA-aligned security practices to protect sensitive user information. This voluntary compliance reflects our commitment to user privacy and data protection.

**Legal Disclaimer**: This document does not constitute legal advice. Consult qualified legal counsel for definitive HIPAA applicability determination.

---

## 2. Administrative Safeguards

### 2.1 Security Officer

| Role | Responsibility |
|------|----------------|
| **Designated Security Officer** | CEO / Founder |
| **Contact** | security@veraneural.com |
| **Responsibilities** | Policy enforcement, incident response coordination, security training oversight, vendor security review |

### 2.2 Workforce Training

| Training Component | Details |
|--------------------|---------|
| **Initial Training** | Required during onboarding before data access granted |
| **Topics Covered** | Data handling procedures, incident reporting, access controls, PHI identification, secure development practices |
| **Refresher Frequency** | Annual, or after significant policy changes |
| **Documentation** | Training completion records maintained |

### 2.3 Access Management

| Control | Implementation |
|---------|----------------|
| **Principle of Least Privilege** | Users granted minimum access necessary for role |
| **Access Reviews** | Quarterly review of admin access |
| **New Access Provisioning** | Requires documented approval |
| **Termination Revocation** | Within 24 hours of employment end |
| **Shared Credentials** | Prohibited; each user has unique credentials |

### 2.4 Incident Response

- **Full Plan**: See [SECURITY.md](../SECURITY.md) Section 4-7
- **Breach Notification**: Within 72 hours of discovery for significant breaches
- **Incident Logging**: All incidents logged in audit system
- **Post-Incident Review**: Conducted within 7 days of resolution

---

## 3. Physical Safeguards

### 3.1 Infrastructure

| Component | Provider | Certifications |
|-----------|----------|----------------|
| **Application Hosting** | Vercel | SOC 2 Type II, ISO 27001 |
| **Database** | Supabase (AWS) | SOC 2 Type II, ISO 27001, HIPAA eligible |
| **Authentication** | Clerk | SOC 2 Type II |
| **Payments** | Stripe | PCI DSS Level 1, SOC 2 |

Physical access controls for all infrastructure are managed by hosting providers with documented security certifications.

### 3.2 Workstation Security

| Control | Requirement |
|---------|-------------|
| **Device Encryption** | Full disk encryption required (BitLocker/FileVault) |
| **Screen Lock** | Automatic lock after 5 minutes inactivity |
| **Password Policy** | Minimum 12 characters, complexity required |
| **Remote Wipe** | Enabled for all devices with production access |
| **Antivirus/EDR** | Required on all workstations |

---

## 4. Technical Safeguards

### 4.1 Access Control

| Control | Implementation |
|---------|----------------|
| **Unique User Identification** | UUID per user via Clerk authentication |
| **Automatic Logoff** | Session timeout after 30 minutes inactivity |
| **Encryption at Rest** | AES-256 (Supabase) + field-level AES-256-GCM |
| **Encryption in Transit** | TLS 1.3 with HSTS (max-age=31536000; includeSubDomains; preload) |
| **Role-Based Access** | Admin, authenticated user, service role, anonymous |
| **Multi-Factor Authentication** | Required for admin access |

### 4.2 Audit Controls

| Component | Details |
|-----------|---------|
| **Audit System** | `src/lib/audit/auditLogger.ts` |
| **Events Logged** | Authentication, data access, exports, deletions, consent changes, subscription events |
| **Log Retention** | 365 days (configurable) |
| **Log Access** | Restricted to admin role via `/admin/audit-logs` |
| **IP Handling** | Hashed for privacy (not stored in plain text) |
| **Cleanup** | Automated retention policy via `auditRetention.ts` |

**Logged Event Types**:
- `auth.login`, `auth.logout`, `auth.signup`, `auth.failed`
- `data.export`, `data.delete`, `data.access`
- `consent.granted`, `consent.revoked`
- `subscription.created`, `subscription.cancelled`
- `security.password_reset`, `security.mfa_enabled`

### 4.3 Integrity Controls

| Control | Implementation |
|---------|----------------|
| **Database Backups** | Daily automated (Supabase) |
| **Backup Encryption** | AES-256 |
| **Backup Retention** | 30 days |
| **Backup Testing** | Quarterly restoration tests |
| **Version Control** | All code changes tracked in Git |
| **Change Management** | Pull request review required |

### 4.4 Transmission Security

| Channel | Security |
|---------|----------|
| **HTTPS** | Required for all endpoints; HTTP redirected |
| **WebSockets** | WSS only (secure WebSocket) |
| **API Keys** | Transmitted via secure headers, never in URLs |
| **Third-Party APIs** | All use HTTPS/TLS |
| **HSTS** | Enabled with preload directive |

---

## 5. Data Handling

### 5.1 Data Classification

| Data Type | Classification | Encryption | Retention | User Control |
|-----------|---------------|------------|-----------|--------------|
| User email | Sensitive | At rest (Clerk) | Account lifetime | Deletable |
| Conversations | Highly Sensitive | At rest + field level | User controlled | Full CRUD |
| Memories | Highly Sensitive | At rest + field level | User controlled | Full CRUD |
| Voice recordings | Highly Sensitive | At rest | Session only | Auto-deleted |
| Payment info | Sensitive | Stripe PCI vault | Per Stripe policy | Via Stripe |
| Audit logs | Internal | At rest | 365 days | N/A |
| Analytics | Anonymized | At rest | 90 days | N/A |

### 5.2 Data Minimization

Implemented via `src/lib/security/dataMinimization.ts`:

| Practice | Implementation |
|----------|----------------|
| **Minimum Necessary** | Collect only data required for service |
| **Field Stripping** | Internal fields removed from API responses |
| **Forbidden Fields** | `iba_policy`, `arousal_state`, `sim_decision`, `model_provenance` never exposed |
| **Analytics Sanitization** | No PHI sent to GA4/Meta/TikTok |
| **Log Sanitization** | Message content never logged |
| **Export Sanitization** | Only user-facing data in exports |

### 5.3 Data Disposal

| Scenario | Timeline | Method |
|----------|----------|--------|
| User deletion request | Within 30 days | Cascade delete + backup purge |
| Conversation deletion | Immediate | Hard delete from database |
| Memory deletion | Immediate | Hard delete from database |
| Voice recordings | End of session | Automatic purge |
| Audit log expiry | After retention period | Automated cleanup function |

---

## 6. Business Associate Agreements

| Vendor | Service | Processes PHI? | BAA Status | Notes |
|--------|---------|----------------|------------|-------|
| Supabase | Database | Yes | Available | HIPAA-eligible tier available |
| Vercel | Hosting | No (pass-through) | N/A | Stateless edge functions |
| Clerk | Authentication | Limited (email) | Available | Contact for BAA |
| Stripe | Payments | No PHI | N/A | PCI DSS compliant |
| Anthropic | AI API | Yes (prompts) | Review Required | API terms apply |

**Note**: As VERA is not currently a covered entity, BAAs are not legally required. However, we recommend obtaining BAAs from vendors processing sensitive data as a best practice.

### Vendor Security Review Checklist

- [ ] SOC 2 Type II report reviewed
- [ ] Data processing agreement signed
- [ ] Encryption standards verified
- [ ] Incident response procedures documented
- [ ] Subprocessor list reviewed

---

## 7. Risk Assessment

**Last Assessment Date**: 2026-01-25  
**Next Scheduled Assessment**: 2026-07-25 (6 months)  
**Assessment Methodology**: NIST Cybersecurity Framework

### Identified Risks and Mitigations

| # | Risk | Likelihood | Impact | Mitigation | Status |
|---|------|------------|--------|------------|--------|
| 1 | Unauthorized data access | Medium | High | RLS policies, audit logging, session management | ✅ Implemented |
| 2 | Data breach via API | Medium | High | Input validation, rate limiting, authentication | ✅ Implemented |
| 3 | PHI in logs | Medium | Medium | Log sanitization, forbidden field stripping | ✅ Implemented |
| 4 | Third-party data leak | Low | High | Vendor security review, data minimization | ✅ Implemented |
| 5 | Insider threat | Low | High | Least privilege, audit logging, access reviews | ✅ Implemented |
| 6 | Backup data exposure | Low | High | Backup encryption, access controls | ✅ Implemented |
| 7 | Session hijacking | Low | Medium | Secure cookies, HTTPS only, session rotation | ✅ Implemented |

### Residual Risk Acceptance

Residual risks are reviewed and accepted by the Security Officer. Current residual risk level: **Low**.

---

## 8. Compliance Verification

### Technical Controls Verification

| Control | Verification Method | Last Verified |
|---------|---------------------|---------------|
| Encryption at rest | Database configuration review | 2026-01-25 |
| Encryption in transit | HSTS header check, SSL Labs scan | 2026-01-25 |
| Audit logging | Log review, test event generation | 2026-01-25 |
| Access controls | RLS policy review, permission testing | 2026-01-25 |
| Data minimization | Code review of sanitization functions | 2026-01-25 |

### Automated Compliance Checks

- **CI/CD**: `npm run typecheck && npm test` (124 tests)
- **Security Headers**: Verified in `next.config.ts`
- **Dependency Scanning**: npm audit on each build

---

## 9. Policy Review

This document is reviewed and updated:
- **Annually** at minimum
- **After any security incident**
- **After significant system changes**
- **When new vendors are onboarded**

### Revision History

| Date | Version | Changes | Reviewer |
|------|---------|---------|----------|
| 2026-01-25 | 1.0 | Initial version | Security Officer |

---

## 10. Related Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| Security Policy | [SECURITY.md](../SECURITY.md) | Incident response, vulnerability disclosure |
| Inter-Layer Contract | [inter_layer_contract.md](inter_layer_contract.md) | Data flow contracts |
| Telemetry Spec | [telemetry_spec.md](telemetry_spec.md) | Analytics data handling |
| Threat Model | [internal/threat-model.md](internal/threat-model.md) | Security threat analysis |

---

## Appendix A: HIPAA Security Rule Crosswalk

| HIPAA Requirement | Section | Status |
|-------------------|---------|--------|
| § 164.308(a)(1) - Security Management | 2.4, 7 | ✅ |
| § 164.308(a)(2) - Assigned Security Responsibility | 2.1 | ✅ |
| § 164.308(a)(3) - Workforce Security | 2.2, 2.3 | ✅ |
| § 164.308(a)(4) - Information Access Management | 4.1 | ✅ |
| § 164.308(a)(5) - Security Awareness Training | 2.2 | ✅ |
| § 164.308(a)(6) - Security Incident Procedures | 2.4 | ✅ |
| § 164.308(a)(7) - Contingency Plan | 4.3 | ✅ |
| § 164.308(a)(8) - Evaluation | 7, 8 | ✅ |
| § 164.310(a) - Facility Access Controls | 3.1 | ✅ |
| § 164.310(b) - Workstation Use | 3.2 | ✅ |
| § 164.310(c) - Workstation Security | 3.2 | ✅ |
| § 164.310(d) - Device and Media Controls | 5.3 | ✅ |
| § 164.312(a) - Access Control | 4.1 | ✅ |
| § 164.312(b) - Audit Controls | 4.2 | ✅ |
| § 164.312(c) - Integrity | 4.3 | ✅ |
| § 164.312(d) - Authentication | 4.1 | ✅ |
| § 164.312(e) - Transmission Security | 4.4 | ✅ |

---

*This document is maintained by the VERA Security Team. For questions, contact security@veraneural.com.*
