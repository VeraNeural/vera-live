# VERA Security Policy & Incident Response Plan

> **Classification**: Internal  
> **Last Updated**: 2026-01-25  
> **Version**: 1.1  

VERA is an AI-powered mental wellness application. Due to the sensitive nature of user conversations, memories, and personal data, security incidents require heightened response protocols.

---

## 1. Security Contact

| Method | Details |
|--------|---------|
| **Primary Email** | security@veraneural.com |
| **Response Time** | Initial acknowledgment within 24 hours |
| **Encrypted Reports** | PGP key available upon request |

**⚠️ Do NOT report security vulnerabilities via public GitHub issues.**

---

## 2. Supported Versions

| Version | Supported | Notes |
|---------|-----------|-------|
| 1.x.x (current) | ✅ | Active development and security patches |
| 0.x.x (beta) | ❌ | No longer supported |

---

## 3. Reporting a Vulnerability

### How to Report

Email **security@veraneural.com** with the following information:

1. **Description**: Clear explanation of the vulnerability
2. **Reproduction Steps**: Detailed steps to reproduce the issue
3. **Potential Impact**: What could an attacker achieve?
4. **Affected Components**: Which systems/endpoints are affected?
5. **Suggested Fix**: Optional, but appreciated
6. **Your Contact Info**: For follow-up questions

### What to Expect

| Timeline | Action |
|----------|--------|
| < 24 hours | Acknowledgment of receipt |
| < 72 hours | Initial assessment and severity classification |
| < 7 days | Status update with remediation timeline |
| Upon fix | Credit in security advisory (if desired) |

### Safe Harbor

We will not pursue legal action against security researchers who:
- Act in good faith
- Avoid accessing/modifying user data
- Report findings promptly
- Allow reasonable time for remediation before disclosure

---

## 4. Incident Severity Classification

| Severity | Definition | Response Time | Examples |
|----------|------------|---------------|----------|
| **🔴 Critical** | Active exploitation, data breach, complete system compromise | **Immediate (< 1 hour)** | Database breach, auth bypass, PII exposure, conversation data leak |
| **🟠 High** | Significant vulnerability, no active exploitation known | **< 4 hours** | XSS, CSRF, privilege escalation, memory consent bypass |
| **🟡 Medium** | Limited impact vulnerability | **< 24 hours** | Information disclosure, rate limiting bypass, minor auth issues |
| **🟢 Low** | Minimal impact | **< 72 hours** | Minor information leak, best practice violation, cosmetic security issues |

### Mental Health App-Specific Severity Factors

The following automatically escalate severity by one level:

- **User safety data**: Any access to crisis indicators, distress signals, or safety assessments
- **Conversation content**: Unauthorized access to chat history or AI responses
- **Memory data**: Exposure of user memories, personal insights, or emotional state data
- **Subscription/payment data**: Stripe customer IDs, payment methods

---

## 5. Incident Response Procedures

### 5.1 Detection & Identification

**Detection Sources:**
- Automated monitoring alerts (Supabase, Vercel, Clerk)
- Error tracking (console logs, error boundaries)
- User reports via support channels
- Security researcher reports
- Dependency vulnerability alerts (npm audit, Dependabot)

**Initial Assessment Checklist:**
- [ ] What is the nature of the incident?
- [ ] Is there active exploitation?
- [ ] What data/systems are affected?
- [ ] How many users are potentially impacted?
- [ ] What is the initial severity classification?

**Immediate Notifications (Critical/High):**
1. Security Lead
2. Engineering Lead
3. If data breach: Legal/Compliance

### 5.2 Containment

#### Critical Severity (Immediate Actions)
1. Revoke all potentially compromised API keys and tokens
2. Rotate Supabase service role key if database compromised
3. Rotate Clerk signing keys if auth compromised
4. Enable Vercel password protection if needed
5. Block suspicious IPs at infrastructure level
6. Notify affected users to reset passwords

#### High Severity
1. Isolate affected components/endpoints
2. Deploy temporary mitigations (rate limiting, additional validation)
3. Disable affected features if necessary
4. Document all containment actions with timestamps

#### Medium/Low Severity
1. Document vulnerability details
2. Create private security issue for tracking
3. Schedule fix in next deployment cycle
4. Monitor for exploitation attempts

### 5.3 Eradication

**Root Cause Analysis:**
1. Identify how the vulnerability was introduced
2. Check for similar patterns elsewhere in codebase
3. Review related commits and changes
4. Document findings in incident report

