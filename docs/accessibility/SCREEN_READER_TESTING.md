# VERA Screen Reader Testing Script

> **Document ID:** A11Y-SR-001  
> **Version:** 1.0  
> **Last Updated:** January 25, 2026  
> **Purpose:** Internal QA screen reader testing guide  

---

## 1. Screen Reader Setup

### 1.1 NVDA (Windows) — Free

**Download:** https://www.nvaccess.org/download/

**Basic Commands:**
| Action | Shortcut |
|--------|----------|
| Start/Stop NVDA | Ctrl + Alt + N |
| Stop speaking | Ctrl |
| Read from cursor | NVDA + Down Arrow |
| Read current line | NVDA + Up Arrow |
| Read current word | NVDA + Numpad 5 |
| Next item | Tab or Down Arrow |
| Previous item | Shift + Tab or Up Arrow |
| Activate item | Enter or Space |
| Next heading | H |
| Next link | K |
| Next button | B |
| Next form field | F |
| Next landmark | D |
| List all headings | NVDA + F7 |
| Forms mode toggle | NVDA + Space |
| Browse mode | Esc |

**NVDA Key:** Insert (desktop) or Caps Lock (laptop mode)

**Settings for Testing:**
- Speech rate: Set comfortable speed
- Punctuation: "Some" for testing
- Screen layout: Enabled (to follow visual layout)

---

### 1.2 VoiceOver (macOS) — Built-in

**Enable:** System Preferences > Accessibility > VoiceOver, or Cmd + F5

**Basic Commands:**
| Action | Shortcut |
|--------|----------|
| Start/Stop VoiceOver | Cmd + F5 |
| Stop speaking | Ctrl |
| Read from cursor | VO + A |
| Next item | VO + Right Arrow |
| Previous item | VO + Left Arrow |
| Activate item | VO + Space |
| Rotor (navigation menu) | VO + U |
| Next heading | VO + Cmd + H |
| Next link | VO + Cmd + L |
| Interact with element | VO + Shift + Down Arrow |
| Stop interacting | VO + Shift + Up Arrow |

**VO Key:** Ctrl + Option (by default)

**Settings for Testing:**
- Verbosity: High (for testing)
- Web spots: Enabled
- DOM navigation: Enabled

---

### 1.3 VoiceOver (iOS) — Built-in

**Enable:** Settings > Accessibility > VoiceOver

**Basic Gestures:**
| Action | Gesture |
|--------|---------|
| Read item | Tap once |
| Activate item | Double tap |
| Next item | Swipe right |
| Previous item | Swipe left |
| Scroll | Three-finger swipe |
| Go to top | Two-finger swipe up |
| Rotor | Two-finger rotate |
| Pause speaking | Two-finger tap |
| Read from top | Two-finger swipe up (hold) |

**Rotor Options:** Rotate two fingers to switch between headings, links, form controls, etc.

---

### 1.4 TalkBack (Android) — Built-in

**Enable:** Settings > Accessibility > TalkBack

**Basic Gestures:**
| Action | Gesture |
|--------|---------|
| Read item | Tap |
| Activate item | Double tap |
| Next item | Swipe right |
| Previous item | Swipe left |
| Scroll | Two-finger swipe |
| Back | Swipe down then left |
| Local context menu | Swipe up then right |
| Global context menu | Swipe down then right |

---

## 2. Pre-Testing Checklist

Before starting screen reader testing:

- [ ] Screen reader installed and configured
- [ ] Browser up to date (Chrome, Firefox, or Safari recommended)
- [ ] VERA test environment accessible
- [ ] Test account credentials ready
- [ ] Audio working (speakers or headphones)
- [ ] Notes document ready
- [ ] Know how to restart screen reader if it crashes

---

## 3. Testing Checklist by Page/Feature

### 3.1 Homepage

**Page Load:**
- [ ] Page title announced (should include "VERA")
- [ ] Skip link available ("Skip to main content" or similar)
- [ ] Skip link works (focus moves to main content)
- [ ] Main landmark identified

**Navigation:**
- [ ] All nav links announced with text
- [ ] Current page indicated (if on homepage)
- [ ] Logo link works and is labeled

**Content:**
- [ ] Headings in logical order (H1, then H2s, etc.)
- [ ] Main heading describes the page
- [ ] All images have alt text
- [ ] Decorative images hidden from screen reader
- [ ] Links have meaningful text (not "click here")

