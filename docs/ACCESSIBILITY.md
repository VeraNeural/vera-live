# VERA Accessibility Statement

> **Standard**: WCAG 2.1 Level AA  
> **Last Audit**: 2026-01-25  
> **Version**: 1.0  

---

## 1. Commitment to Accessibility

VERA is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards.

**Target Standard**: Web Content Accessibility Guidelines (WCAG) 2.1 Level AA

---

## 2. Conformance Status

### Current Status: Partially Conformant

VERA is partially conformant with WCAG 2.1 Level AA. "Partially conformant" means that some parts of the content do not fully conform to the accessibility standard.

### Compliance Summary

| Category | Status | Notes |
|----------|--------|-------|
| **Perceivable** | ✅ Mostly Conformant | Alt text, semantic HTML, color contrast |
| **Operable** | ✅ Mostly Conformant | Keyboard navigation, skip links, focus management |
| **Understandable** | ✅ Conformant | Language set, consistent navigation |
| **Robust** | ⚠️ Partially Conformant | Some ARIA improvements needed |

---

## 3. Technical Implementation

### 3.1 Automated Testing

#### ESLint jsx-a11y Plugin

**ESLint jsx-a11y Plugin** configured with stricter rules:

```javascript
// eslint.config.mjs
{
  rules: {
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/anchor-has-content": "error",
    "jsx-a11y/anchor-is-valid": "error",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-proptypes": "error",
    "jsx-a11y/aria-role": "error",
    "jsx-a11y/heading-has-content": "error",
    "jsx-a11y/html-has-lang": "error",
    "jsx-a11y/label-has-associated-control": "error",
    "jsx-a11y/role-has-required-aria-props": "error",
    // ... and more
  }
}
```

#### vitest-axe Automated Testing

**Runtime accessibility testing** using vitest-axe with axe-core:

```bash
# Run accessibility tests
npm run test:a11y

# Run all tests (unit + a11y)
npm run test:all
```

**Test Coverage** (16 automated tests):
- Skip link accessibility
- Chat input labels and ARIA
- Navigation landmark roles
- ARIA live regions for chat
- Form accessibility (labels, errors, required fields)
- Modal accessibility
- Heading hierarchy
- Link and button accessibility
- Image alt text

**Usage in Tests**:

```typescript
// tests/a11y/components.test.ts
import { axe } from 'vitest-axe';
import { expect } from 'vitest';

it('should have no accessibility violations', async () => {
  const html = `<button aria-label="Send">...</button>`;
  const results = await axe(html);
  expect(results).toHaveNoViolations();
});
```

**Test Files**:
- `tests/a11y/components.test.ts` - Component accessibility tests
- `tests/utils/a11y.ts` - Accessibility test utilities
- `tests/vitest-setup.ts` - Vitest matchers setup
- `vitest.a11y.config.ts` - jsdom environment config for a11y tests

### 3.2 Implemented Accessibility Features

#### Perceivable

| Feature | Implementation |
|---------|----------------|
| **Text Alternatives** | All images have meaningful `alt` text |
| **Page Language** | `<html lang="en">` set in layout |
| **Semantic Structure** | `<main>`, `<header>`, `<footer>`, `<nav aria-label>`, `<article>` used appropriately |
| **Form Labels** | All inputs have associated `<label>` elements with `htmlFor`/`id` pairs |
| **Color Contrast** | Dark/light themes with sufficient contrast ratios |
| **Responsive Design** | Content adapts to viewport, no horizontal scroll at 320px |
| **Reduced Motion** | `prefers-reduced-motion` media query in globals.css |

#### Operable

| Feature | Implementation |
|---------|----------------|
| **Skip Link** | `<SkipLink>` component using `.sr-only-focusable` class |
| **Keyboard Navigation** | All interactive elements accessible via keyboard |
| **Focus Indicators** | `*:focus-visible` with 2px purple outline in globals.css |
| **No Keyboard Traps** | Tab navigation flows logically |
| **Touch Targets** | Minimum 44x44px for interactive elements |
| **High Contrast Support** | `prefers-contrast: more` media query |

#### Understandable

