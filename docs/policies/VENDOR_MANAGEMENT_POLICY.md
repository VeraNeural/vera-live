# VERA Vendor Management Policy

> **Document ID:** VMP-001  
> **Version:** 1.0  
> **Effective Date:** January 25, 2026  
> **Classification:** Internal  

---

## 1. Purpose

This policy establishes requirements for selecting, onboarding, monitoring, and offboarding third-party vendors who have access to VERA systems or data. It ensures vendors meet security and compliance requirements throughout their engagement.

---

## 2. Scope

This policy applies to all third-party vendors who:
- Process, store, or transmit VERA data
- Have access to VERA systems or infrastructure
- Provide services critical to VERA operations
- Process user data on VERA's behalf (data processors)

---

## 3. Vendor Categories

### 3.1 Vendor Risk Tiers

| Tier | Criteria | Examples | Review Frequency |
|------|----------|----------|------------------|
| **Critical** | Processes restricted data, essential to operations | Supabase, Anthropic | Quarterly |
| **High** | Processes confidential data, important services | Clerk, Stripe, Vercel | Semi-annually |
| **Medium** | Limited data access, supporting services | Analytics, monitoring | Annually |
| **Low** | No data access, non-essential services | Marketing tools | Bi-annually |

### 3.2 Current Vendor Inventory

| Vendor | Service | Tier | Data Access | Certifications |
|--------|---------|------|-------------|----------------|
| Supabase | Database, Storage | Critical | User data, conversations | SOC 2, HIPAA-eligible |
| Anthropic | AI API | Critical | Conversation content | Under review |
| Vercel | Hosting, Edge | High | Application traffic | SOC 2, ISO 27001 |
| Clerk | Authentication | High | User identities | SOC 2 |
| Stripe | Payments | High | Payment info | PCI-DSS Level 1 |
| GitHub | Code repository | Medium | Source code | SOC 2 |

---

## 4. Vendor Selection

### 4.1 Selection Criteria

Before engaging a new vendor, evaluate:

| Category | Requirements |
|----------|--------------|
| **Security** | Security certifications (SOC 2, ISO 27001), encryption, access controls |
| **Privacy** | GDPR compliance, DPA available, privacy practices |
| **Reliability** | Uptime guarantees, SLAs, support availability |
| **Compliance** | Industry-specific compliance (HIPAA, PCI if applicable) |
| **Financial** | Financial stability, business continuity |
| **Technical** | Integration capabilities, documentation, API quality |

### 4.2 Security Assessment

For Critical and High tier vendors:

- [ ] Security questionnaire completed
- [ ] SOC 2 Type II report reviewed (or equivalent)
- [ ] Encryption practices verified (at rest and in transit)
- [ ] Access control mechanisms reviewed
- [ ] Incident response procedures documented
- [ ] Subprocessor list reviewed
- [ ] Data location confirmed

### 4.3 Required Documentation

| Document | Critical | High | Medium | Low |
|----------|----------|------|--------|-----|
| Security questionnaire | ✅ | ✅ | ✅ | ❌ |
| SOC 2 report or equivalent | ✅ | ✅ | ⭕ | ❌ |
| Data Processing Agreement | ✅ | ✅ | ✅ | ⭕ |
| Business Associate Agreement (if PHI) | ✅ | ⭕ | ⭕ | ❌ |
| Terms of Service review | ✅ | ✅ | ✅ | ✅ |

✅ Required | ⭕ If applicable | ❌ Not required

---

## 5. Vendor Onboarding

### 5.1 Onboarding Process

1. **Selection**: Vendor meets selection criteria
2. **Assessment**: Security assessment completed
3. **Contracts**: DPA and contracts signed
4. **Access**: Minimum necessary access provisioned
5. **Documentation**: Vendor added to inventory
6. **Training**: Team trained on vendor integration
7. **Monitoring**: Monitoring and alerting configured

### 5.2 Contract Requirements

Vendor contracts must include:

| Requirement | Description |
|-------------|-------------|
| Data protection | Encryption, access controls, security measures |
| Incident notification | Notify within 24 hours of security incidents |
| Audit rights | Right to audit or receive audit reports |
| Data deletion | Deletion upon termination |
| Subprocessors | Notification of subprocessor changes |
| Liability | Appropriate liability and indemnification |
| Termination | Clear termination and transition provisions |

### 5.3 Access Provisioning

- Grant minimum necessary permissions
- Use service accounts where possible
- Document all access granted
- Enable audit logging for vendor access
- Review access quarterly

---

## 6. Ongoing Monitoring

### 6.1 Continuous Monitoring

| Activity | Frequency | Owner |
|----------|-----------|-------|
| Security news monitoring | Daily | Security Officer |
| Vendor status page review | Weekly | Engineering |
| Service usage review | Monthly | Engineering |
| Incident review | As needed | Security Officer |

### 6.2 Periodic Reviews