**Code Fix Requirements:**
- [ ] Fix addresses root cause, not just symptoms
- [ ] Tests added to prevent regression
- [ ] Code review by at least one other engineer
- [ ] Security-focused review for Critical/High

**Testing Before Deployment:**
- [ ] Unit tests pass
- [ ] TypeScript compilation clean
- [ ] Manual verification in staging (if available)
- [ ] Verify fix doesn't break existing functionality

### 5.4 Recovery

**Deployment Procedure:**
1. Merge fix to main branch
2. Deploy to production via Vercel
3. Verify deployment successful
4. Monitor logs for 30 minutes post-deployment

**Verification Steps:**
- [ ] Vulnerability no longer exploitable
- [ ] No new errors in logs
- [ ] User-facing functionality working
- [ ] Performance metrics normal

**User Notification (if data affected):**
- Use breach notification template (Section 6)
- Include: what happened, what data, what we've done, what they should do
- Provide support contact for questions

### 5.5 Post-Incident

**Incident Report Contents:**
- Incident timeline
- Root cause analysis
- Impact assessment (users, data, duration)
- Response actions taken
- Lessons learned
- Preventive measures implemented

**Lessons Learned Meeting:**
- Schedule within 7 days of resolution
- All responders participate
- Focus on process improvement, not blame
- Document action items with owners and deadlines

---

## 6. Data Breach Specific Procedures

### 6.1 PII/Sensitive Data Breach Response

**Immediate Containment (First 2 Hours):**
1. Stop ongoing data exfiltration
2. Preserve evidence (logs, database snapshots)
3. Assess scope of breach
4. Begin breach documentation

**Legal Notification Requirements:**

| Regulation | Timeline | Authority | Notes |
|------------|----------|-----------|-------|
| **GDPR** | 72 hours | Supervisory authority | Required if risk to individuals |
| **CCPA** | "Most expedient time" | California AG (if 500+ CA residents) | Written notice to affected users |
| **State Laws** | Varies (24h - 60 days) | State AG | Check requirements for user locations |

### 6.2 Breach Assessment Checklist

```
BREACH ASSESSMENT FORM
═══════════════════════════════════════════════════════════════
Date/Time Discovered: ________________
Discovered By: ________________
Initial Responder: ________________

DATA AFFECTED:
[ ] User emails/identities
[ ] Conversation content
[ ] User memories
[ ] Preferences/settings
[ ] Payment information (Stripe)
[ ] Authentication tokens
[ ] Other: ________________

SCOPE:
Estimated users affected: ________________
Data records exposed: ________________
Duration of exposure: ________________

ROOT CAUSE:
[ ] Code vulnerability
[ ] Credential compromise
[ ] Third-party breach
[ ] Insider threat
[ ] Misconfiguration
[ ] Other: ________________

CURRENT STATUS:
[ ] Vulnerability closed
[ ] Data access stopped
[ ] Evidence preserved
[ ] Legal notified
[ ] Users notified

RISK ASSESSMENT:
Risk level to users: [ ] High [ ] Medium [ ] Low
Identity theft risk: [ ] Yes [ ] No
Financial harm risk: [ ] Yes [ ] No
Emotional/safety risk: [ ] Yes [ ] No
═══════════════════════════════════════════════════════════════
```

### 6.3 User Notification Template

```
Subject: Important Security Notice from VERA

Dear [User],

We are writing to inform you of a security incident that may have 
affected your account.

WHAT HAPPENED:
[Brief, clear description of the incident]

WHAT INFORMATION WAS INVOLVED:
[Specific data types affected]

WHAT WE ARE DOING:
[Actions taken to address the incident]

WHAT YOU CAN DO:
- [Specific recommended actions]
- [Password reset link if applicable]
- [Other protective measures]

We sincerely apologize for this incident. The privacy and security 
of your personal information is extremely important to us.

If you have any questions, please contact us at support@veraneural.com.

Sincerely,
The VERA Team
```

---

## 7. Emergency Contacts

| Role | Primary Contact | Backup |
|------|-----------------|--------|
| **Security Lead** | [TBD - security@veraneural.com] | Engineering Lead |
| **Engineering Lead** | [TBD] | - |
| **Legal/Compliance** | [TBD] | - |
| **Clerk Support** | https://clerk.com/support | - |
| **Supabase Support** | https://supabase.com/support | - |
| **Vercel Support** | https://vercel.com/support | - |
| **Stripe Support** | https://support.stripe.com | - |

---

## 8. Regular Security Practices

### 8.1 Ongoing (Every Deployment)