**Call to Action:**
- [ ] Sign up / Get started button announced clearly
- [ ] Login link findable

**Crisis Resources (if on homepage):**
- [ ] Crisis information announced
- [ ] 988 number is a link and announced as phone number
- [ ] Can activate crisis links

---

### 3.2 Authentication (Sign Up / Login)

**Form Discovery:**
- [ ] Form announced when entering
- [ ] Form purpose clear

**Form Fields:**
- [ ] Each input has a label announced
- [ ] Required fields indicated ("required" announced)
- [ ] Password field identified as password type
- [ ] Show/hide password button accessible (if exists)

**Validation:**
- [ ] Empty submission triggers error
- [ ] Error message announced
- [ ] Error associated with specific field
- [ ] Focus moves to error or first invalid field
- [ ] Can correct and resubmit

**Success:**
- [ ] Successful login/signup announced or page change clear
- [ ] Focus managed appropriately after auth

---

### 3.3 Chat Interface

**Chat Input:**
- [ ] Input field has label (e.g., "Message VERA")
- [ ] Placeholder text announced (if present)
- [ ] Can type in input
- [ ] Character count announced (if present)

**Send Message:**
- [ ] Send button is labeled
- [ ] Can activate with Enter key
- [ ] Can activate button with Space/Enter

**Message Sent:**
- [ ] Feedback that message was sent
- [ ] User message appears and is readable
- [ ] Can navigate to user message

**VERA Response:**
- [ ] Loading/typing indicator announced (or not intrusive)
- [ ] New message announced (ARIA live region)
- [ ] VERA message content readable
- [ ] Can navigate through message text
- [ ] Any links in message accessible

**Conversation Navigation:**
- [ ] Can navigate between messages
- [ ] User vs. VERA messages distinguishable
- [ ] Timestamps announced (if present)
- [ ] No message content skipped

**New Conversation:**
- [ ] New conversation button accessible
- [ ] Clear feedback when new conversation starts

---

### 3.4 Conversation History/Sidebar

**Sidebar Navigation:**
- [ ] Sidebar announced as navigation region
- [ ] Can open/toggle sidebar
- [ ] Conversation list items announced

**Conversation Items:**
- [ ] Conversation title/preview readable
- [ ] Date/time announced
- [ ] Can select conversation
- [ ] Current conversation indicated

**Actions:**
- [ ] Delete/edit buttons labeled (if present)
- [ ] Confirmation dialogs accessible

---

### 3.5 Settings

**Navigation:**
- [ ] Settings page/section findable
- [ ] Heading structure logical

**Toggle Controls:**
- [ ] Toggle switches have labels
- [ ] State announced (on/off, checked/unchecked)
- [ ] Can change state
- [ ] State change confirmed

**Dropdowns/Selects:**
- [ ] Select has label
- [ ] Options announced
- [ ] Selected option announced
- [ ] Can change selection

**Save/Apply:**
- [ ] Save button labeled (if present)
- [ ] Confirmation of save announced

---

### 3.6 Modals & Dialogs

**Opening:**
- [ ] Modal announced when opening (role="dialog")
- [ ] Focus moves into modal
- [ ] Modal title announced

**Content:**
- [ ] All modal content accessible
- [ ] Focus stays within modal (focus trap)
- [ ] Can navigate modal content

**Closing:**
- [ ] Close button accessible and labeled
- [ ] Escape key closes modal
- [ ] Focus returns to trigger element

---

### 3.7 Toasts & Notifications

- [ ] Toast/notification announced when appearing
- [ ] Content readable
- [ ] Does not auto-dismiss too quickly (4+ seconds)
- [ ] Dismiss button accessible (if present)
- [ ] Does not steal focus unexpectedly

---

### 3.8 Error States

**Form Errors:**
- [ ] Error announced
- [ ] Error text readable
- [ ] Associated with relevant field
- [ ] Clear how to fix

**Page/Network Errors:**
- [ ] Error state announced
- [ ] Error message readable
- [ ] Recovery action accessible (retry, etc.)

---

### 3.9 Loading States

- [ ] Loading indicator announced (if appropriate)
- [ ] Not overly verbose (avoid "loading loading loading")
- [ ] Completion announced or content becomes available
- [ ] Focus managed after load

---

## 4. Common Issues Checklist

### 4.1 Must Not Have

