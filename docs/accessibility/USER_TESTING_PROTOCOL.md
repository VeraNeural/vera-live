# VERA Accessibility User Testing Protocol

> **Document ID:** A11Y-UTP-001  
> **Version:** 1.0  
> **Last Updated:** January 25, 2026  
> **Classification:** Internal  

---

## 1. Overview

### 1.1 Purpose

This protocol establishes procedures for conducting accessibility user testing with participants who have disabilities. The goal is to validate VERA's accessibility through real-world usage by people who rely on assistive technologies.

### 1.2 Why User Testing Matters

Automated accessibility testing (like axe-core) catches approximately 30-40% of accessibility issues. The remaining 60-70% require human evaluation, including:

- Screen reader compatibility nuances
- Cognitive accessibility
- Navigation logic and flow
- Real-world assistive technology usage
- Actual user experience with disabilities

### 1.3 Testing Goals

| Goal | Description |
|------|-------------|
| Screen reader compatibility | Verify content is properly announced and navigable |
| Keyboard navigation | Validate all features work without a mouse |
| Motor impairment support | Test with alternative input devices |
| Cognitive accessibility | Assess clarity, predictability, and cognitive load |
| Barrier identification | Discover issues not caught by automated testing |
| User experience validation | Ensure dignified, independent usage |

### 1.4 VERA-Specific Considerations

VERA serves users seeking mental health support. Accessibility is especially critical because:

- Users may be in vulnerable emotional states
- Barriers cause frustration that compounds distress
- Independence is important for privacy and dignity
- Crisis resources must be accessible to everyone
- Voice features provide alternatives for various disabilities

---

## 2. Participant Recruitment

### 2.1 Target Participant Groups

| Group | Description | Target # | Primary Assistive Tech |
|-------|-------------|----------|------------------------|
| **Blind** | Complete vision loss | 2-3 | JAWS, NVDA, VoiceOver |
| **Low Vision** | Partial vision, magnification | 2-3 | ZoomText, screen magnifiers |
| **Motor Impairment** | Limited fine motor control | 2-3 | Keyboard only, switch devices, voice control |
| **Cognitive/Learning** | ADHD, dyslexia, cognitive disabilities | 2-3 | Screen readers, text customization |
| **Deaf/Hard of Hearing** | Hearing impairment | 2-3 | Visual-only interaction, captions |
| **Neurotypical Control** | No disabilities | 2-3 | Standard mouse/keyboard |

**Total target: 12-18 participants**

### 2.2 Recruitment Sources

| Source | Notes |
|--------|-------|
| Disability advocacy organizations | NFB, AFB, AAPD, etc. |
| University disability services | College students with disabilities |
| User testing platforms | UserTesting, Fable, AccessWorks |
| Accessibility consultant networks | Professional testers |
| Social media disability communities | With appropriate outreach |

### 2.3 Screening Questions

1. What disability or disabilities do you have?
2. What assistive technology do you use regularly?
3. How experienced are you with your assistive technology? (Beginner/Intermediate/Advanced)
4. What devices do you typically use for web browsing?
5. Have you used AI chatbots or mental health apps before?
6. Are you comfortable discussing the topic of mental health during testing?
7. Do you have any specific accommodations you need for the testing session?

### 2.4 Inclusion Criteria

- Age 18+
- Regular use of assistive technology (for AT groups)
- Comfortable with English
- Willing to think aloud during testing
- Able to commit to 90-minute session

### 2.5 Exclusion Criteria

- Currently in active mental health crisis
- Unable to provide informed consent
- Conflict of interest (VERA employees, investors)

---

## 3. Ethical Considerations

### 3.1 Informed Consent

All participants must:
- Receive a clear explanation of testing purpose
- Understand what will be recorded
- Know they can stop at any time
- Sign written consent form
- Receive copy of consent form

### 3.2 Consent Form Elements

- Purpose of the study
- What participation involves
- Recording permissions (screen, audio, video)
- Data usage and retention
- Compensation details
- Confidentiality protections
- Right to withdraw
- Contact information for questions

### 3.3 Compensation

| Session Type | Recommended Compensation |
|--------------|-------------------------|
| 90-minute session | $100-150 |
| Follow-up interview | $50-75 |
| Remote asynchronous | $75-100 |

**Payment should be:**
- Provided regardless of task completion
- Paid promptly (within 2 weeks)
- In accessible format (Venmo, PayPal, check, gift card options)

### 3.4 Participant Wellbeing