| Review Type | Critical | High | Medium | Low |
|-------------|----------|------|--------|-----|
| Security assessment | Quarterly | Semi-annually | Annually | Bi-annually |
| SOC 2 report review | Annually | Annually | Annually | N/A |
| Access review | Quarterly | Semi-annually | Annually | Annually |
| Contract review | Annually | Annually | Annually | Annually |

### 6.3 Review Checklist

For each periodic review:

- [ ] Current SOC 2 or equivalent obtained
- [ ] Recent security incidents reviewed
- [ ] Subprocessor changes evaluated
- [ ] Access permissions verified
- [ ] Contract compliance confirmed
- [ ] Business need still exists
- [ ] Alternatives evaluated (if issues found)

---

## 7. Incident Management

### 7.1 Vendor Security Incidents

When a vendor reports a security incident:

1. **Assess**: Determine if VERA data affected
2. **Contain**: Take protective actions if needed
3. **Document**: Record incident details
4. **Notify**: Alert affected parties if required
5. **Review**: Evaluate vendor's response
6. **Follow-up**: Ensure remediation completed

### 7.2 Incident Notification Requirements

Vendors must notify VERA:
- Within 24 hours of security incidents
- Immediately for breaches involving VERA data
- With full details of scope and impact
- With remediation plan and timeline

### 7.3 Escalation

| Severity | Vendor SLA | VERA Response |
|----------|-----------|---------------|
| Critical | 1 hour | Immediate escalation to Security Officer |
| High | 4 hours | Same business day response |
| Medium | 24 hours | Next business day response |
| Low | 72 hours | Standard response |

---

## 8. Vendor Offboarding

### 8.1 Offboarding Triggers

Offboard vendors when:
- Contract expires or terminates
- Business need no longer exists
- Security requirements not met
- Better alternative identified
- Vendor acquired or changes significantly

### 8.2 Offboarding Process

1. **Notice**: Provide contractual notice to vendor
2. **Data**: Obtain return or destruction of data
3. **Access**: Revoke all access immediately
4. **Secrets**: Rotate any shared credentials
5. **Integration**: Remove integrations and dependencies
6. **Documentation**: Update vendor inventory
7. **Verification**: Confirm offboarding complete

### 8.3 Data Handling

Before vendor offboarding:
- Export any needed data
- Obtain data deletion confirmation
- Verify backup procedures for data
- Document data disposition

---

## 9. Roles and Responsibilities

| Role | Responsibilities |
|------|------------------|
| **Security Officer** | Policy enforcement, vendor assessments, incident coordination |
| **Engineering Lead** | Technical integration review, access management |
| **Legal/Compliance** | Contract review, DPA negotiation |
| **Finance** | Vendor billing and payment |
| **All Personnel** | Report vendor issues, follow usage policies |

---

## 10. Documentation and Records

### 10.1 Required Records

Maintain for each vendor:
- Vendor risk assessment
- Security questionnaire responses
- SOC 2 reports or equivalent
- Signed contracts and DPAs
- Access provisioning records
- Periodic review documentation
- Incident records
- Offboarding confirmation

### 10.2 Record Retention

| Record Type | Retention Period |
|-------------|------------------|
| Active vendor records | Duration of relationship |
| Security assessments | 3 years |
| Contracts | Term + 7 years |
| Incident records | 7 years |
| Offboarding records | 3 years after offboarding |

---

## 11. Compliance

### 11.1 Regulatory Requirements

Vendors must support compliance with:
- GDPR (Data Processing Agreements)
- CCPA (Service provider contracts)
- HIPAA (Business Associate Agreements if PHI)
- SOC 2 (Security controls)

### 11.2 Audit Rights

VERA reserves the right to:
- Request current security certifications
- Review audit reports
- Conduct security assessments
- Terminate for material breaches

---

## 12. Related Documents

| Document | Purpose |
|----------|---------|
| Information Security Policy | Security requirements |
| Data Retention Policy | Data lifecycle management |
| HIPAA Compliance | Healthcare data requirements |
| Vendor Security Questionnaire | Assessment template |

---

## 13. Revision History

| Version | Date | Changes | Approved By |
|---------|------|---------|-------------|
| 1.0 | 2026-01-25 | Initial version | Security Officer |

---

## Appendix A: Vendor Security Questionnaire

### Company Information
- Legal entity name
- Contact information
- Business description
- Years in business

### Security Certifications
- SOC 2 Type II? (Date of last report)
- ISO 27001 certified?
- Other certifications?

### Data Security
- How is data encrypted at rest?
- How is data encrypted in transit?
- Where is data stored (geography)?
- Who has access to customer data?

### Access Control
- How is access authenticated?
- Is MFA required?
- How are permissions managed?
- How is access logged?

### Incident Response
- Do you have an incident response plan?
- What is your breach notification timeline?
- Have you had breaches in the past 3 years?

### Business Continuity
- What are your backup procedures?
- What is your disaster recovery plan?
- What are your uptime SLAs?

### Subprocessors
- Do you use subprocessors?
- Please list subprocessors with data access
- How do you assess subprocessor security?

---

*This policy is effective as of the date indicated above and supersedes all previous versions.*