- [ ] No empty buttons (button with no text or label)
- [ ] No empty links (link with no text or label)
- [ ] No unlabeled form inputs
- [ ] No images without alt text (unless decorative and hidden)
- [ ] No focus traps (can't escape an area)
- [ ] No auto-playing audio without pause
- [ ] No unexpected focus movement
- [ ] No keyboard-only inaccessible features

### 4.2 Should Have

- [ ] Skip link on every page
- [ ] Proper heading hierarchy (H1 > H2 > H3)
- [ ] Landmarks for main regions (nav, main, footer)
- [ ] Focus visible on all interactive elements
- [ ] Consistent navigation across pages
- [ ] Clear link text (describes destination)
- [ ] Proper table structure (if tables used)

### 4.3 Common Announcement Problems

| Issue | Problem | Solution |
|-------|---------|----------|
| "Clickable" only | No actual label | Add aria-label or visible text |
| "Button button" | Redundant | Remove extra role or text |
| "Image" only | Missing alt text | Add descriptive alt |
| "Link link" | Redundant | Fix markup |
| "Edit text" only | No label | Add label or aria-label |
| Entire page read | Missing landmarks | Add main, nav landmarks |

---

## 5. VERA-Specific Testing Points

### 5.1 Chat Accessibility

| Test | Expected Behavior |
|------|-------------------|
| Send message | Confirmation message sent |
| Receive response | New message announced via live region |
| Streaming response | Either silent or single announcement when complete |
| Focus after send | Stays in input for next message |
| Navigate messages | Can move through with arrow keys |

### 5.2 Crisis Resources

| Test | Expected Behavior |
|------|-------------------|
| 988 link | Announced as phone link, activatable |
| Crisis banner | Content readable, not hidden |
| Footer crisis info | Accessible on every page |

### 5.3 Sanctuary/Premium Features

| Test | Expected Behavior |
|------|-------------------|
| Upgrade prompts | Accessible and dismissible |
| Feature gates | Clear what's restricted and why |
| Payment flow | Stripe elements accessible |

---

## 6. Issue Reporting Template

When logging screen reader issues:

```markdown
## Screen Reader Issue: [Brief Title]

**Screen Reader:** [NVDA 2024.1 / VoiceOver macOS 14 / etc.]
**Browser:** [Chrome 120 / Firefox 121 / Safari 17]
**Page/Feature:** [e.g., Chat interface, Login form]

**Steps to Reproduce:**
1. Navigate to [page]
2. [Action]
3. [Action]

**Expected Announcement:**
[What should be announced]

**Actual Announcement:**
[What is actually announced - use quotes]

**Impact:**
- [ ] Cannot complete task
- [ ] Confusing/extra steps required
- [ ] Minor annoyance

**Suggested Fix:**
[If known]

**WCAG Reference:**
[e.g., 4.1.2 Name, Role, Value]
```

---

## 7. Quick Reference Card

### NVDA Essentials

| Task | Keys |
|------|------|
| Stop speech | Ctrl |
| Next element | Tab / Down |
| Next heading | H |
| Next link | K |
| Next form | F |
| Click/activate | Enter |
| List elements | NVDA + F7 |
| Forms mode | Enter on input |
| Browse mode | Esc |

### VoiceOver Mac Essentials

| Task | Keys |
|------|------|
| Stop speech | Ctrl |
| Next element | VO + Right |
| Activate | VO + Space |
| Rotor | VO + U |
| Web rotor | VO + U, then arrows |
| Interact | VO + Shift + Down |
| Stop interact | VO + Shift + Up |

### VO = Ctrl + Option

---

## 8. Resources

- **NVDA User Guide:** https://www.nvaccess.org/files/nvda/documentation/userGuide.html
- **VoiceOver Guide:** https://support.apple.com/guide/voiceover/welcome/mac
- **WebAIM Screen Reader Survey:** https://webaim.org/projects/screenreadersurvey9/
- **Deque aXe:** Browser extension for automated testing
- **WAVE:** Browser extension for visual accessibility evaluation

---

## 9. Testing Schedule

| Frequency | Testing Type | Scope |
|-----------|--------------|-------|
| Each PR | Quick smoke test | Changed components |
| Weekly | Full feature test | One major feature |
| Monthly | Full app test | All major flows |
| Quarterly | Multi-SR test | NVDA, VoiceOver, TalkBack |
| Release | Regression test | Critical paths |

---

*Keep this document updated as VERA features change. Last tested: [Date]*
