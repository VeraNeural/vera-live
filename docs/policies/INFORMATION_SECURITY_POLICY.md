# VERA Information Security Policy

> **Document ID:** ISP-001  
> **Version:** 1.0  
> **Effective Date:** January 25, 2026  
> **Last Review:** January 25, 2026  
> **Classification:** Internal  

---

## 1. Purpose

This policy establishes the security requirements for protecting VERA systems, data, and users. It defines the administrative, technical, and physical controls necessary to maintain the confidentiality, integrity, and availability of information assets.

---

## 2. Scope

This policy applies to:
- All systems, applications, and infrastructure used in VERA operations
- All data processed, stored, or transmitted by VERA
- All personnel, contractors, and third parties with access to VERA systems
- All development, staging, and production environments

---

## 3. Roles and Responsibilities

| Role | Responsibilities |
|------|------------------|
| **Security Officer** | Overall security oversight, policy enforcement, incident response coordination, security awareness training, vendor security assessments |
| **Engineering Lead** | Secure development practices, code review, vulnerability remediation, system architecture security, CI/CD security |
| **All Team Members** | Policy compliance, incident reporting, security awareness participation, protecting credentials |
| **Third-Party Vendors** | Compliance with contractual security requirements, incident notification |

### 3.1 Security Officer Duties
- Maintain and update security policies annually
- Conduct quarterly access reviews
- Coordinate incident response activities
- Manage vulnerability remediation tracking
- Oversee security awareness training
- Review third-party security assessments

---

## 4. Access Control

### 4.1 User Access Management

**Principles:**
- Access granted based on **principle of least privilege**
- Access rights based on business need and job function
- Access requests require manager approval
- Access reviewed quarterly
- Access revoked within **24 hours** of termination

**Access Request Process:**
1. User submits access request via documented channel
2. Manager approves request with business justification
3. Security Officer validates appropriateness
4. Access provisioned with minimum required permissions
5. Access documented in access control log

### 4.2 Authentication Requirements

| System Type | Requirements |
|-------------|--------------|
| Production Systems | MFA required, 12+ character password |
| Admin Panels | MFA required, session timeout 30 minutes |
| Code Repositories | MFA required, SSH keys or token auth |
| Cloud Provider Consoles | MFA required, role-based access |
| Development Environments | Password authentication, local only |

**Password Requirements:**
- Minimum length: 12 characters
- Complexity: Mix of upper, lower, numbers, symbols
- Rotation: Every 90 days for service accounts
- No password reuse within 12 generations
- Account lockout after 5 failed attempts

**Session Management:**
- Session timeout: 30 minutes of inactivity
- Concurrent session limits enforced
- Session tokens are httpOnly, secure, sameSite

### 4.3 Service Account Management

- Service accounts have minimum required permissions
- Service account credentials stored in environment variables
- Credentials rotated every 90 days
- Service accounts documented and reviewed quarterly
- No interactive login for service accounts

### 4.4 Privileged Access

- Admin access limited to designated personnel
- Admin actions logged to audit system
- Admin access requires additional authentication
- Privileged access reviewed monthly

---

## 5. Data Protection

### 5.1 Data Classification

| Classification | Description | Examples | Required Controls |
|----------------|-------------|----------|-------------------|
| **Public** | No restrictions, intended for public | Marketing content, public docs | None |
| **Internal** | Business use only, not for public | Internal docs, policies | Access control |
| **Confidential** | Sensitive business data | Financial data, vendor contracts | Encryption, access logging, limited access |
| **Restricted** | Highly sensitive, regulated data | User conversations, PII, PHI | Encryption at rest and transit, strict access control, audit logging, data minimization |

### 5.2 Data Handling Requirements

| Classification | Storage | Transmission | Disposal | Sharing |
|----------------|---------|--------------|----------|---------|
| Public | Any | Any | Standard | Unrestricted |
| Internal | Approved systems | Internal only | Standard | Internal only |
| Confidential | Encrypted storage | Encrypted (TLS) | Secure deletion | Approved recipients |
| Restricted | Encrypted storage | Encrypted (TLS 1.3) | Cryptographic erasure | Prohibited without approval |

