# Data Protection Impact Assessment (DPIA)
## VERA AI Mental Health Support Application

> **Document Control**

| Field | Value |
|-------|-------|
| Document ID | DPIA-VERA-001 |
| Version | 1.0 |
| Date | January 25, 2026 |
| Author | [Name/Role] |
| Approved by | [Name/Role] |
| Review date | January 25, 2027 |
| Classification | Confidential |
| Status | Draft - Pending Approval |

---

## 1. Introduction

### 1.1 Purpose of this DPIA

This Data Protection Impact Assessment (DPIA) evaluates the privacy risks associated with VERA, an AI-powered mental health support application, and identifies measures to mitigate those risks in compliance with GDPR Article 35.

A DPIA is a process to help identify and minimize data protection risks. This assessment:
- Describes the nature, scope, context, and purposes of processing
- Assesses necessity, proportionality, and compliance measures
- Identifies and assesses risks to individuals' rights and freedoms
- Identifies measures to mitigate those risks

### 1.2 Why a DPIA is Required

Under GDPR Article 35, a DPIA is mandatory when processing is "likely to result in a high risk to the rights and freedoms of natural persons." VERA's processing triggers multiple DPIA requirements:

| Trigger | Applicable to VERA | Reference |
|---------|-------------------|-----------|
| ✅ Processing of health data | Mental health conversations contain health information | Art. 35(3)(b), Art. 9 |
| ✅ Large-scale processing | Processing data of many individuals | Art. 35(3)(b) |
| ✅ Automated decision-making | AI generates personalized responses | Art. 35(3)(a) |
| ✅ New technologies | Large Language Model (LLM) technology | Recital 91 |
| ✅ Vulnerable individuals | Users seeking mental health support | WP29 Guidelines |
| ✅ Sensitive data evaluation | Psychological profiles and emotional states | WP29 Guidelines |

**Conclusion:** DPIA is **mandatory** for VERA.

### 1.3 Scope of this DPIA

This DPIA covers:
- VERA web application (vera.ai)
- All user-facing features
- Backend data processing
- Third-party integrations (Supabase, Anthropic, Stripe)
- Data transfers to third countries

This DPIA does **not** cover:
- Internal corporate systems
- Employee data processing
- Marketing activities (none currently conducted)

### 1.4 DPIA Team

| Role | Name | Responsibility |
|------|------|----------------|
| Data Controller Representative | [CEO/Founder Name] | Overall accountability, final approval |
| Data Protection Officer | [DPO Name or "Not appointed"] | Advisory, compliance review, consultation |
| Technical Lead | [CTO/Tech Lead Name] | Technical accuracy, security measures |
| Legal Advisor | [Legal Counsel Name] | Legal compliance, regulatory requirements |
| Product Lead | [Product Manager Name] | User experience, feature assessment |

### 1.5 Methodology

This DPIA follows:
- ICO DPIA guidance (UK)
- Article 29 Working Party Guidelines on DPIAs (WP248)
- CNIL PIA methodology (France)
- GDPR Articles 35-36

---

## 2. Processing Description

### 2.1 Nature of Processing

**What is VERA?**

VERA is a conversational AI application that provides trauma-informed mental health support. It uses large language models to engage in supportive dialogue with users experiencing stress, anxiety, emotional challenges, or seeking personal growth support.

**Key processing activities:**

| Activity | Description | Data Types |
|----------|-------------|------------|
| Account management | User registration, authentication, profile | Email, password (hashed), user ID |
| Conversation processing | User messages processed by AI to generate responses | Message content, timestamps, conversation metadata |
| Memory storage | User-provided context stored for personalization | Life circumstances, preferences, goals |
| Crisis detection | Automated detection of crisis signals in messages | Message content analysis results |
| Payment processing | Subscription billing via Stripe | Payment status, subscription tier (card details held by Stripe) |
| Analytics | Aggregate usage statistics | Anonymized usage patterns |
| Audit logging | Security and compliance logging | Access logs, consent records |

**Processing operations performed:**

1. **Collection** - User provides data through forms and conversations
2. **Recording** - Data stored in encrypted database
3. **Organization** - Data linked to user accounts
4. **Storage** - Encrypted at rest in Supabase/AWS
5. **Retrieval** - Data accessed to provide service
6. **Use** - Processing by AI to generate responses
7. **Transmission** - Data sent to AI provider (Anthropic) for processing
8. **Erasure** - User-initiated deletion, automated retention enforcement

### 2.2 Context of Processing

**About VERA (the organization):**
- Legal entity: [Company Name]
- Jurisdiction: [Country of incorporation]
- Size: [Startup/SME/Enterprise]
- Sector: Mental health technology

**Relationship with data subjects:**
- Users voluntarily seek mental health support
- Relationship is B2C (direct to consumer)
- Users may be in vulnerable emotional states
- Trust is fundamental to the service

**Prior processing:**
- VERA is [new/existing] service
- [No prior incidents / Prior incidents: describe]

### 2.3 Scope of Processing

**Data subjects:**

| Category | Description | Estimated Volume |
|----------|-------------|------------------|
| Primary users | Adults seeking mental health support | [X,XXX] registered users |
| Active users | Monthly active users | [X,XXX] MAU |
| Geographic scope | Primarily US, UK, EU, AU, CA | Multi-region |

**Scale of processing:**

| Metric | Current Estimate | Projected (12 months) |
|--------|------------------|----------------------|
| Registered users | [Number] | [Number] |
| Active monthly users | [Number] | [Number] |
| Messages processed/day | [Number] | [Number] |
| Conversations stored | [Number] | [Number] |
| Memories stored | [Number] | [Number] |

**Frequency:**
- Processing is continuous (24/7 availability)
- Peak usage: [Time periods]
- Average session duration: [X] minutes