| Feature | Implementation |
|---------|----------------|
| **Page Titles** | Descriptive `<title>` via Next.js metadata |
| **Consistent Navigation** | Sidebar navigation consistent across pages |
| **Error Identification** | Form errors displayed with clear messages |
| **Input Labels** | All form inputs have visible labels or `aria-label` |

#### Robust

| Feature | Implementation |
|---------|----------------|
| **Valid HTML** | TypeScript ensures proper element usage |
| **ARIA Live Regions** | Chat messages container uses `aria-live="polite"` |
| **Status Announcements** | Typing indicator has `role="status"` |
| **Button Labels** | Icon buttons have `aria-label` attributes |

---

## 4. WCAG 2.1 AA Checklist

### Perceivable

| Criterion | Status | Notes |
|-----------|--------|-------|
| 1.1.1 Non-text Content | ✅ | Alt text on images |
| 1.2.1 Audio-only/Video-only | N/A | No prerecorded media |
| 1.2.2 Captions | N/A | No video content |
| 1.2.3 Audio Description | N/A | No video content |
| 1.2.4 Captions (Live) | N/A | No live audio |
| 1.2.5 Audio Description | N/A | No video content |
| 1.3.1 Info and Relationships | ✅ | Semantic HTML structure |
| 1.3.2 Meaningful Sequence | ✅ | Logical DOM order |
| 1.3.3 Sensory Characteristics | ✅ | Instructions don't rely on shape/color |
| 1.3.4 Orientation | ✅ | Works in portrait/landscape |
| 1.3.5 Identify Input Purpose | ⚠️ | Partial autocomplete support |
| 1.4.1 Use of Color | ✅ | Status not color-only |
| 1.4.2 Audio Control | N/A | No auto-playing audio |
| 1.4.3 Contrast (Minimum) | ✅ | 4.5:1 ratio maintained |
| 1.4.4 Resize Text | ✅ | 200% zoom supported |
| 1.4.5 Images of Text | ✅ | No images of text |
| 1.4.10 Reflow | ✅ | No horizontal scroll at 320px |
| 1.4.11 Non-text Contrast | ✅ | UI components meet 3:1 |
| 1.4.12 Text Spacing | ✅ | Custom spacing supported |
| 1.4.13 Content on Hover/Focus | ✅ | Tooltips dismissible |

### Operable

| Criterion | Status | Notes |
|-----------|--------|-------|
| 2.1.1 Keyboard | ✅ | All functionality via keyboard |
| 2.1.2 No Keyboard Trap | ✅ | No traps found |
| 2.1.4 Character Key Shortcuts | N/A | No single-key shortcuts |
| 2.2.1 Timing Adjustable | N/A | No time limits |
| 2.2.2 Pause, Stop, Hide | ✅ | Animations can be paused |
| 2.3.1 Three Flashes | ✅ | No flashing content |
| 2.4.1 Bypass Blocks | ✅ | Skip link implemented |
| 2.4.2 Page Titled | ✅ | Descriptive titles |
| 2.4.3 Focus Order | ✅ | Logical tab order |
| 2.4.4 Link Purpose | ✅ | Descriptive link text |
| 2.4.5 Multiple Ways | ✅ | Nav + sidebar + search |
| 2.4.6 Headings and Labels | ✅ | Descriptive headings |
| 2.4.7 Focus Visible | ✅ | Focus indicators visible |
| 2.5.1 Pointer Gestures | ✅ | Single-pointer alternatives |
| 2.5.2 Pointer Cancellation | ✅ | Actions on up event |
| 2.5.3 Label in Name | ✅ | Visible labels match accessible names |
| 2.5.4 Motion Actuation | N/A | No motion input |

### Understandable

| Criterion | Status | Notes |
|-----------|--------|-------|
| 3.1.1 Language of Page | ✅ | `lang="en"` set |
| 3.1.2 Language of Parts | ⚠️ | Multi-language not implemented |
| 3.2.1 On Focus | ✅ | No context change on focus |
| 3.2.2 On Input | ✅ | No unexpected changes |
| 3.2.3 Consistent Navigation | ✅ | Consistent sidebar |
| 3.2.4 Consistent Identification | ✅ | Consistent icons/buttons |
| 3.3.1 Error Identification | ✅ | Errors clearly described |
| 3.3.2 Labels or Instructions | ✅ | Form fields labeled |
| 3.3.3 Error Suggestion | ✅ | Correction suggestions provided |
| 3.3.4 Error Prevention | ⚠️ | Delete confirmation exists |