### 5.3 Encryption Standards

| Context | Standard | Implementation |
|---------|----------|----------------|
| Data at Rest (Database) | AES-256 | Supabase built-in encryption |
| Data at Rest (Fields) | AES-256-GCM | `encryptField.ts` utility |
| Data in Transit | TLS 1.3 | HSTS header with preload |
| Key Derivation | scrypt | 32-byte key derivation |
| Password Storage | bcrypt/scrypt | Clerk authentication |

**Key Management:**
- Encryption keys stored in environment variables
- Keys never committed to source control
- Key rotation: Annual or upon compromise
- Backup keys stored securely separate from data

### 5.4 Data Retention

| Data Type | Retention Period | Disposal Method |
|-----------|------------------|-----------------|
| User accounts | Account lifetime + 30 days | Cascade deletion via API |
| Conversations | User controlled (delete anytime) | Secure database deletion |
| Voice recordings | End of session | Automatic purge |
| Audit logs | 365 days (configurable) | Automated database cleanup |
| Backups | 30 days | Supabase managed deletion |
| Error logs | 90 days | Automated cleanup |

---

## 6. Network Security

### 6.1 Network Architecture

- **Production environment** isolated from development
- **Database** not directly accessible from internet (Supabase managed)
- **API endpoints** protected by rate limiting and authentication
- **Edge functions** deployed via Vercel (SOC 2 certified)
- **DDoS protection** via Vercel and Supabase infrastructure

### 6.2 Security Headers

