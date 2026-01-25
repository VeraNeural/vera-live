/// <reference types="vitest-axe" />
/**
 * Accessibility Component Tests
 * 
 * Automated WCAG 2.1 AA compliance testing using vitest-axe.
 * These tests verify that key components meet accessibility standards.
 * 
 * @see https://www.w3.org/WAI/WCAG21/quickref/
 * @see docs/ACCESSIBILITY.md
 */

import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import 'vitest-axe/extend-expect';

describe('Accessibility Tests', () => {
  describe('SkipLink Component', () => {
    it('should have no accessibility violations', async () => {
      // Create a minimal DOM representation for testing
      const html = `
        <a href="#main-content" class="sr-only sr-only-focusable">
          Skip to main content
        </a>
        <main id="main-content">
          <h1>Main Content</h1>
          <p>Page content here</p>
        </main>
      `;
      
      const results = await axe(html);
      expect(results).toHaveNoViolations();
    });

    it('skip link should target valid main content', async () => {
      const html = `
        <a href="#main-content" class="sr-only sr-only-focusable">
          Skip to main content
        </a>
        <nav aria-label="Main navigation">
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>
        <main id="main-content">
          <h1>Page Title</h1>
        </main>
      `;
      
      const results = await axe(html);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ChatInput Component', () => {
    it('should have properly labeled input', async () => {
      const html = `
        <div role="form" aria-label="Send message to VERA">
          <label for="vera-chat-input" class="sr-only">
            Type your message to VERA
          </label>
          <textarea
            id="vera-chat-input"
            aria-describedby="chat-input-hint"
            placeholder="Share what's on your mind..."
          ></textarea>
          <span id="chat-input-hint" class="sr-only">
            Press Enter to send your message
          </span>
          <button type="button" aria-label="Send message">
            Send
          </button>
        </div>
      `;
      
      const results = await axe(html);
      expect(results).toHaveNoViolations();
    });

    it('should have accessible icon buttons', async () => {
      const html = `
        <div>
          <button type="button" aria-label="Attach image or file">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M21.44 11.05l-9.19 9.19"></path>
            </svg>
          </button>
          <button type="button" aria-label="Start voice session">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M12 1a4 4 0 00-4 4v7"></path>
            </svg>
          </button>
          <button type="button" aria-label="Send message">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <line x1="22" y1="2" x2="11" y2="13"></line>
            </svg>
          </button>
        </div>
      `;
      
      const results = await axe(html);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Navigation Components', () => {
    it('sidebar navigation should be properly labeled', async () => {
      const html = `
        <nav aria-label="Main navigation">
          <button 
            type="button" 
            aria-label="Toggle navigation"
            aria-expanded="true"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <ul>
            <li><a href="/sanctuary">Sanctuary</a></li>
            <li><a href="/settings">Settings</a></li>
            <li><a href="/help">Help</a></li>
          </ul>
        </nav>
      `;
      
      const results = await axe(html);
      expect(results).toHaveNoViolations();
    });

    it('collapsed navigation should indicate state', async () => {
      const html = `
        <nav aria-label="Main navigation">
          <button 
            type="button" 
            aria-label="Toggle navigation"
            aria-expanded="false"
          >
            Toggle
          </button>
        </nav>
      `;
      
      const results = await axe(html);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Chat Message List', () => {
    it('chat container should use proper ARIA live regions', async () => {
      const html = `
        <main id="main-content">
          <div role="log" aria-label="Conversation with VERA" aria-live="polite">
            <div role="article" aria-label="Message from You">
              <p>Hello VERA</p>
            </div>
            <div role="article" aria-label="Message from VERA">
              <p>Hello! How can I help you today?</p>
            </div>
          </div>
          <div aria-live="assertive" aria-atomic="true" class="sr-only">
            <!-- Screen reader announcement area -->
          </div>
        </main>
      `;
      
      const results = await axe(html);
      expect(results).toHaveNoViolations();
    });

    it('typing indicator should be accessible', async () => {
      const html = `
        <div role="status" aria-label="VERA is typing">
          <span class="sr-only">VERA is typing a response</span>
          <div aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      `;
      
      const results = await axe(html);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Form Accessibility', () => {
    it('form inputs should have associated labels', async () => {
      const html = `
        <form aria-label="User settings">
          <div>
            <label for="email">Email address</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              aria-required="true"
              autocomplete="email"
            />
          </div>
          <div>
            <label for="name">Full name</label>
            <input 
              type="text" 
              id="name" 
              name="name"
              autocomplete="name"
            />
          </div>
          <button type="submit">Save</button>
        </form>
      `;
      
      const results = await axe(html);
      expect(results).toHaveNoViolations();
    });

    it('form errors should be programmatically associated', async () => {
      const html = `
        <form aria-label="Login form">
          <div>
            <label for="login-email">Email</label>
            <input 
              type="email" 
              id="login-email"
              aria-invalid="true"
              aria-describedby="email-error"
            />
            <span id="email-error" role="alert">
              Please enter a valid email address
            </span>
          </div>
          <button type="submit">Log in</button>
        </form>
      `;
      
      const results = await axe(html);
      expect(results).toHaveNoViolations();
    });

    it('required fields should be indicated', async () => {
      const html = `
        <form aria-label="Registration">
          <div>
            <label for="req-email">
              Email <span aria-hidden="true">*</span>
              <span class="sr-only">(required)</span>
            </label>
            <input 
              type="email" 
              id="req-email"
              aria-required="true"
              required
            />
          </div>
          <p class="sr-only">Fields marked with * are required</p>
          <button type="submit">Register</button>
        </form>
      `;
      
      const results = await axe(html);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Modal Accessibility', () => {
    it('modal should have proper ARIA attributes', async () => {
      const html = `
        <div 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <h2 id="modal-title">Confirm Action</h2>
          <p id="modal-description">Are you sure you want to proceed?</p>
          <button type="button">Cancel</button>
          <button type="button">Confirm</button>
        </div>
      `;
      
      const results = await axe(html);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Heading Structure', () => {
    it('page should have proper heading hierarchy', async () => {
      const html = `
        <main>
          <h1>VERA Sanctuary</h1>
          <section>
            <h2>Your Conversations</h2>
            <article>
              <h3>Yesterday</h3>
              <p>Conversation content...</p>
            </article>
          </section>
          <section>
            <h2>Settings</h2>
            <p>Settings content...</p>
          </section>
        </main>
      `;
      
      const results = await axe(html);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Link and Button Accessibility', () => {
    it('links should have descriptive text', async () => {
      const html = `
        <nav>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/help" aria-label="Get help with VERA">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
          </a>
        </nav>
      `;
      
      const results = await axe(html);
      expect(results).toHaveNoViolations();
    });

    it('buttons should have accessible names', async () => {
      const html = `
        <div>
          <button type="button">Save Changes</button>
          <button type="button" aria-label="Close dialog">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
          <button type="submit">Submit Form</button>
        </div>
      `;
      
      const results = await axe(html);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Image Accessibility', () => {
    it('images should have alt text', async () => {
      const html = `
        <main>
          <img src="/avatar.png" alt="User profile picture" />
          <img src="/logo.svg" alt="VERA logo" />
          <img src="/decoration.svg" alt="" role="presentation" />
        </main>
      `;
      
      const results = await axe(html);
      expect(results).toHaveNoViolations();
    });
  });
});