### 2.4 Data Categories Processed

| Category | Specific Elements | Special Category (Art. 9)? | Basis |
|----------|-------------------|---------------------------|-------|
| **Account data** | Email address, hashed password, user ID, created date | No | Contract |
| **Authentication data** | Session tokens, OAuth tokens (via Clerk) | No | Contract |
| **Conversation content** | User messages, AI responses, timestamps | **Yes - health data** | Explicit consent |
| **Memory data** | User-provided context, life circumstances, preferences | **Potentially - health data** | Explicit consent |
| **Emotional state indicators** | Detected emotional patterns, crisis signals | **Yes - health data** | Vital interests + consent |
| **Subscription data** | Tier, status, billing cycle | No | Contract |
| **Payment data** | Payment method type, transaction IDs (via Stripe) | No | Contract |
| **Technical data** | IP address (hashed), device type, browser, session ID | No | Legitimate interest |
| **Usage data** | Feature usage, message counts, session duration | No | Legitimate interest |
| **Consent records** | Consent timestamps, versions, preferences | No | Legal obligation |
| **Audit logs** | Access events, administrative actions | No | Legal obligation |

### 2.5 Retention Periods

| Data Type | Retention Period | Justification | Deletion Method |
|-----------|------------------|---------------|-----------------|
| Account data | Account lifetime + 30 days | Recovery period after deletion request | Automated |
| Conversation content | User-controlled (default: indefinite) | Users may need historical context | User-initiated or account deletion |
| Memory data | User-controlled | Personalization requires persistence | User-initiated or account deletion |
| Technical logs | 90 days | Security investigation window | Automated rotation |
| Audit logs | 365 days | Compliance and security | Automated purge |
| Analytics (aggregated) | 24 months | Trend analysis | Automated purge |
| Backup data | 30 days | Disaster recovery | Automated rotation |
| Deleted account data | 30 days in soft-delete | Recovery window | Hard delete after 30 days |

