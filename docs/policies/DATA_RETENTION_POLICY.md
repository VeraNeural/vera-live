# VERA Data Retention Policy

> **Document ID:** DRP-001  
> **Version:** 1.0  
> **Effective Date:** January 25, 2026  
> **Classification:** Internal  

---

## 1. Purpose

This policy establishes requirements for retaining, archiving, and disposing of data throughout its lifecycle. It ensures compliance with legal, regulatory, and business requirements while minimizing data risk.

---

## 2. Scope

This policy applies to all data:
- Created, received, or maintained by VERA
- Stored in any format (digital or physical)
- Located on any system or device
- Processed by any team member or vendor

---

## 3. Data Retention Requirements

### 3.1 Retention Schedule

| Data Category | Retention Period | Legal Basis | Disposal Method |
|---------------|------------------|-------------|-----------------|
| **User Accounts** | Account lifetime + 30 days | Contract, GDPR Art. 17 | Cascade deletion |
| **User Conversations** | User-controlled (indefinite) | Consent, GDPR Art. 6 | Secure database deletion |
| **User Memories** | User-controlled (indefinite) | Consent | Secure database deletion |
| **Voice Recordings** | End of session | Legitimate interest | Automatic purge |
| **Audit Logs** | 365 days | Security, compliance | Automated database cleanup |
| **Error Logs** | 90 days | Operational | Automated cleanup |
| **Security Logs** | 365 days | Security | Automated cleanup |
| **Authentication Logs** | 90 days | Security | Provider managed |
| **Payment Records** | 7 years | Tax regulations | Secure archive + deletion |
| **Contracts/Agreements** | Contract term + 7 years | Legal | Secure archive + deletion |
| **Employee Records** | Employment + 7 years | Employment law | Secure deletion |
| **Marketing Consent** | Consent + 3 years after withdrawal | GDPR | Database deletion |
| **Backup Data** | 30 days | Business continuity | Automatic rotation |
| **Telemetry Data** | 90 days | Operational | Automated cleanup |

### 3.2 Retention Principles

1. **Minimum Retention**: Retain data only as long as necessary
2. **Legal Compliance**: Extend retention when required by law
3. **Business Need**: Justify extended retention with documented need
4. **User Rights**: Honor deletion requests within policy timeframes
5. **Consistency**: Apply retention rules uniformly

---

## 4. User Data Rights

### 4.1 Right to Deletion (GDPR Art. 17)

Users may request deletion of their data. Upon verified request:

| Data Type | Deletion Timeline |
|-----------|-------------------|
| Account and profile | Within 30 days |
| Conversations | Immediate |
| Memories | Immediate |
| Preferences | Immediate |
| Backup copies | Within 30 days of rotation |

### 4.2 Right to Export (GDPR Art. 20)

Users may export their data via the Data Export feature:
- Format: JSON (machine-readable)
- Contents: Profile, conversations, memories, preferences
- Rate limit: 1 export per hour
- Processing: Immediate (real-time)

### 4.3 Deletion Implementation

The account deletion process follows this sequence:
1. Cancel active subscriptions (Stripe)
2. Delete messages (cascade)
3. Delete conversations
4. Delete memories
5. Delete preferences
6. Delete entitlements
7. Delete user from Clerk
8. Log audit event
9. Backup purge within 30 days

---

## 5. Legal Holds

### 5.1 When Legal Holds Apply

Legal holds suspend normal retention when:
- Litigation is reasonably anticipated
- Legal proceedings are ongoing
- Regulatory investigation is active
- Government request received

### 5.2 Legal Hold Process

1. **Initiation**: Legal counsel initiates hold
2. **Scope Definition**: Identify data subject to hold
3. **Notification**: Notify custodians and IT
4. **Preservation**: Suspend deletion for in-scope data
5. **Documentation**: Record hold details and scope
6. **Monitoring**: Ensure compliance with hold
7. **Release**: Legal counsel releases hold
8. **Resumption**: Normal retention resumes

### 5.3 Legal Hold Responsibilities

| Role | Responsibility |
|------|----------------|
| Legal Counsel | Initiate, define scope, release holds |
| Security Officer | Implement technical preservation |
| Engineering | Modify retention processes as needed |
| All Personnel | Comply with hold notifications |

---

## 6. Data Disposal

### 6.1 Disposal Methods

| Data Type | Method | Standard |
|-----------|--------|----------|
| Database records | SQL DELETE with cascade | Supabase managed |
| Encrypted data | Key destruction | Cryptographic erasure |
| Backup data | Provider managed rotation | Supabase 30-day rotation |
| Log data | Automated cleanup function | `cleanup_old_audit_logs()` |
| Physical media | Secure destruction | N/A (cloud-only) |

### 6.2 Disposal Verification

For sensitive data disposal:
1. Verify deletion completed
2. Confirm backup removal timeline
3. Log disposal in audit system
4. Retain disposal record (metadata only)

### 6.3 Third-Party Data Disposal

When data shared with vendors must be disposed:
1. Request deletion from vendor
2. Obtain confirmation of deletion
3. Document vendor response
4. Verify per contract terms

---

## 7. Automated Retention Enforcement

### 7.1 Audit Log Cleanup

```sql
-- Automated cleanup function
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM audit_logs 
  WHERE created_at < NOW() - INTERVAL '365 days';
END;
$$ LANGUAGE plpgsql;
```

### 7.2 Configuration

| Setting | Default | Environment Variable |
|---------|---------|---------------------|
| Audit log retention | 365 days | `AUDIT_LOG_RETENTION_DAYS` |
| Error log retention | 90 days | Application config |
| Session data | End of session | Automatic |

### 7.3 Monitoring

- Daily: Verify cleanup jobs running
- Weekly: Check data volumes
- Monthly: Review retention compliance
- Quarterly: Audit retention adherence

---

## 8. Exceptions

### 8.1 Extended Retention

Data may be retained beyond standard periods for:
- Active legal holds
- Regulatory requirements
- Ongoing investigations
- Documented business necessity

All exceptions must be:
- Approved by Security Officer
- Time-limited (annual review)
- Documented with justification
- Reviewed for continued necessity

### 8.2 Early Deletion

Data may be deleted before retention period ends:
- User deletion request (GDPR Art. 17)
- Security incident containment
- Court order or legal requirement
- Data no longer needed and no legal hold

---

## 9. Roles and Responsibilities

| Role | Responsibility |
|------|----------------|
| Security Officer | Policy enforcement, exception approval, legal hold coordination |
| Engineering Lead | Technical implementation, automated enforcement |
| Legal Counsel | Legal hold management, regulatory guidance |
| All Personnel | Compliance with retention requirements |

---

## 10. Compliance and Audit

### 10.1 Compliance Verification

- Quarterly review of retention compliance
- Annual audit of disposal procedures
- Annual review of retention schedule
- Documentation of all activities

### 10.2 Records

Maintain records of:
- Retention schedule updates
- Disposal activities
- Legal holds (active and released)
- Exceptions granted
- Compliance audit results

---

## 11. Related Documents

| Document | Purpose |
|----------|---------|
| Information Security Policy | Overall security requirements |
| Privacy Policy | User-facing privacy terms |
| HIPAA Compliance | Healthcare data requirements |
| GDPR Compliance | EU data protection requirements |

---

## 12. Revision History

| Version | Date | Changes | Approved By |
|---------|------|---------|-------------|
| 1.0 | 2026-01-25 | Initial version | Security Officer |

---

*This policy is effective as of the date indicated above and supersedes all previous versions.*
