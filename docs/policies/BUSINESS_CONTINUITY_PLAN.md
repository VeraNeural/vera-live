# VERA Business Continuity Plan

> **Document ID:** BCP-001  
> **Version:** 1.0  
> **Effective Date:** January 25, 2026  
> **Classification:** Confidential  

---

## 1. Purpose

This Business Continuity Plan (BCP) establishes procedures for maintaining or rapidly restoring critical business operations during and after a significant disruption. It ensures VERA can continue serving users during incidents while prioritizing safety features.

---

## 2. Scope

This plan covers:
- Critical system failures
- Infrastructure outages
- Security incidents
- Natural disasters
- Vendor service disruptions
- Key personnel unavailability

---

## 3. Recovery Objectives

### 3.1 Recovery Time Objectives (RTO)

| System | RTO | Priority |
|--------|-----|----------|
| Crisis detection & safety resources | 30 minutes | P1 - Critical |
| Authentication services | 1 hour | P1 - Critical |
| Core chat functionality | 2 hours | P1 - Critical |
| User data persistence | 4 hours | P2 - High |
| Voice features | 8 hours | P2 - High |
| Analytics & monitoring | 24 hours | P3 - Medium |
| Admin features | 24 hours | P3 - Medium |
| Marketing site | 48 hours | P4 - Low |

### 3.2 Recovery Point Objectives (RPO)

| Data Type | RPO | Backup Frequency |
|-----------|-----|------------------|
| User conversations | 24 hours | Daily |
| User accounts | 24 hours | Daily |
| Audit logs | 24 hours | Continuous (database) |
| Application code | 0 (real-time) | Git (continuous) |
| Configuration | 0 (real-time) | Git (continuous) |

---

## 4. Critical Systems Inventory

### 4.1 Internal Systems

| System | Description | Dependencies | Vendor |
|--------|-------------|--------------|--------|
| Web Application | User-facing Next.js app | Vercel, Supabase, Clerk | Vercel |
| Database | PostgreSQL data storage | AWS (via Supabase) | Supabase |
| Authentication | User identity management | N/A | Clerk |
| AI Processing | Conversation intelligence | N/A | Anthropic |
| Payments | Subscription billing | N/A | Stripe |
| Voice | Real-time voice features | N/A | Hume |

### 4.2 External Dependencies

| Dependency | Impact if Unavailable | Mitigation |
|------------|----------------------|------------|
| Internet connectivity | Complete outage | Multiple ISPs for staff |
| DNS | Application unreachable | Multiple DNS providers |
| Cloud providers | Service unavailable | Provider DR capabilities |
| AI API | Degraded functionality | Graceful degradation |

---

## 5. Business Impact Analysis

### 5.1 Impact Categories

| Category | Description |
|----------|-------------|
| **Safety** | Impact on crisis detection and safety resources |
| **User** | Impact on user experience and service |
| **Data** | Risk of data loss or exposure |
| **Financial** | Revenue and cost impact |
| **Reputation** | Brand and trust impact |
| **Legal** | Regulatory and compliance impact |

### 5.2 Scenario Impact Analysis

| Scenario | Safety | User | Data | Financial | Reputation |
|----------|--------|------|------|-----------|------------|
| Database outage | HIGH | HIGH | MEDIUM | HIGH | HIGH |
| Auth provider outage | MEDIUM | HIGH | LOW | HIGH | MEDIUM |
| AI API outage | LOW | HIGH | LOW | MEDIUM | MEDIUM |
| Hosting outage | HIGH | HIGH | LOW | HIGH | HIGH |
| DDoS attack | MEDIUM | HIGH | LOW | MEDIUM | MEDIUM |
| Data breach | LOW | HIGH | HIGH | HIGH | CRITICAL |

---

## 6. Continuity Strategies

### 6.1 Prevention

| Strategy | Implementation |
|----------|----------------|
| Redundancy | Multi-region infrastructure (via providers) |
| Monitoring | Real-time health checks, alerting |
| Backups | Daily automated backups, 30-day retention |
| Security | Defense in depth, incident response plan |
| Testing | Quarterly DR tests, annual full exercise |

### 6.2 Response Strategies by Scenario

#### Database Outage
1. Verify outage with Supabase status page
2. Contact Supabase support (Critical tier vendors)
3. Enable read-only mode if partial access
4. Communicate status to users
5. Prepare for failover if prolonged

#### Authentication Outage
1. Verify outage with Clerk status page
2. Contact Clerk support
3. Enable cached sessions if possible
4. Communicate status to users
5. Prepare alternative auth if prolonged (>4 hours)

#### AI API Outage
1. Verify outage with Anthropic
2. Enable graceful degradation
3. Display maintenance message in chat
4. **Ensure crisis resources remain accessible**
5. Queue messages for later processing if possible

#### Hosting Outage
1. Verify outage with Vercel status
2. Contact Vercel support
3. Prepare DNS redirect to static status page
4. **Ensure crisis resources accessible via status page**
5. Prepare alternative hosting if prolonged

---

## 7. Incident Response Integration

### 7.1 Escalation Path

```
Detection
    │
    ▼
Engineering On-Call
    │
    ├──[< 30 min fix]──► Resolve & Document
    │
    ▼
Escalate to Lead
    │
    ├──[< 2 hour fix]──► Resolve & Document
    │
    ▼
Invoke BCP
    │
    ▼
Executive Notification
    │
    ▼
Crisis Management Team
```