### 2.6 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER DEVICE                                     │
│  (Browser/Mobile - User enters messages, provides consent, manages account) │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS/TLS 1.3
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           VERCEL EDGE NETWORK                                │
│              (CDN, DDoS protection, request routing, edge compute)          │
│                              Location: Global                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         VERA APPLICATION (Next.js)                           │
│                              Location: US (Vercel)                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │  Authentication │  │  Chat Handler   │  │  API Routes     │              │
│  │  (Clerk)        │  │  (AI Processing)│  │  (Business Logic│              │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘              │
└───────────┼────────────────────┼────────────────────┼────────────────────────┘
            │                    │                    │
            ▼                    ▼                    ▼
┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│      CLERK        │  │    ANTHROPIC      │  │     SUPABASE      │
│  (Authentication) │  │  (Claude AI API)  │  │    (Database)     │
│   Location: US    │  │   Location: US    │  │  Location: US/AWS │
│                   │  │                   │  │                   │
│ • OAuth handling  │  │ • Message         │  │ • User accounts   │
│ • Session mgmt    │  │   processing      │  │ • Conversations   │
│ • User profiles   │  │ • Response gen    │  │ • Memories        │
│                   │  │ • NO data         │  │ • Audit logs      │
│                   │  │   retention       │  │                   │
│                   │  │ • NO training     │  │ Encryption:       │
│                   │  │   on user data    │  │ • At rest (AES256)│
│                   │  │                   │  │ • In transit(TLS) │
└───────────────────┘  └───────────────────┘  └───────────────────┘
                                                       │
                                                       ▼
                                             ┌───────────────────┐
                                             │      STRIPE       │
                                             │    (Payments)     │
                                             │   Location: US    │
                                             │                   │
                                             │ • Payment tokens  │
                                             │ • Subscription    │
                                             │   management      │
                                             │ • PCI-DSS Level 1 │
                                             └───────────────────┘
```

### 2.7 Third-Party Processors

| Processor | Role | Location | Data Processed | Safeguards | DPA Status |
|-----------|------|----------|----------------|------------|------------|
| **Supabase Inc.** | Database hosting | US (AWS us-east-1) | All user data, conversations, memories | SOC 2 Type II, encryption, RLS | ☐ Signed / ☐ Pending |
| **Vercel Inc.** | Application hosting | US (Global edge) | Application logs, request data | SOC 2 Type II, encryption | ☐ Signed / ☐ Pending |
| **Anthropic PBC** | AI processing | US | Message content (not retained) | DPA, zero-retention policy, no training | ☐ Signed / ☐ Pending |
| **Stripe Inc.** | Payment processing | US | Payment data, subscription status | PCI-DSS Level 1, SOC 2 | ☐ Signed / ☐ Pending |
| **Clerk Inc.** | Authentication | US | Email, OAuth tokens, sessions | SOC 2 Type II, encryption | ☐ Signed / ☐ Pending |

### 2.8 International Data Transfers

Data is transferred from EEA/UK to the United States. Transfer mechanisms:

| Processor | Transfer Mechanism | Supplementary Measures |
|-----------|-------------------|------------------------|
| Supabase | Standard Contractual Clauses (SCCs) | Encryption at rest/transit, access controls |
| Vercel | SCCs + DPF (if certified) | Edge encryption, minimal data exposure |
| Anthropic | SCCs | Zero retention policy, encryption |
| Stripe | SCCs + DPF | PCI-DSS controls, tokenization |
| Clerk | SCCs | Encryption, access controls |

**Transfer Impact Assessment (TIA) Summary:**
- US law (FISA 702, EO 12333) poses potential risk
- Mitigating factors:
  - Data encrypted in transit and at rest
  - Anthropic does not retain message content
  - Technical measures prevent mass surveillance access
  - Processors implement strong access controls
- **Conclusion:** Transfers may proceed with implemented safeguards

---

## 3. Consultation

### 3.1 Data Subject Consultation

**Methods used to gather data subject views:**

| Method | Date | Participants | Key Findings |
|--------|------|--------------|--------------|
| Beta user interviews | [Date] | [N] users | [Summary of privacy concerns] |
| Privacy policy feedback | Ongoing | [N] responses | [Summary] |
| Support ticket analysis | [Date range] | [N] tickets | [Summary of privacy questions] |
| User research sessions | [Date] | [N] users | [Summary] |

**Key concerns raised by data subjects:**

| Concern | Response/Mitigation |
|---------|---------------------|
| "Who can see my conversations?" | Only user can access; RLS enforces isolation |
| "Is my data used to train AI?" | No - Anthropic contractually prohibited from training |
| "Can I delete everything?" | Yes - full account deletion with data purge |
| "Is this really confidential?" | Technical controls ensure confidentiality |

### 3.2 Internal Stakeholder Consultation

| Stakeholder | Area of Expertise | Input Provided |
|-------------|-------------------|----------------|
| Engineering team | Technical security | Reviewed security measures, identified gaps |
| Product team | User experience | Assessed consent flows, usability of privacy controls |
| Legal counsel | Regulatory compliance | Reviewed legal basis, consent language, DPAs |
| Mental health advisor | Clinical appropriateness | Reviewed crisis protocols, safety measures |

### 3.3 External Expert Consultation

| Expert | Organization | Consultation Topic | Date |
|--------|--------------|-------------------|------|
| Privacy counsel | [Law firm] | GDPR compliance review | [Date] |
| Security auditor | [Security firm] | Penetration testing, security assessment | [Date] |
| Accessibility consultant | [Firm] | Accessibility of privacy controls | [Date] |

---

## 4. Necessity and Proportionality

### 4.1 Legal Basis Assessment

#### 4.1.1 Account Data Processing

| Element | Assessment |
|---------|------------|
| **Data** | Email, password (hashed), user ID |
| **Legal basis** | Art. 6(1)(b) - Contract performance |
| **Justification** | Account required to provide personalized service |
| **Proportionality** | Minimal data collected; only email required |

#### 4.1.2 Conversation Processing

| Element | Assessment |
|---------|------------|
| **Data** | User messages, AI responses (health data) |
| **Legal basis - general** | Art. 6(1)(a) - Consent |
| **Legal basis - special category** | Art. 9(2)(a) - Explicit consent |
| **How consent obtained** | Explicit consent screen before first conversation |
| **Freely given** | Service usable without AI chat (crisis resources still available) |
| **Specific** | Consent specifically for conversation processing |
| **Informed** | Clear explanation of what data is processed, by whom, and why |
| **Unambiguous** | Affirmative action required (button click "I consent") |
| **Withdrawable** | Settings page allows consent withdrawal; triggers data deletion |
| **Documented** | Consent timestamp and version recorded in audit log |

#### 4.1.3 Memory Storage

| Element | Assessment |
|---------|------------|
| **Data** | User-provided context, life circumstances |
| **Legal basis** | Art. 6(1)(a) + Art. 9(2)(a) - Consent |
| **Justification** | Enables personalized, contextual support |
| **User control** | Memories are optional; user creates, edits, deletes |

#### 4.1.4 Crisis Detection

| Element | Assessment |
|---------|------------|
| **Data** | Message content analysis for crisis signals |
| **Legal basis** | Art. 6(1)(d) - Vital interests + Art. 9(2)(c) - Vital interests |
| **Justification** | Protecting life when user may be at risk |
| **Proportionality** | Only activated when crisis signals detected; provides resources |

#### 4.1.5 Payment Processing

| Element | Assessment |
|---------|------------|
| **Data** | Subscription status, payment method (via Stripe) |
| **Legal basis** | Art. 6(1)(b) - Contract performance |
| **Justification** | Required to provide paid service tiers |
| **Data minimization** | Actual payment data held by Stripe (PCI-compliant) |

#### 4.1.6 Analytics

| Element | Assessment |
|---------|------------|
| **Data** | Aggregated, anonymized usage statistics |
| **Legal basis** | Art. 6(1)(f) - Legitimate interest |
| **Legitimate interest** | Service improvement, capacity planning |
| **Necessity** | Essential for maintaining and improving service |
| **Balancing test** | Minimal impact on users (data anonymized) vs. significant benefit |

### 4.2 Purpose Limitation

| Stated Purpose | Data Used | Is Use Justified? |
|----------------|-----------|-------------------|
| Provide AI mental health support | Conversation content | ✅ Core service |
| Personalize support experience | Memory data | ✅ User-requested feature |
| Maintain conversation continuity | Conversation history | ✅ Core service |
| Detect and respond to crisis | Message content | ✅ Vital interests |
| Process payments | Subscription/payment data | ✅ Contractual necessity |
| Improve service quality | Anonymized analytics | ✅ Legitimate interest |
| Comply with legal obligations | Audit logs | ✅ Legal requirement |

**Data explicitly NOT used for:**

| Prohibited Use | Control Mechanism |
|----------------|-------------------|
| AI model training | Anthropic DPA prohibits; verified in terms |
| Advertising or marketing | No advertising platform integrated |
| Profiling for third parties | No data sharing with third parties for this purpose |
| Sale of personal data | Prohibited by policy; no mechanisms exist |
| Research without consent | Separate research consent would be required |

### 4.3 Data Minimization

| Data Element | Necessary? | Justification | Minimization Applied |
|--------------|------------|---------------|---------------------|
| Email address | ✅ Required | Account identification, password reset | Only identifier required; no name |
| Password | ✅ Required | Account security | Stored only as bcrypt hash |
| User messages | ✅ Required | Core service functionality | User can delete at any time |
| AI responses | ✅ Required | Conversation continuity | Stored with user messages |
| IP address | ⚠️ Limited | Security, rate limiting, fraud prevention | Hashed; 90-day retention |
| Device info | ⚠️ Limited | Technical support, optimization | Minimal collection (type only) |
| User memories | ✅ Optional | User-controlled personalization | Only created by user action |

**Fields NOT collected:**

- Full name (not required)
- Phone number (not required)
- Physical address (not required)
- Demographics (not required)
- Social media profiles (not required)

### 4.4 Storage Limitation

| Data Type | Retention | Review Frequency | Auto-Deletion |
|-----------|-----------|------------------|---------------|
| Active account data | Account lifetime | N/A | On deletion request |
| Conversation content | User controlled | User-initiated | On account deletion |
| Technical logs | 90 days | Weekly rotation | ✅ Automated |
| Audit logs | 365 days | Annual review | ✅ Automated |
| Deleted data (soft-delete) | 30 days | Daily purge job | ✅ Automated |
| Backups | 30 days | Rolling rotation | ✅ Automated |

### 4.5 Accuracy

| Measure | Implementation |
|---------|----------------|
| User can view their data | Data export feature (JSON format) |
| User can correct account data | Edit profile in settings |
| User can delete messages | Delete individual or all messages |
| User can edit memories | Full CRUD control over memories |
| AI outputs disclaimed | Clear disclaimer that VERA is not a therapist |
| No consequential decisions | AI does not make decisions affecting legal/financial status |

### 4.6 Automated Decision-Making Assessment

Under GDPR Article 22, data subjects have rights regarding automated decision-making.

| Question | Assessment |
|----------|------------|
| Does processing involve automated decision-making? | Partially - AI generates responses |
| Does it produce legal or similarly significant effects? | **No** - Conversational support only |
| Are decisions solely automated? | **No** - Human crisis resources always provided |
| Is there human oversight? | **Yes** - Users contact support; crisis = human resources |

**Conclusion:** VERA does not meet the threshold for Art. 22 restrictions because:
1. AI responses do not produce legal effects
2. AI responses do not significantly affect users in a legal sense
3. Human alternatives always available (crisis hotlines, support)

However, as a best practice, users are:
- Informed that responses are AI-generated
- Reminded that VERA is not a replacement for human professionals
- Provided with human crisis resources

---

## 5. Risk Assessment

### 5.1 Risk Identification

| ID | Risk Description | Risk Category |
|----|------------------|---------------|
| R1 | Unauthorized access to individual user's conversations | Confidentiality |
| R2 | Large-scale data breach exposing mental health data | Confidentiality |
| R3 | AI providing harmful or dangerous advice | Physical/Psychological |
| R4 | Re-identification of anonymized/aggregated data | Confidentiality |
| R5 | Excessive data collection beyond stated purposes | Compliance |
| R6 | Data used for purposes not disclosed to users | Compliance |
| R7 | Users unable to exercise data subject rights | Rights |
| R8 | Unlawful international data transfers | Compliance |
| R9 | Third-party processor non-compliance | Compliance |
| R10 | User psychological distress from AI interactions | Psychological |
| R11 | Insider threat - employee access to user data | Confidentiality |
| R12 | Regulatory enforcement action | Organizational |
| R13 | Data loss or corruption | Availability/Integrity |
| R14 | Inadequate consent mechanisms | Compliance |
| R15 | Failure to detect or respond to user crisis | Physical |

### 5.2 Risk Analysis Framework

**Likelihood Scale:**

| Level | Description | Probability |
|-------|-------------|-------------|
| 1 - Rare | Exceptional circumstances only | <5% |
| 2 - Unlikely | Could occur but not expected | 5-25% |
| 3 - Possible | Might occur at some time | 25-50% |
| 4 - Likely | Will probably occur | 50-75% |
| 5 - Almost Certain | Expected to occur | >75% |

**Severity Scale:**

| Level | Description | Impact |
|-------|-------------|--------|
| 1 - Negligible | Minor inconvenience | Minimal |
| 2 - Minor | Some distress, easily remedied | Limited |
| 3 - Moderate | Significant distress, recoverable | Moderate |
| 4 - Major | Serious harm, difficult to recover | Significant |
| 5 - Catastrophic | Severe/irreversible harm | Severe |

**Risk Matrix:**

|              | Negligible (1) | Minor (2) | Moderate (3) | Major (4) | Catastrophic (5) |
|--------------|----------------|-----------|--------------|-----------|------------------|
| **Almost Certain (5)** | Medium | High | High | Critical | Critical |
| **Likely (4)** | Low | Medium | High | High | Critical |
| **Possible (3)** | Low | Medium | Medium | High | High |
| **Unlikely (2)** | Low | Low | Medium | Medium | High |
| **Rare (1)** | Low | Low | Low | Medium | Medium |

### 5.3 Detailed Risk Analysis

#### R1: Unauthorized Access to Individual Conversations

| Attribute | Assessment |
|-----------|------------|
| **Description** | Malicious actor gains access to a specific user's private mental health conversations |
| **Threat sources** | External attackers, credential theft, session hijacking |
| **Potential harm** | Psychological distress, discrimination, relationship damage, blackmail |
| **Likelihood (inherent)** | 3 - Possible (attractive target, credential attacks common) |
| **Severity** | 4 - Major (mental health data exposure causes significant harm) |
| **Inherent risk** | **HIGH** |

---

#### R2: Large-Scale Data Breach

| Attribute | Assessment |
|-----------|------------|
| **Description** | Mass exposure of multiple users' mental health conversations |
| **Threat sources** | Advanced persistent threats, SQL injection, misconfiguration |
| **Potential harm** | Mass psychological harm, regulatory fines (4% revenue), lawsuits, reputational destruction |
| **Likelihood (inherent)** | 2 - Unlikely (strong controls) but high-value target |
| **Severity** | 5 - Catastrophic (mass exposure of health data) |
| **Inherent risk** | **HIGH** |

---

#### R3: AI Providing Harmful Advice

| Attribute | Assessment |
|-----------|------------|
| **Description** | AI generates response that encourages self-harm, provides dangerous advice, or worsens mental state |
| **Threat sources** | AI hallucination, prompt injection, edge cases |
| **Potential harm** | Physical harm, suicide, psychological damage, legal liability |
| **Likelihood (inherent)** | 3 - Possible (AI can generate unexpected outputs) |
| **Severity** | 5 - Catastrophic (potential for loss of life) |
| **Inherent risk** | **HIGH** |

---

#### R4: Re-identification of Anonymized Data

| Attribute | Assessment |
|-----------|------------|
| **Description** | Aggregated/anonymized analytics data is re-identified to specific users |
| **Threat sources** | Data linkage attacks, inadequate anonymization |
| **Potential harm** | Privacy violation, potential for R1/R2 escalation |
| **Likelihood (inherent)** | 2 - Unlikely (strong anonymization) |
| **Severity** | 4 - Major (health data exposure) |
| **Inherent risk** | **MEDIUM** |

---

#### R5: Excessive Data Collection

| Attribute | Assessment |
|-----------|------------|
| **Description** | Collecting more personal data than necessary for stated purposes |
| **Threat sources** | Feature creep, developer oversight, poor requirements |
| **Potential harm** | Compliance violation, increased breach impact, user trust loss |
| **Likelihood (inherent)** | 2 - Unlikely (minimization policy in place) |
| **Severity** | 3 - Moderate (compliance issue, trust impact) |
| **Inherent risk** | **MEDIUM** |

---

#### R6: Purpose Creep

| Attribute | Assessment |
|-----------|------------|
| **Description** | Using collected data for purposes not disclosed to users |
| **Threat sources** | Business pressure, poor governance, acquisition |
| **Potential harm** | GDPR violation, user trust destruction, regulatory action |
| **Likelihood (inherent)** | 2 - Unlikely (strong policies) |
| **Severity** | 4 - Major (compliance and trust) |
| **Inherent risk** | **MEDIUM** |

---

#### R7: Inability to Exercise Rights

| Attribute | Assessment |
|-----------|------------|
| **Description** | Users cannot effectively access, delete, or port their data |
| **Threat sources** | Technical failures, poor UX, inadequate processes |
| **Potential harm** | GDPR violation, regulatory complaints, user frustration |
| **Likelihood (inherent)** | 2 - Unlikely (self-service tools implemented) |
| **Severity** | 3 - Moderate (compliance issue) |
| **Inherent risk** | **LOW** |

---

#### R8: Unlawful International Transfers

| Attribute | Assessment |
|-----------|------------|
| **Description** | Data transfers to US without adequate safeguards |
| **Threat sources** | Regulatory changes (Schrems III), processor non-compliance |
| **Potential harm** | Processing becomes unlawful, enforcement action, service disruption |
| **Likelihood (inherent)** | 3 - Possible (regulatory landscape uncertain) |
| **Severity** | 4 - Major (could halt processing) |
| **Inherent risk** | **HIGH** |

---

#### R9: Processor Non-Compliance

| Attribute | Assessment |
|-----------|------------|
| **Description** | Third-party processor (Supabase, Anthropic, etc.) fails to comply with GDPR obligations |
| **Threat sources** | Processor breach, inadequate controls, unauthorized sub-processing |
| **Potential harm** | Data exposure, VERA liability as controller |
| **Likelihood (inherent)** | 2 - Unlikely (major vendors with compliance programs) |
| **Severity** | 4 - Major (controller liability) |
| **Inherent risk** | **MEDIUM** |

---

#### R10: User Psychological Distress

| Attribute | Assessment |
|-----------|------------|
| **Description** | User experiences worsened mental state from AI interaction (excluding crisis situations) |
| **Threat sources** | Unhelpful responses, triggering content, dependency formation |
| **Potential harm** | User psychological harm, service blamed for outcomes |
| **Likelihood (inherent)** | 3 - Possible (mental health domain inherently risky) |
| **Severity** | 3 - Moderate (distress without physical harm) |
| **Inherent risk** | **MEDIUM** |

---

#### R11: Insider Threat

| Attribute | Assessment |
|-----------|------------|
| **Description** | Employee or contractor accesses user data without authorization |
| **Threat sources** | Curious employees, malicious insiders, social engineering |
| **Potential harm** | Privacy violation, trust destruction, individual harm |
| **Likelihood (inherent)** | 2 - Unlikely (access controls in place) |
| **Severity** | 4 - Major (targeted privacy violation) |
| **Inherent risk** | **MEDIUM** |

---

#### R12: Regulatory Enforcement

| Attribute | Assessment |
|-----------|------------|
| **Description** | Data protection authority takes enforcement action |
| **Threat sources** | Complaints, audits, breach notifications |
| **Potential harm** | Fines (up to €20M/4% revenue), processing bans, reputational damage |
| **Likelihood (inherent)** | 2 - Unlikely (compliance measures in place) |
| **Severity** | 5 - Catastrophic (could end business) |
| **Inherent risk** | **HIGH** |

---

#### R13: Data Loss or Corruption

| Attribute | Assessment |
|-----------|------------|
| **Description** | User data is lost, corrupted, or becomes unavailable |
| **Threat sources** | Infrastructure failure, ransomware, human error |
| **Potential harm** | Service disruption, user distress from lost history |
| **Likelihood (inherent)** | 2 - Unlikely (backups in place) |
| **Severity** | 3 - Moderate (recoverable from backups) |
| **Inherent risk** | **LOW** |

---

#### R14: Inadequate Consent

| Attribute | Assessment |
|-----------|------------|
| **Description** | Consent mechanism does not meet GDPR requirements |
| **Threat sources** | Poor implementation, dark patterns, unclear language |
| **Potential harm** | Unlawful processing, enforcement action |
| **Likelihood (inherent)** | 2 - Unlikely (consent designed carefully) |
| **Severity** | 4 - Major (processing becomes unlawful) |
| **Inherent risk** | **MEDIUM** |

---

#### R15: Failure to Respond to Crisis

| Attribute | Assessment |
|-----------|------------|
| **Description** | User in crisis is not provided with appropriate resources |
| **Threat sources** | Detection failure, system outage, inadequate resources |
| **Potential harm** | Loss of life, serious harm |
| **Likelihood (inherent)** | 2 - Unlikely (crisis detection implemented) |
| **Severity** | 5 - Catastrophic (potential death) |
| **Inherent risk** | **HIGH** |

### 5.4 Risk Summary Table

| ID | Risk | Likelihood | Severity | Inherent Risk |
|----|------|------------|----------|---------------|
| R1 | Unauthorized access | 3 | 4 | HIGH |
| R2 | Data breach | 2 | 5 | HIGH |
| R3 | Harmful AI advice | 3 | 5 | HIGH |
| R4 | Re-identification | 2 | 4 | MEDIUM |
| R5 | Excessive collection | 2 | 3 | MEDIUM |
| R6 | Purpose creep | 2 | 4 | MEDIUM |
| R7 | Rights exercise blocked | 2 | 3 | LOW |
| R8 | Unlawful transfers | 3 | 4 | HIGH |
| R9 | Processor non-compliance | 2 | 4 | MEDIUM |
| R10 | User distress | 3 | 3 | MEDIUM |
| R11 | Insider threat | 2 | 4 | MEDIUM |
| R12 | Regulatory enforcement | 2 | 5 | HIGH |
| R13 | Data loss | 2 | 3 | LOW |
| R14 | Inadequate consent | 2 | 4 | MEDIUM |
| R15 | Crisis response failure | 2 | 5 | HIGH |

---

## 6. Risk Mitigation Measures

### 6.1 Technical Measures

| Risk(s) | Measure | Description | Status | Effectiveness |
|---------|---------|-------------|--------|---------------|
| R1, R2, R11 | **Encryption at rest** | AES-256 encryption for all stored data in Supabase | ✅ Implemented | High |
| R1, R2, R8 | **Encryption in transit** | TLS 1.3 for all data transmission | ✅ Implemented | High |
| R1, R2, R11 | **Row-Level Security (RLS)** | Database enforces user data isolation | ✅ Implemented | High |
| R1, R2 | **Strong authentication** | Clerk authentication with secure session management | ✅ Implemented | High |
| R1 | **Multi-factor authentication** | Optional MFA for users | ⏳ Planned Q1 | High |
| R2, R11 | **Audit logging** | All data access logged with timestamps | ✅ Implemented | Medium |
| R2 | **Security monitoring** | Automated alerting for suspicious activity | ✅ Implemented | Medium |
| R2 | **Vulnerability scanning** | Automated dependency scanning (npm audit) | ✅ Implemented | Medium |
| R2 | **Penetration testing** | Annual third-party penetration test | ⏳ Scheduled | High |
| R3, R15 | **Crisis detection** | ML-based detection of crisis signals in messages | ✅ Implemented | High |
| R3 | **Content filtering** | Therapeutic boundaries enforced in AI responses | ✅ Implemented | Medium |
| R3 | **Response safety** | Refusal to provide medical advice, harmful content | ✅ Implemented | High |
| R4 | **Anonymization** | K-anonymity, data aggregation for analytics | ✅ Implemented | High |
| R13 | **Automated backups** | Daily encrypted backups with 30-day retention | ✅ Implemented | High |
| R13 | **Disaster recovery** | Recovery procedures tested quarterly | ⏳ Documented | High |
| R8 | **Data localization option** | EU data residency option | ⏳ Planned Q2 | High |

### 6.2 Organizational Measures

| Risk(s) | Measure | Description | Status | Effectiveness |
|---------|---------|-------------|--------|---------------|
| R2, R11 | **Security policy** | Information Security Policy documented | ✅ Implemented | Medium |
| R2 | **Incident response plan** | Breach response procedures documented | ✅ Implemented | High |
| R5, R6 | **Privacy by design** | Privacy review in development process | ✅ Implemented | High |
| R5 | **Data minimization policy** | Only necessary data collected | ✅ Implemented | High |
| R6 | **Purpose limitation controls** | Processing registry, change approval | ✅ Implemented | High |
| R9 | **Vendor assessment** | Security questionnaires for all processors | ✅ Completed | Medium |
| R9 | **Data Processing Agreements** | DPAs signed with all processors | ⏳ In progress | High |
| R8 | **Transfer Impact Assessments** | TIAs for all international transfers | ⏳ In progress | Medium |
| R11 | **Access control policy** | Least privilege, role-based access | ✅ Implemented | High |
| R11 | **Employee training** | Privacy and security awareness | ⏳ Planned | Medium |
| R12 | **Compliance monitoring** | Regular compliance audits | ✅ Scheduled | High |
| R10 | **Clinical consultation** | Mental health professional advisory | ✅ Ongoing | Medium |

### 6.3 User-Facing Measures

| Risk(s) | Measure | Description | Status | Effectiveness |
|---------|---------|-------------|--------|---------------|
| R3 | **Clear disclaimers** | "Not a therapist" messaging throughout | ✅ Implemented | Medium |
| R3, R15 | **Crisis resources** | 988 and crisis hotlines prominently displayed | ✅ Implemented | High |
| R14 | **Granular consent** | Separate consent for different processing | ✅ Implemented | High |
| R14 | **Consent withdrawal** | Easy opt-out in settings | ✅ Implemented | High |
| R7 | **Data export** | Self-service JSON export | ✅ Implemented | High |
| R7 | **Account deletion** | Self-service full deletion | ✅ Implemented | High |
| R7 | **Message deletion** | Delete individual messages or all history | ✅ Implemented | High |
| R10 | **Usage guidance** | Encouragement to seek human support | ✅ Implemented | Medium |
| R10 | **Session limits** | Encourage breaks, prevent over-dependence | ⏳ Planned | Medium |

### 6.4 Contractual Measures

| Risk(s) | Measure | Description | Status |
|---------|---------|-------------|--------|
| R9 | **DPA with Supabase** | Art. 28 compliant processing agreement | ☐ Signed / ☐ Pending |
| R9 | **DPA with Anthropic** | Includes no-training clause | ☐ Signed / ☐ Pending |
| R9 | **DPA with Vercel** | Art. 28 compliant processing agreement | ☐ Signed / ☐ Pending |
| R9 | **DPA with Stripe** | Art. 28 compliant processing agreement | ☐ Signed / ☐ Pending |
| R9 | **DPA with Clerk** | Art. 28 compliant processing agreement | ☐ Signed / ☐ Pending |
| R8 | **SCCs with all US processors** | EU Commission approved clauses | ☐ Signed / ☐ Pending |
| R3 | **Anthropic acceptable use terms** | Restricts harmful use cases | ✅ Accepted |

---

## 7. Residual Risk Assessment

### 7.1 Post-Mitigation Risk Levels

| ID | Risk | Inherent Risk | Key Mitigations | Residual Risk | Change |
|----|------|---------------|-----------------|---------------|--------|
| R1 | Unauthorized access | HIGH | Encryption, RLS, auth, audit | **LOW** | ⬇️⬇️ |
| R2 | Data breach | HIGH | Encryption, monitoring, IR plan, pen testing | **MEDIUM** | ⬇️ |
| R3 | Harmful AI advice | HIGH | Crisis detection, disclaimers, content filtering | **MEDIUM** | ⬇️ |
| R4 | Re-identification | MEDIUM | Strong anonymization | **LOW** | ⬇️ |
| R5 | Excessive collection | MEDIUM | Minimization policy, PbD | **LOW** | ⬇️ |
| R6 | Purpose creep | MEDIUM | Purpose limitation, governance | **LOW** | ⬇️ |
| R7 | Rights blocked | LOW | Self-service tools | **LOW** | — |
| R8 | Unlawful transfers | HIGH | SCCs, encryption, TIA | **MEDIUM** | ⬇️ |
| R9 | Processor non-compliance | MEDIUM | DPAs, assessments | **LOW** | ⬇️ |
| R10 | User distress | MEDIUM | Resources, limits, guidance | **LOW** | ⬇️ |
| R11 | Insider threat | MEDIUM | Access controls, audit, policy | **LOW** | ⬇️ |
| R12 | Regulatory enforcement | HIGH | Comprehensive compliance program | **LOW** | ⬇️⬇️ |
| R13 | Data loss | LOW | Backups, DR plan | **LOW** | — |
| R14 | Inadequate consent | MEDIUM | Clear consent, granular options | **LOW** | ⬇️ |
| R15 | Crisis response failure | HIGH | Detection, resources, testing | **MEDIUM** | ⬇️ |

### 7.2 Residual Risk Acceptability

| Residual Level | Count | Acceptable? | Notes |
|----------------|-------|-------------|-------|
| LOW | 11 | ✅ Yes | Risks managed to acceptable level |
| MEDIUM | 4 | ✅ Yes (with monitoring) | R2, R3, R8, R15 require ongoing vigilance |
| HIGH | 0 | N/A | No remaining high risks |
| CRITICAL | 0 | N/A | No critical risks |

### 7.3 Risks Requiring Ongoing Monitoring

| Risk | Residual Level | Monitoring Approach |
|------|----------------|---------------------|
| R2 - Data breach | MEDIUM | Security monitoring, pen testing, incident tracking |
| R3 - Harmful AI | MEDIUM | Response quality review, user feedback, clinical oversight |
| R8 - Transfer risk | MEDIUM | Regulatory monitoring, annual TIA review |
| R15 - Crisis response | MEDIUM | Crisis detection accuracy tracking, resource availability |

---

## 8. Data Subject Rights

### 8.1 Rights Implementation Summary

| Right (GDPR Article) | Implementation | Self-Service? | Response Time |
|---------------------|----------------|---------------|---------------|
| **Right to be informed (Art. 13-14)** | Privacy policy, consent flows, in-app notices | N/A | At collection |
| **Right of access (Art. 15)** | Data export feature | ✅ Yes | Immediate (automated) |
| **Right to rectification (Art. 16)** | Edit profile, memories, messages | ✅ Yes | Immediate |
| **Right to erasure (Art. 17)** | Account deletion, message deletion | ✅ Yes | 30 days (soft delete) |
| **Right to restrict (Art. 18)** | Pause account feature | ✅ Yes | Immediate |
| **Right to portability (Art. 20)** | JSON export of all user data | ✅ Yes | Immediate (automated) |
| **Right to object (Art. 21)** | Opt-out of optional processing, consent withdrawal | ✅ Yes | Immediate |
| **Rights re: automated decisions (Art. 22)** | Human resources always available, AI disclaimer | ✅ Yes | N/A |

### 8.2 Vulnerable User Considerations

| Consideration | Implementation |
|---------------|----------------|
| Clear, simple language | Plain language in all user communications |
| Easy-to-use controls | Prominent buttons, minimal steps |
| Support availability | Email support for assistance with rights |
| Accessible design | WCAG 2.1 AA compliance for privacy controls |
| Time limits | No unreasonable time pressure on consent |

---

## 9. DPIA Sign-Off

### 9.1 DPO Consultation

| Item | Response |
|------|----------|
| DPO consulted? | ☐ Yes / ☐ No / ☐ No DPO appointed |
| DPO name | [Name] |
| Consultation date | [Date] |
| DPO opinion | [Proceed / Proceed with conditions / Do not proceed] |

**DPO comments:**
> [DPO's assessment and any recommendations]

### 9.2 Prior Consultation with Supervisory Authority

Based on this assessment:

- ☐ **Prior consultation required** (Art. 36) - Residual high risks cannot be mitigated
- ☑ **Prior consultation NOT required** - All risks mitigated to acceptable levels

**Justification:**
All identified risks have been mitigated to LOW or MEDIUM residual risk levels. The four MEDIUM residual risks (R2, R3, R8, R15) are being actively managed through ongoing monitoring and additional planned measures. No processing activities result in residual HIGH risk to data subjects that cannot be mitigated.

### 9.3 Conclusion

This DPIA has:
1. ✅ Systematically described the processing of personal data by VERA
2. ✅ Assessed the necessity and proportionality of processing
3. ✅ Identified 15 risks to data subjects' rights and freedoms
4. ✅ Defined mitigation measures for all identified risks
5. ✅ Reduced all risks to acceptable residual levels

**Recommendation:** Processing may proceed with implemented safeguards.

### 9.4 Approval Signatures

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Data Controller Representative | | | |
| Data Protection Officer | | | |
| Technical Lead | | | |
| Legal Advisor | | | |

---

## 10. Review and Maintenance

### 10.1 Review Schedule

This DPIA shall be reviewed:
- **Annually** on or before [Date + 1 year]
- **Upon significant change** to processing activities
- **Following any data breach** or security incident
- **Upon regulatory guidance changes** affecting the assessment
- **Upon changes to third-party processors**

### 10.2 Change Triggers

Changes requiring DPIA update:

| Change Type | Example | Action Required |
|-------------|---------|-----------------|
| New data category | Collecting voice recordings | Full section 2-6 review |
| New purpose | Research use of data | Full section 4-6 review |
| New processor | Adding new AI provider | Update sections 2.7, 6.4 |
| New geography | Expanding to new country | Update section 2.8, TIA |
| New technology | Adding biometric auth | Full sections 5-6 review |
| Security incident | Breach or vulnerability | Section 5-6 review |
| Regulatory change | New SCCs, adequacy decision | Section 2.8, 5 review |

### 10.3 Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | [Date] | [Author] | Initial draft |
| 1.0 | January 25, 2026 | [Author] | First approved version |

---

## Appendix A: Consent Language

### A.1 Main Processing Consent

> **I consent to VERA processing my conversation data**
>
> By clicking "I consent," you agree that:
> - Your messages will be processed by AI to provide supportive responses
> - Your conversation history will be stored to maintain continuity
> - This data may contain sensitive information about your mental health
>
> You can withdraw consent anytime in Settings. Withdrawing consent will delete your conversation history.
>
> [I consent] [Learn more]

### A.2 Memory Consent

> **Enable Memories**
>
> Memories help VERA provide more personalized support by remembering context you choose to share.
>
> - You control what memories are stored
> - You can view, edit, or delete memories anytime
> - Memories are used only to personalize your experience
>
> [Enable Memories] [Not now]

---

## Appendix B: Data Subject Rights Procedures

### B.1 Access Request Procedure

1. User accesses Settings > Privacy > Export Data
2. System generates JSON export of all user data
3. Export available for immediate download
4. Audit log records export event
5. For manual requests: support@vera.ai, respond within 30 days

### B.2 Erasure Request Procedure

1. User accesses Settings > Account > Delete Account
2. User confirms deletion intent
3. Account enters 30-day soft-delete state
4. User can cancel deletion within 30 days
5. After 30 days, hard delete executed
6. Backup retention continues for 30 additional days
7. Complete erasure within 60 days total

---

## Appendix C: Processor Agreements Summary

| Processor | DPA Date | Key Terms | Audit Rights | Sub-processors |
|-----------|----------|-----------|--------------|----------------|
| Supabase | [Date] | Art. 28 compliant, encryption, SCCs | Annual questionnaire | AWS |
| Anthropic | [Date] | Zero retention, no training, SCCs | On request | [List] |
| Vercel | [Date] | Art. 28 compliant, SCCs | Annual questionnaire | AWS |
| Stripe | [Date] | PCI-DSS, Art. 28 compliant, SCCs | SOC 2 report | [List] |
| Clerk | [Date] | Art. 28 compliant, SCCs | Annual questionnaire | [List] |

---

## Appendix D: Transfer Impact Assessment Summary

### D.1 US Transfer Risk Assessment

| Factor | Assessment |
|--------|------------|
| **Applicable US laws** | FISA 702, EO 12333, CLOUD Act |
| **Likelihood of access requests** | Low (not telecom, not high-value target) |
| **Type of data** | Health data (sensitive) |
| **Volume** | [Current user count] |
| **Technical measures** | Encryption at rest (AES-256), in transit (TLS 1.3) |
| **Contractual measures** | SCCs, processor DPAs with notification obligations |
| **Overall risk level** | Medium - Acceptable with safeguards |

### D.2 Supplementary Measures

1. End-to-end encryption of stored data
2. Pseudonymization where possible
3. Contractual notification obligations in DPAs
4. EU data residency option (planned)
5. Regular review of US surveillance law developments

---

*This document is confidential and should be protected accordingly.*