All responses include:
- `Content-Security-Policy` with strict directives
- `Strict-Transport-Security` with preload
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` restricting sensitive APIs

### 6.3 External Connections

| Service | Purpose | Security Verification |
|---------|---------|----------------------|
| Supabase | Database, Auth | SOC 2 Type II, HIPAA-eligible |
| Vercel | Hosting, Edge | SOC 2 Type II, ISO 27001 |
| Clerk | Authentication | SOC 2 Type II |
| Stripe | Payments | PCI-DSS Level 1 |
| Anthropic | AI API | Security review required |

Annual review of all external connections required.

---

## 7. Vulnerability Management

### 7.1 Vulnerability Scanning

| Scan Type | Frequency | Tool | Owner |
|-----------|-----------|------|-------|
| Dependency scanning | Every deployment | npm audit | CI/CD automated |
| Code scanning | Every PR | GitHub Advanced Security | Engineering |
| Infrastructure scanning | Monthly | Provider tools | Security Officer |
| Penetration testing | Annual | Third-party | Security Officer |

### 7.2 Remediation SLAs

| Severity | CVSS Score | Remediation Timeframe |
|----------|------------|----------------------|
| Critical | 9.0-10.0 | 24 hours |
| High | 7.0-8.9 | 7 days |
| Medium | 4.0-6.9 | 30 days |
| Low | 0.1-3.9 | 90 days |

### 7.3 Vulnerability Response Process

1. Vulnerability identified via scanning or report
2. Severity assessed using CVSS scoring
3. Owner assigned for remediation
4. Fix developed and tested
5. Fix deployed per change management process
6. Verification scan confirms remediation
7. Documentation updated

---

## 8. Change Management

### 8.1 Standard Change Process

1. **Request**: Change requested via GitHub Issue/PR
2. **Review**: Code review required (minimum 1 reviewer)
3. **Testing**: Automated tests must pass (typecheck, unit tests, security scans)
4. **Approval**: PR approved by authorized reviewer
5. **Deployment**: Merge triggers automated deployment
6. **Verification**: Post-deployment verification within 1 hour
7. **Documentation**: Change recorded in Git history

### 8.2 Change Approval Requirements

| Change Type | Approval Required | Testing Required |
|-------------|-------------------|------------------|
| Code changes | 1 reviewer | Automated CI/CD |
| Infrastructure | Security Officer | Manual + automated |
| Security patches | Engineering Lead | Expedited testing |
| Emergency fixes | Engineering Lead | Post-hoc review |
| Prompt/Policy changes | `prompt-governance-review` label | Governance stress tests |

### 8.3 Emergency Changes

- Emergency changes permitted for critical security or availability issues
- Retrospective review within 48 hours
- Documentation completed within 5 business days
- Post-mortem if change caused issues

### 8.4 CI/CD Security Gates

- TypeScript strict mode compilation
- Unit test suite (140+ tests)
- Accessibility tests (vitest-axe)
- No-leak scan for sensitive terms
- Prompt change guard for AI policies
- npm audit for dependencies

---

## 9. Incident Response

Detailed incident response procedures are documented in [SECURITY.md](../SECURITY.md).

### 9.1 Summary

| Severity | Response Time | Examples |
|----------|---------------|----------|
| Critical | < 1 hour | Data breach, system compromise, crisis detection failure |
| High | < 4 hours | Significant vulnerability, partial data exposure |
| Medium | < 24 hours | Minor vulnerability, limited impact |
| Low | < 72 hours | Informational findings, best practice improvements |

### 9.2 Incident Categories

- Security breaches and unauthorized access
- Data exposure or loss
- Malware or ransomware
- Denial of service
- Insider threats
- Third-party security incidents

### 9.3 Reporting

- Internal: Immediately to Security Officer
- External: security@veraneural.com
- Response acknowledgment: Within 24 hours

---

## 10. Business Continuity

### 10.1 Backup Procedures

| Asset | Frequency | Retention | Location | Encryption |
|-------|-----------|-----------|----------|------------|
| Database | Daily | 30 days | Supabase managed | AES-256 |
| Audit logs | Continuous | 365 days | Database | AES-256 |
| Code repository | Continuous | Indefinite | GitHub | At rest |
| Configuration | On change | Indefinite | Git | At rest |

**Backup Verification:**
- Automated backup completion monitoring
- Quarterly restoration test
- Test results documented

### 10.2 Recovery Objectives

| Metric | Target | Notes |
|--------|--------|-------|
| RTO (Recovery Time Objective) | 4 hours | Time to restore service |
| RPO (Recovery Point Objective) | 24 hours | Maximum data loss window |

### 10.3 Critical Systems Priority

1. Crisis detection and safety features
2. Authentication and access control
3. Core chat functionality
4. Data persistence
5. Analytics and monitoring

---

## 11. Vendor Management

### 11.1 Approved Vendors

| Vendor | Service | SOC 2 | DPA | Last Review | Next Review |
|--------|---------|-------|-----|-------------|-------------|
| Supabase | Database, Storage | ✅ | ✅ | Jan 2026 | Jan 2027 |
| Vercel | Hosting, Edge | ✅ | ✅ | Jan 2026 | Jan 2027 |
| Clerk | Authentication | ✅ | ✅ | Jan 2026 | Jan 2027 |
| Stripe | Payments | PCI-DSS | ✅ | Jan 2026 | Jan 2027 |
| Anthropic | AI API | Review | ⏳ | Jan 2026 | Jul 2026 |

### 11.2 Vendor Security Requirements

- SOC 2 Type II report or equivalent certification
- Data Processing Agreement (DPA) signed
- Security questionnaire completed
- Encryption in transit and at rest
- Incident notification within 24 hours
- Annual security review

### 11.3 Vendor Onboarding

1. Security questionnaire submitted
2. SOC 2 report or equivalent reviewed
3. DPA negotiated and signed
4. Technical integration security reviewed
5. Access provisioned with least privilege
6. Vendor added to approved list

### 11.4 Vendor Offboarding

1. Access revoked immediately
2. Data return or destruction confirmed
3. Certificates and keys rotated
4. Documentation updated
5. Post-offboarding review completed

---

## 12. Security Awareness

### 12.1 Training Requirements

| Audience | Training Type | Frequency | Tracking |
|----------|---------------|-----------|----------|
| All team members | Security fundamentals | Annual | Completion record |
| New hires | Security onboarding | Within 30 days | Onboarding checklist |
| Engineering | Secure coding | Annual | Training record |
| Privileged users | Advanced security | Annual | Training record |

### 12.2 Training Topics

**All Personnel:**
- Phishing and social engineering awareness
- Password security and MFA usage
- Data handling and classification
- Incident reporting procedures
- Physical security basics

**Engineering:**
- OWASP Top 10 vulnerabilities
- Secure coding practices
- Input validation and output encoding
- Authentication and session management
- Secrets management

### 12.3 Awareness Activities

- Security tips in team communications
- Simulated phishing exercises (quarterly)
- Security incident debriefs
- Policy update notifications

---

## 13. Physical Security

### 13.1 Work Environment

- Remote-first with secure home office requirements
- Full-disk encryption required on all devices
- Screen lock after 5 minutes of inactivity
- Secure disposal of physical media

### 13.2 Cloud Infrastructure

Physical security managed by cloud providers (Vercel, Supabase, AWS) with:
- SOC 2 Type II certification
- 24/7 security monitoring
- Biometric access controls
- Environmental controls

---

## 14. Compliance

### 14.1 Regulatory Requirements

| Regulation | Applicability | Status |
|------------|---------------|--------|
| GDPR | EU users | Compliant |
| CCPA | California users | Compliant |
| HIPAA | Wellness context | Aligned (not covered entity) |
| SOC 2 | All operations | Preparing |

### 14.2 Compliance Activities

- Annual policy review
- Quarterly access reviews
- Monthly vulnerability scanning
- Continuous audit logging
- Annual penetration testing
- Regular compliance assessments

---

## 15. Policy Exceptions

### 15.1 Exception Process

1. Exception requested with business justification
2. Risk assessment performed
3. Compensating controls identified
4. Security Officer approval required
5. Time-limited approval (maximum 1 year)
6. Documented in exception register

### 15.2 Exception Register

Maintained by Security Officer with:
- Exception description
- Risk assessment
- Compensating controls
- Approval date and approver
- Expiration date
- Review status

---

## 16. Policy Review and Updates

### 16.1 Review Schedule

- **Annual review**: Required for all policies
- **Incident-triggered review**: After significant security incidents
- **Regulatory review**: When regulations change
- **Technology review**: When major technology changes occur

### 16.2 Version Control

All policies maintained in Git with:
- Version numbering
- Change history
- Approval records
- Distribution tracking

---

## 17. Revision History

| Version | Date | Changes | Approved By |
|---------|------|---------|-------------|
| 1.0 | 2026-01-25 | Initial version | Security Officer |

---

## 18. Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Security Officer | _________________ | _________________ | _________________ |
| Engineering Lead | _________________ | _________________ | _________________ |
| Executive Sponsor | _________________ | _________________ | _________________ |

---

## Appendix A: Related Documents

| Document | Location |
|----------|----------|
| Security Incident Response | [SECURITY.md](../SECURITY.md) |
| HIPAA Compliance | [HIPAA_COMPLIANCE.md](../HIPAA_COMPLIANCE.md) |
| Accessibility Standards | [ACCESSIBILITY.md](../ACCESSIBILITY.md) |
| Data Retention Policy | [DATA_RETENTION_POLICY.md](DATA_RETENTION_POLICY.md) |
| Change Management Policy | [CHANGE_MANAGEMENT_POLICY.md](CHANGE_MANAGEMENT_POLICY.md) |
| Vendor Management Policy | [VENDOR_MANAGEMENT_POLICY.md](VENDOR_MANAGEMENT_POLICY.md) |
| Business Continuity Plan | [BUSINESS_CONTINUITY_PLAN.md](BUSINESS_CONTINUITY_PLAN.md) |
| Acceptable Use Policy | [ACCEPTABLE_USE_POLICY.md](ACCEPTABLE_USE_POLICY.md) |

---

*This policy is effective as of the date indicated above and supersedes all previous versions.*