| Consideration | Protocol |
|---------------|----------|
| Breaks | Offer breaks every 20-30 minutes |
| Fatigue | Watch for signs, end early if needed |
| Frustration | Remind this tests the app, not them |
| Emotional content | VERA discusses mental health; check in on comfort |
| Pressure | Never pressure to complete tasks |
| Privacy | Allow private space for sessions |

### 3.5 Accessibility of the Testing Process

Ensure the testing session itself is accessible:
- Consent forms in accessible formats
- Video call platforms with accessibility features
- Interpreter services if needed
- Flexible scheduling
- Multiple communication options

---

## 4. Testing Environment Setup

### 4.1 Remote Testing (Preferred)

**Advantages:**
- Participant uses their own, familiar equipment
- More natural assistive technology usage
- No travel barriers
- Broader geographic reach

**Requirements:**
- Video conferencing with screen sharing (Zoom, Teams)
- Participant's own device and assistive technology
- Stable internet connection
- Quiet environment

**Recording Setup:**
- Screen share recording (Zoom)
- Audio recording for think-aloud
- Participant consent for all recordings

### 4.2 In-Person Testing

**Equipment to have available:**
- Windows laptop with NVDA and JAWS installed
- MacBook with VoiceOver
- iPad with VoiceOver
- Android tablet with TalkBack
- External keyboard (for keyboard-only testing)
- Various mice (trackball, vertical, large buttons)
- Switch device (if available)
- Refreshable Braille display (if available)

**Physical space:**
- Quiet, private room
- Adjustable lighting
- Accessible entrance and restroom
- Adjustable desk/table height

### 4.3 Test Accounts

Prepare before each session:

| Account | Configuration |
|---------|---------------|
| New user account | Fresh, no history |
| Existing user account | Seeded with 3-4 previous conversations |
| Paid tier account | For subscription feature testing |
| Account at message limit | For limit/upgrade flow testing |

**Test data should:**
- Contain realistic but non-sensitive conversations
- Have various conversation lengths
- Include example memories (if feature tested)
- NOT contain real user data

### 4.4 Facilitator Preparation

Before each session:
- [ ] Review participant's assistive technology
- [ ] Test VERA with that assistive technology yourself
- [ ] Prepare test accounts
- [ ] Test screen sharing and recording
- [ ] Review task scripts
- [ ] Have backup plans for technical issues
- [ ] Confirm technical support availability

---

## 5. Session Structure

### 5.1 Session Timeline (90 minutes)

| Time | Duration | Activity |
|------|----------|----------|
| 0:00 | 10 min | Introduction and consent |
| 0:10 | 10 min | Background questions |
| 0:20 | 50 min | Task-based testing |
| 1:10 | 10 min | Open exploration |
| 1:20 | 10 min | Post-test questionnaire and debrief |

### 5.2 Introduction Script

> "Thank you so much for participating in this accessibility evaluation of VERA. VERA is an AI mental health support application designed to provide compassionate conversation and support.
>
> Today, I'll ask you to complete some tasks using the application while thinking aloud—telling me what you're doing, what you're thinking, and what you're experiencing. This helps us understand how the application works with your assistive technology.
>
> A few important things to keep in mind:
>
> - **We're testing the application, not you.** If something is difficult or confusing, that's valuable feedback about the app.
> - **There are no wrong answers.** We want your honest experience.
> - **You can take breaks anytime.** Just let me know.
> - **You can skip any task.** If something isn't working or you're uncomfortable, we'll move on.
> - **Your feedback is incredibly valuable.** It helps us make VERA work better for everyone.
>
> I'll be recording our screen share and audio so I can review our session later. Is that still okay with you?
>
> Do you have any questions before we begin?"

### 5.3 Think-Aloud Protocol

Explain to participants:

> "As you use the application, please think aloud—tell me what you're looking for, what you expect to happen, what you're hearing from your screen reader, and any reactions you have.
>
> For example, you might say things like:
> - 'I'm looking for the send button...'
> - 'My screen reader just said [something]—I'm not sure what that means.'
> - 'I expected this to happen, but something else happened.'
> - 'This is confusing because...'
>
> I may remind you to keep thinking aloud if you get quiet, but that's just to make sure I'm capturing your experience."

### 5.4 Facilitator Techniques

**Do:**
- Use neutral prompts: "What are you thinking?" "What happened?"
- Allow silence and struggle (within reason)
- Take detailed notes
- Note exact screen reader announcements
- Record timestamps for important moments
- Ask follow-up questions after task completion