### 7.2 Crisis Management Team

| Role | Primary | Backup | Contact |
|------|---------|--------|---------|
| Incident Commander | CEO/Founder | Engineering Lead | [Contact] |
| Technical Lead | Engineering Lead | Senior Engineer | [Contact] |
| Communications | Marketing Lead | CEO | [Contact] |
| Security | Security Officer | Engineering Lead | [Contact] |

### 7.3 Communication Plan

| Audience | Method | Timing | Owner |
|----------|--------|--------|-------|
| Internal team | Slack/Email | Immediate | Incident Commander |
| Users (critical) | In-app banner | Within 15 min | Technical Lead |
| Users (general) | Status page, email | Within 1 hour | Communications |
| Vendors | Direct contact | As needed | Technical Lead |
| Regulators | Formal notification | Per requirements | Security Officer |

---

## 8. Recovery Procedures

### 8.1 Database Recovery

**Prerequisites:**
- Supabase dashboard access
- Backup verification

**Procedure:**
1. Assess extent of data loss/corruption
2. Identify most recent clean backup
3. Create new database instance if needed
4. Restore from backup
5. Verify data integrity
6. Update connection strings
7. Verify application functionality
8. Monitor for issues

**Estimated Time:** 2-4 hours

### 8.2 Application Recovery

**Prerequisites:**
- Vercel dashboard access
- GitHub access

**Procedure:**
1. Identify last known good deployment
2. Rollback to previous deployment (Vercel)
3. Verify application loads
4. Verify core functionality
5. Monitor for issues
6. Investigate root cause

**Estimated Time:** 15-30 minutes

### 8.3 Full System Recovery

**Prerequisites:**
- All vendor dashboard access
- Backup access

**Procedure:**
1. Establish incident command
2. Assess all affected systems
3. Prioritize by recovery priority (Section 3.1)
4. Recover P1 systems first (crisis detection, auth, chat)
5. Verify P1 systems functional
6. Recover P2 systems
7. Recover P3/P4 systems
8. Full system verification
9. Return to normal operations
10. Post-incident review

**Estimated Time:** 4-8 hours

---

## 9. Safety-Critical Considerations

### 9.1 Crisis Detection Priority

**VERA handles mental health conversations. Crisis detection is safety-critical.**

In any outage scenario:
1. Ensure 988 crisis resources are accessible
2. Display static crisis resources if chat unavailable
3. Prioritize restoration of crisis detection
4. Test crisis detection before full restoration

### 9.2 Fallback Crisis Resources

If application is completely unavailable, status page must display:

```
VERA is temporarily unavailable.

If you're in crisis, please reach out:
• Call or text 988 (Suicide & Crisis Lifeline)
• Text HOME to 741741 (Crisis Text Line)
• Call 911 for emergencies

We're working to restore service as quickly as possible.
```

---

## 10. Testing and Maintenance

### 10.1 Testing Schedule

| Test Type | Frequency | Scope |
|-----------|-----------|-------|
| Backup restoration | Quarterly | Single table recovery |
| Failover simulation | Semi-annually | Simulated provider outage |
| Full DR exercise | Annually | Complete recovery scenario |
| Communication test | Quarterly | Notification systems |

### 10.2 Test Documentation

Each test must document:
- Test date and participants
- Scenario tested
- Results (pass/fail)
- Time to recover
- Issues identified
- Remediation actions
- Lessons learned

### 10.3 Plan Maintenance

| Activity | Frequency | Owner |
|----------|-----------|-------|
| Contact list update | Quarterly | Security Officer |
| Vendor inventory update | On change | Engineering Lead |
| Full plan review | Annually | Security Officer |
| Post-incident updates | After incidents | Incident Commander |

---

## 11. Vendor Emergency Contacts

| Vendor | Service | Support Contact | SLA |
|--------|---------|-----------------|-----|
| Supabase | Database | support@supabase.io | 24/7 (Enterprise) |
| Vercel | Hosting | Enterprise support | 24/7 (Enterprise) |
| Clerk | Auth | support@clerk.com | Business hours |
| Stripe | Payments | stripe.com/support | 24/7 |
| Anthropic | AI | Enterprise support | Business hours |

---

## 12. Roles and Responsibilities

| Role | Responsibilities |
|------|------------------|
| **Incident Commander** | Overall incident leadership, decisions, communications |
| **Technical Lead** | Technical recovery execution, vendor coordination |
| **Security Officer** | Security implications, regulatory notifications |
| **Communications** | User and external communications |
| **All Personnel** | Report issues, support recovery, document actions |

---

## 13. Related Documents

| Document | Purpose |
|----------|---------|
| SECURITY.md | Incident response procedures |
| Information Security Policy | Security requirements |
| Vendor Management Policy | Vendor contacts and SLAs |
| Change Management Policy | Recovery deployment process |

---

## 14. Revision History

| Version | Date | Changes | Approved By |
|---------|------|---------|-------------|
| 1.0 | 2026-01-25 | Initial version | Security Officer |

---

## 15. Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Security Officer | _________________ | _________________ | _________________ |
| Engineering Lead | _________________ | _________________ | _________________ |
| Executive Sponsor | _________________ | _________________ | _________________ |

---

*This plan is confidential and should be stored securely. Annual review and testing required.*