- [ ] `npm audit` - Check for dependency vulnerabilities
- [ ] TypeScript strict mode compilation
- [ ] Code review for all PRs
- [ ] No secrets in code (use environment variables)
- [ ] HTTPS-only for all external communications

### 8.2 Weekly

- [ ] Review error logs for anomalies
- [ ] Check failed authentication attempts
- [ ] Review new npm audit advisories
- [ ] Verify backups are running

### 8.3 Monthly

- [ ] Access audit (who has production access?)
- [ ] Review and rotate API keys (if policy requires)
- [ ] Check Clerk user sessions for anomalies
- [ ] Review Supabase RLS policies
- [ ] Verify CSP headers are working

### 8.4 Quarterly

- [ ] Dependency major version updates
- [ ] Security-focused code review of auth flows
- [ ] Review and update this security policy
- [ ] Incident response drill (tabletop exercise)
- [ ] Third-party security assessment (if applicable)

---

## 9. Mental Health App Security Considerations

### 9.1 Sensitive Data Categories

| Category | Sensitivity | Special Handling |
|----------|-------------|------------------|
| **Crisis Indicators** | CRITICAL | Never log, special access controls |
| **Conversation Content** | HIGH | Encrypted at rest, user-deletable |
| **User Memories** | HIGH | Requires explicit consent, exportable |
| **Emotional State Data** | HIGH | Anonymize in analytics |
| **Assessment Results** | MEDIUM | User-owned, exportable |
| **Usage Patterns** | MEDIUM | Aggregate only for analytics |

### 9.2 Additional Safeguards

1. **No conversation content in logs**: Error messages must not include user input
2. **Memory consent required**: Never store memories without explicit opt-in
3. **Right to be forgotten**: Complete data deletion must be available
4. **Export capability**: Users can export all their data (GDPR compliance)
5. **Session security**: Automatic logout after inactivity
6. **No third-party data sharing**: User data never sold or shared for advertising

### 9.3 Crisis Response Integration

If a security incident affects crisis detection or response capabilities:
1. Escalate immediately to Critical severity
2. Ensure crisis resources remain accessible
3. Document any impact on user safety features
4. Prioritize restoration of safety features above all else

---

## 10. Audit Log Retention

VERA maintains compliance audit logs for security monitoring and regulatory compliance.

### 10.1 Retention Policy

| Setting | Default | Configuration |
|---------|---------|---------------|
| **Retention Period** | 365 days | `AUDIT_RETENTION_DAYS` env var |
| **Cleanup Schedule** | Daily at 3 AM UTC | External cron or Supabase scheduled function |
| **Affected Table** | `audit_logs` | All entries older than retention period |

### 10.2 What Is Logged

| Event Category | Examples | Retention Reason |
|----------------|----------|------------------|
| **Authentication** | Login, logout, failed attempts | Security monitoring |
| **Data Access** | Export requests, deletion requests | GDPR/CCPA compliance |
| **Subscriptions** | Created, cancelled, payment failures | Business audit trail |
| **Consent** | Cookie preferences, memory consent | Regulatory compliance |
| **Security** | Rate limiting, blocked requests | Threat detection |
| **Admin Actions** | Settings changes, user access | Accountability |

### 10.3 Privacy Safeguards

Audit logs are designed to be privacy-compliant:

- **IP Addresses**: Hashed (not stored in plain text)
- **User Agents**: Truncated to 200 characters
- **Metadata**: Sanitized to remove PII before logging
- **Never Logged**: Passwords, tokens, message content, conversation data

### 10.4 Manual Cleanup

Administrators can trigger manual cleanup via:

```bash
# Via Admin API (requires admin authentication)
POST /api/admin/cleanup-audit-logs
Content-Type: application/json

{ "retentionDays": 365 }

# Via external cron (requires API key)
POST /api/admin/cleanup-audit-logs
Authorization: Bearer <ADMIN_CLEANUP_API_KEY>
```

### 10.5 Database Function

For Supabase scheduled jobs:

```sql
-- Run cleanup with default 365-day retention
SELECT cleanup_old_audit_logs();

-- Run cleanup with custom retention
SELECT cleanup_old_audit_logs(90);
```

---

## 11. Revision History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-01-25 | 1.1 | Add audit log retention policy | Engineering Team |
| 2026-01-25 | 1.0 | Initial version | Engineering Team |

---

## 12. Document Control

- **Owner**: Security Lead
- **Review Frequency**: Quarterly
- **Next Review**: 2026-04-25
- **Distribution**: Internal (Engineering, Leadership)

---

*This document should be reviewed and updated whenever there are significant changes to VERA's infrastructure, security posture, or regulatory requirements.*