**Don't:**
- Lead the participant: "Did you try the button at the top?"
- Express judgment: "That was wrong" or "Good job"
- Take over: Let them struggle productively
- Rush: Allow time for assistive technology navigation
- Assume: Ask clarifying questions

### 5.5 Background Questions

Ask at session start:

1. "What assistive technology are you using today?"
2. "How long have you been using [assistive technology]?"
3. "How would you rate your experience level? Beginner, intermediate, or advanced?"
4. "What devices do you typically use for web browsing?"
5. "Have you used AI chatbots before? Which ones?"
6. "Have you used any mental health or wellness apps before?"
7. "What accessibility challenges do you commonly encounter on websites?"

---

## 6. Data Collection

### 6.1 What to Capture

| Data Type | How to Capture | Notes |
|-----------|----------------|-------|
| Task success/failure | Observer notes | Binary + partial success |
| Task completion time | Stopwatch/timestamps | From task start to completion |
| Error count | Observer notes | Wrong paths, dead ends |
| Screen reader output | Audio recording | Exact announcements |
| Participant verbalization | Audio recording | Think-aloud content |
| Observed behaviors | Observer notes | Confusion, hesitation, recovery |
| Participant quotes | Audio + notes | Verbatim when possible |
| Assistive tech issues | Observer notes | Specific to AT used |

### 6.2 Note-Taking Template

```
Session: [P#] | Date: [Date] | AT: [Technology] | Facilitator: [Name]

TASK [#]: [Task Name]
Start time: [HH:MM]
End time: [HH:MM]

Success: [ ] Complete  [ ] Partial  [ ] Failed

Observations:
-
-
-

Screen reader announcements (notable):
-
-

Participant quotes:
-
-

Issues identified:
-
-

Severity: [ ] Critical  [ ] Major  [ ] Minor
```

### 6.3 Session Recording

- Record screen share showing participant's screen
- Record audio (think-aloud and facilitator)
- Video of participant optional (can help see AT usage)
- Store recordings securely
- Retain for 1 year, then delete
- Transcribe key sections for report

---

## 7. Post-Session

### 7.1 Immediate Debrief (with participant)

> "Thank you so much for your time and feedback. Before we wrap up:
>
> - Is there anything else about the experience you'd like to share?
> - Any specific suggestions you have?
> - How would you rate the overall accessibility of VERA compared to other apps you use?"

### 7.2 Facilitator Self-Debrief

Complete within 24 hours:
- Review notes while session is fresh
- Identify key issues and themes
- Note any technical problems during session
- Capture initial severity assessments
- Note questions for follow-up

### 7.3 Participant Follow-Up

- Send thank-you email within 24 hours
- Process compensation promptly
- Offer to share final report (if appropriate)
- Ask if they'd participate in future testing

---

## 8. Analysis and Reporting

### 8.1 Issue Tracking

Log all issues in a consistent format:
- Issue title
- Description
- Affected user groups
- Assistive technology affected
- WCAG success criterion (if applicable)
- Severity rating
- Participant quotes
- Recommended fix
- Screenshots/recordings

### 8.2 Severity Ratings

| Severity | Definition | Example |
|----------|------------|---------|
| **Critical** | Prevents task completion for affected users | Screen reader cannot access chat input |
| **Major** | Significant difficulty, workarounds exist | Navigation order confusing, takes many extra steps |
| **Minor** | Inconvenience, minimal impact | Slightly verbose screen reader announcements |

### 8.3 Reporting

See [FINDINGS_TEMPLATE.md](FINDINGS_TEMPLATE.md) for report structure.

---

## 9. Iteration and Retesting

### 9.1 Fix Verification

After fixes implemented:
- Verify fix with internal testing
- Conduct targeted retest with 1-2 affected users
- Confirm issue resolved

### 9.2 Ongoing Testing Schedule

| Testing Type | Frequency | Participants |
|--------------|-----------|--------------|
| Major release testing | Before each major release | 6-8 participants |
| Feature testing | New features | 2-3 participants |
| Regression testing | Quarterly | 3-4 participants |
| Continuous | Ongoing | 1-2 per month |

---

## 10. Appendix

### A. Participant Consent Form Template

[See separate document]

### B. Resource Links

- W3C WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- WebAIM: https://webaim.org
- Deque University: https://dequeuniversity.com
- A11y Project: https://www.a11yproject.com

### C. Assistive Technology Resources

- NVDA Download: https://www.nvaccess.org
- Apple Accessibility: https://www.apple.com/accessibility/
- Google Accessibility: https://www.google.com/accessibility/

---

*This protocol should be reviewed and updated annually or when significant changes are made to VERA's interface.*