### Robust

| Criterion | Status | Notes |
|-----------|--------|-------|
| 4.1.1 Parsing | ✅ | Valid HTML via TypeScript |
| 4.1.2 Name, Role, Value | ⚠️ | Some ARIA improvements needed |
| 4.1.3 Status Messages | ✅ | `aria-live` on chat, typing indicator |

---

## 5. Chat Interface Accessibility

Special considerations for the conversational interface:

| Feature | Implementation |
|---------|----------------|
| **Message Announcements** | Chat container has `role="log"` and `aria-live="polite"` |
| **New Message Alert** | Hidden `aria-live="assertive"` region announces VERA responses |
| **Typing Indicator** | Uses `role="status"` with descriptive `aria-label` |
| **Input Label** | Visually hidden `<label>` + `aria-describedby` for keyboard hint |
| **Button Labels** | Attachment, voice, and send buttons have `aria-label` + `aria-hidden` SVGs |
| **Keyboard Send** | Enter key sends message (hint in `aria-describedby`) |
| **Focus Management** | Input retains focus after sending |

---

## 6. Known Issues

| Issue | WCAG Criterion | Priority | Planned Fix |
|-------|---------------|----------|-------------|
| Some label associations in forms | 1.3.1 | Medium | Q1 2026 |
| Anchor elements used as buttons | 2.1.1 | Medium | Q1 2026 |
| Missing autocomplete attributes | 1.3.5 | Low | Q2 2026 |
| autoFocus usage in some components | 2.4.3 | Low | Review needed |

---

## 7. Assistive Technology Testing

### Tested Combinations

| Screen Reader | Browser | Status |
|---------------|---------|--------|
| NVDA | Chrome | Tested |
| VoiceOver | Safari | Planned |
| JAWS | Edge | Planned |

### Keyboard Testing

| Action | Status |
|--------|--------|
| Tab navigation | ✅ Works |
| Enter to activate | ✅ Works |
| Escape to close modals | ✅ Works |
| Arrow key navigation | ⚠️ Partial |

---

## 8. Feedback

We welcome feedback on the accessibility of VERA. Please contact us:

- **Email**: accessibility@veraneural.com
- **Response Time**: Within 5 business days

When reporting accessibility issues, please include:
1. Description of the issue
2. Page/feature where it occurred
3. Assistive technology used (if applicable)
4. Browser and operating system

---

## 9. Remediation Plan

| Phase | Timeline | Focus |
|-------|----------|-------|
| Phase 1 | Q1 2026 | Fix label associations, anchor-as-button issues |
| Phase 2 | Q2 2026 | Add autocomplete attributes, improve ARIA |
| Phase 3 | Q3 2026 | Screen reader testing with JAWS, VoiceOver |
| Phase 4 | Q4 2026 | Third-party accessibility audit |

---

## 10. Technical Files

| File | Purpose |
|------|---------|
| `src/app/globals.css` | Focus-visible styles, sr-only classes, reduced motion |
| `src/components/a11y/SkipLink.tsx` | Skip to main content link |
| `src/app/layout.tsx` | Root layout with `lang="en"`, skip link |
| `src/app/sanctuary/components/ChatInput.tsx` | Accessible chat input with labels |
| `src/components/sidebar/TrustTransparencySidebar.tsx` | Navigation with `<nav aria-label>` |
| `eslint.config.mjs` | jsx-a11y plugin configuration |
| `tests/a11y/components.test.ts` | vitest-axe accessibility tests |
| `tests/utils/a11y.ts` | Accessibility test utilities |
| `vitest.a11y.config.ts` | jsdom environment for a11y tests |

---

## 11. Revision History

| Date | Version | Changes | Reviewer |
|------|---------|---------|----------|
| 2026-01-25 | 1.2 | Add vitest-axe automated a11y testing (16 tests) | Accessibility Team |
| 2026-01-25 | 1.1 | Phase 1 & 2 fixes: focus-visible, sr-only, nav semantics, chat a11y | Accessibility Team |
| 2026-01-25 | 1.0 | Initial accessibility audit and documentation | Accessibility Team |

---

*This statement was last updated on January 25, 2026.*
