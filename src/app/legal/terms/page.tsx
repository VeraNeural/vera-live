"use client";

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | VERA Neural',
  description: 'Terms of Service for VERA Neural. Read our terms and conditions for using the VERA emotional wellness platform.',
};

export default function TermsOfServicePage() {
  const lastUpdated = 'January 25, 2026';
  const effectiveDate = 'January 25, 2026';

  const sections = [
    { id: 'agreement', title: '1. Agreement to Terms' },
    { id: 'service', title: '2. Description of Service' },
    { id: 'accounts', title: '3. User Accounts' },
    { id: 'acceptable-use', title: '4. Acceptable Use' },
    { id: 'payments', title: '5. Subscription & Payments' },
    { id: 'intellectual-property', title: '6. Intellectual Property' },
    { id: 'disclaimers', title: '7. Disclaimers' },
    { id: 'liability', title: '8. Limitation of Liability' },
    { id: 'indemnification', title: '9. Indemnification' },
    { id: 'termination', title: '10. Termination' },
    { id: 'governing-law', title: '11. Governing Law' },
    { id: 'changes', title: '12. Changes to Terms' },
    { id: 'severability', title: '13. Severability' },
    { id: 'contact', title: '14. Contact' },
  ];

  return (
    <div className="terms-of-service">
      <div className="policy-container">
        {/* Header */}
        <header className="policy-header">
          <Link href="/" className="back-link">
            ← Back to VERA
          </Link>
          <h1>Terms of Service</h1>
          <div className="dates">
            <p className="last-updated">Last Updated: {lastUpdated}</p>
            <p className="effective-date">Effective Date: {effectiveDate}</p>
          </div>
        </header>

        {/* Critical Disclaimer */}
        <div className="critical-disclaimer" role="alert">
          <div className="disclaimer-icon">⚠️</div>
          <div className="disclaimer-content">
            <h2>Important Notice</h2>
            <p>
              <strong>VERA is an AI wellness companion, NOT a mental health provider.</strong>
            </p>
            <p>
              VERA does not provide medical advice, diagnosis, or treatment. It is not a 
              substitute for professional mental health care.
            </p>
            <p className="crisis-info">
              <strong>If you are in crisis, please contact emergency services or call{' '}
              <a href="tel:988">988</a> (Suicide & Crisis Lifeline).</strong>
            </p>
          </div>
        </div>

        {/* Table of Contents */}
        <nav className="toc" aria-label="Table of Contents">
          <h2>Contents</h2>
          <ol>
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.title}</a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Main Content */}
        <main className="policy-content">
          {/* Section 1: Agreement to Terms */}
          <section id="agreement" className="policy-section">
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using VERA ("the Service"), you agree to be bound by these Terms 
              of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.
            </p>

            <h3>1.1 Eligibility</h3>
            <p>To use VERA, you must:</p>
            <ul>
              <li>Be at least <strong>18 years of age</strong></li>
              <li>Have the legal capacity to enter into a binding agreement</li>
              <li>Not be prohibited from using the Service under applicable laws</li>
            </ul>

            <h3>1.2 Acceptance</h3>
            <p>
              By creating an account, accessing the Service, or clicking "I Agree," you 
              acknowledge that you have read, understood, and agree to be bound by these Terms 
              and our <Link href="/legal/privacy">Privacy Policy</Link>.
            </p>
          </section>

          {/* Section 2: Description of Service */}
          <section id="service" className="policy-section">
            <h2>2. Description of Service</h2>
            
            <h3>2.1 What VERA Is</h3>
            <p>
              VERA is an AI-powered emotional wellness platform designed to provide:
            </p>
            <ul>
              <li>Conversational support and companionship</li>
              <li>Emotional awareness and reflection tools</li>
              <li>Wellness insights and guidance</li>
              <li>Educational content about emotional wellbeing</li>
            </ul>

            <h3>2.2 What VERA Is NOT</h3>
            <div className="warning-box">
              <p><strong>VERA is NOT:</strong></p>
              <ul>
                <li>❌ A replacement for professional mental health care</li>
                <li>❌ A licensed therapist, counselor, or psychiatrist</li>
                <li>❌ A crisis intervention service</li>
                <li>❌ A medical device or diagnostic tool</li>
                <li>❌ A source of medical, legal, or financial advice</li>
              </ul>
            </div>

            <h3>2.3 Intended Purpose</h3>
            <p>
              VERA is intended for <strong>educational and entertainment purposes</strong>. 
              The Service provides general wellness information and AI-generated responses 
              that should not be relied upon for making important life decisions.
            </p>

            <h3>2.4 Professional Care</h3>
            <p>
              If you are experiencing mental health challenges, we strongly encourage you to 
              seek help from qualified mental health professionals. VERA is designed to 
              complement, not replace, professional care.
            </p>
          </section>

          {/* Section 3: User Accounts */}
          <section id="accounts" className="policy-section">
            <h2>3. User Accounts</h2>

            <h3>3.1 Account Creation</h3>
            <p>To access certain features, you must create an account. You agree to:</p>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information as needed</li>
              <li>Keep your login credentials secure and confidential</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>

            <h3>3.2 Account Security</h3>
            <p>
              You are responsible for all activities that occur under your account. We are not 
              liable for any loss or damage arising from your failure to protect your account 
              credentials.
            </p>

            <h3>3.3 One Account Per Person</h3>
            <p>
              Each person may only maintain one account. Creating multiple accounts may result 
              in termination of all associated accounts.
            </p>

            <h3>3.4 Account Suspension</h3>
            <p>
              We reserve the right to suspend or terminate accounts that violate these Terms, 
              engage in prohibited activities, or pose a risk to the Service or other users.
            </p>
          </section>

          {/* Section 4: Acceptable Use */}
          <section id="acceptable-use" className="policy-section">
            <h2>4. Acceptable Use</h2>
            <p>When using VERA, you agree NOT to:</p>

            <div className="prohibited-list">
              <div className="prohibited-item">
                <h3>4.1 Illegal Activities</h3>
                <ul>
                  <li>Use the Service for any unlawful purpose</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Facilitate illegal activities or transactions</li>
                </ul>
              </div>

              <div className="prohibited-item">
                <h3>4.2 Harmful Conduct</h3>
                <ul>
                  <li>Harass, abuse, or threaten other users or staff</li>
                  <li>Impersonate any person or entity</li>
                  <li>Spread misinformation or harmful content</li>
                  <li>Attempt to harm the AI or manipulate its behavior</li>
                </ul>
              </div>

              <div className="prohibited-item">
                <h3>4.3 Technical Violations</h3>
                <ul>
                  <li>Attempt to extract training data or model weights</li>
                  <li>Bypass or circumvent rate limits</li>
                  <li>Reverse engineer, decompile, or disassemble the Service</li>
                  <li>Access the Service through automated means without permission</li>
                  <li>Interfere with or disrupt the Service's operation</li>
                </ul>
              </div>

              <div className="prohibited-item">
                <h3>4.4 Account Violations</h3>
                <ul>
                  <li>Share your account credentials with others</li>
                  <li>Create accounts for others without permission</li>
                  <li>Sell, transfer, or sublicense your account</li>
                </ul>
              </div>
            </div>

            <p>
              Violation of these rules may result in immediate termination of your account 
              and, where appropriate, reporting to law enforcement.
            </p>
          </section>

          {/* Section 5: Payments */}
          <section id="payments" className="policy-section">
            <h2>5. Subscription & Payments</h2>

            <h3>5.1 Pricing</h3>
            <p>
              Subscription pricing is displayed at the time of purchase. All prices are in 
              USD unless otherwise specified.
            </p>

            <h3>5.2 Billing</h3>
            <ul>
              <li>
                Subscriptions are billed on a recurring basis (monthly or annually) until 
                cancelled
              </li>
              <li>
                Your payment method will be charged automatically at each renewal
              </li>
              <li>
                You can cancel your subscription at any time through your account settings
              </li>
            </ul>

            <h3>5.3 Refunds</h3>
            <p>
              Refunds are handled on a case-by-case basis. If you believe you are entitled to 
              a refund, please contact{' '}
              <a href="mailto:support@veraneural.com">support@veraneural.com</a> within 14 
              days of your purchase.
            </p>

            <h3>5.4 Price Changes</h3>
            <p>
              We may change subscription prices with at least 30 days' notice. Price changes 
              will take effect at your next billing cycle. Continued use after a price change 
              constitutes acceptance of the new price.
            </p>

            <h3>5.5 Taxes</h3>
            <p>
              Prices may be subject to applicable taxes, which will be calculated and added 
              at checkout based on your location.
            </p>
          </section>

          {/* Section 6: Intellectual Property */}
          <section id="intellectual-property" className="policy-section">
            <h2>6. Intellectual Property</h2>

            <h3>6.1 Our Intellectual Property</h3>
            <p>
              VERA Neural owns or licenses all intellectual property rights in the Service, 
              including but not limited to:
            </p>
            <ul>
              <li>
                <strong>Trademarks:</strong> VERA, SIM (Signal Integrity Mode), IBA (Intuition-Based 
                Architecture), JULIJA, and associated logos
              </li>
              <li>
                <strong>Technology:</strong> AI models, training data, algorithms, and software
              </li>
              <li>
                <strong>Content:</strong> Text, graphics, audio, and visual elements
              </li>
            </ul>
            <p>
              You may not use our intellectual property without prior written permission.
            </p>

            <h3>6.2 Your Content</h3>
            <p>
              You retain all rights to the content you provide to VERA ("User Content"). By 
              using the Service, you grant us a limited, non-exclusive license to:
            </p>
            <ul>
              <li>Process your content to provide the Service</li>
              <li>Store your content as described in our Privacy Policy</li>
              <li>Use anonymized, aggregated data to improve the Service (with consent)</li>
            </ul>

            <h3>6.3 Feedback</h3>
            <p>
              If you provide feedback, suggestions, or ideas about the Service, we may use 
              them without any obligation to compensate you.
            </p>
          </section>

          {/* Section 7: Disclaimers */}
          <section id="disclaimers" className="policy-section">
            <h2>7. Disclaimers</h2>

            <div className="disclaimer-box critical">
              <h3>⚠️ IMPORTANT: PLEASE READ CAREFULLY</h3>
              
              <h4>7.1 "As Is" Service</h4>
              <p>
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY 
                KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES 
                OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>

              <h4>7.2 Not Professional Mental Health Care</h4>
              <p>
                VERA IS NOT A LICENSED MENTAL HEALTH PROVIDER. THE SERVICE DOES NOT PROVIDE 
                MEDICAL ADVICE, DIAGNOSIS, OR TREATMENT. ALWAYS SEEK THE ADVICE OF QUALIFIED 
                HEALTH PROFESSIONALS FOR MENTAL HEALTH CONCERNS.
              </p>

              <h4>7.3 Not a Crisis Service</h4>
              <p>
                VERA IS NOT A CRISIS INTERVENTION SERVICE. IF YOU ARE IN CRISIS OR EXPERIENCING 
                THOUGHTS OF SELF-HARM, PLEASE CONTACT:
              </p>
              <ul>
                <li><strong>988 Suicide & Crisis Lifeline:</strong> Call or text 988 (US)</li>
                <li><strong>Emergency Services:</strong> Call 911 (US) or your local emergency number</li>
                <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
              </ul>

              <h4>7.4 No Guarantee of Accuracy</h4>
              <p>
                AI-GENERATED RESPONSES MAY CONTAIN ERRORS, INACCURACIES, OR INAPPROPRIATE 
                CONTENT. WE DO NOT GUARANTEE THE ACCURACY, COMPLETENESS, OR RELIABILITY OF 
                ANY CONTENT PROVIDED BY THE SERVICE.
              </p>

              <h4>7.5 Consult Professionals</h4>
              <p>
                FOR MEDICAL, LEGAL, FINANCIAL, OR OTHER PROFESSIONAL DECISIONS, ALWAYS CONSULT 
                QUALIFIED PROFESSIONALS. DO NOT RELY ON VERA FOR IMPORTANT LIFE DECISIONS.
              </p>
            </div>
          </section>

          {/* Section 8: Limitation of Liability */}
          <section id="liability" className="policy-section">
            <h2>8. Limitation of Liability</h2>

            <h3>8.1 Maximum Liability</h3>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY TO YOU FOR ANY 
              CLAIMS ARISING FROM OR RELATED TO THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU 
              PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR $100, WHICHEVER IS GREATER.
            </p>

            <h3>8.2 Exclusion of Damages</h3>
            <p>
              WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, 
              OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul>
              <li>Loss of profits, revenue, or data</li>
              <li>Business interruption</li>
              <li>Emotional distress or psychological harm</li>
              <li>Loss of goodwill or reputation</li>
              <li>Cost of substitute services</li>
            </ul>

            <h3>8.3 Jurisdictional Limitations</h3>
            <p>
              Some jurisdictions do not allow the exclusion or limitation of certain damages. 
              If these laws apply to you, some or all of the above exclusions or limitations 
              may not apply, and you may have additional rights.
            </p>
          </section>

          {/* Section 9: Indemnification */}
          <section id="indemnification" className="policy-section">
            <h2>9. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless VERA Neural, its officers, 
              directors, employees, agents, and affiliates from and against any claims, 
              liabilities, damages, losses, costs, and expenses (including reasonable 
              attorneys' fees) arising from:
            </p>
            <ul>
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Any content you submit through the Service</li>
              <li>Any harm caused by your actions while using the Service</li>
            </ul>
          </section>

          {/* Section 10: Termination */}
          <section id="termination" className="policy-section">
            <h2>10. Termination</h2>

            <h3>10.1 Termination by You</h3>
            <p>
              You may terminate your account at any time by going to Settings → Delete Account 
              or by contacting us at{' '}
              <a href="mailto:support@veraneural.com">support@veraneural.com</a>.
            </p>

            <h3>10.2 Termination by Us</h3>
            <p>We may suspend or terminate your account if:</p>
            <ul>
              <li>You violate these Terms</li>
              <li>Your conduct poses a risk to the Service or other users</li>
              <li>We are required to do so by law</li>
              <li>We discontinue the Service (with reasonable notice)</li>
            </ul>

            <h3>10.3 Effect of Termination</h3>
            <p>Upon termination:</p>
            <ul>
              <li>Your right to access the Service will cease immediately</li>
              <li>Your data will be deleted in accordance with our Privacy Policy</li>
              <li>Outstanding fees, if any, remain payable</li>
              <li>
                Sections that by their nature should survive (disclaimers, liability, 
                indemnification) will continue to apply
              </li>
            </ul>
          </section>

          {/* Section 11: Governing Law */}
          <section id="governing-law" className="policy-section">
            <h2>11. Governing Law & Disputes</h2>

            <h3>11.1 Governing Law</h3>
            <p>
              These Terms are governed by and construed in accordance with the laws of the 
              State of Delaware, United States, without regard to its conflict of law provisions.
            </p>

            <h3>11.2 Dispute Resolution</h3>
            <p>
              Before filing a legal claim, you agree to attempt to resolve any dispute with us 
              informally by contacting{' '}
              <a href="mailto:legal@veraneural.com">legal@veraneural.com</a>. We will attempt 
              to resolve the dispute within 60 days.
            </p>

            <h3>11.3 Arbitration</h3>
            <p>
              If informal resolution fails, any dispute shall be resolved by binding arbitration 
              administered by the American Arbitration Association under its Commercial 
              Arbitration Rules. The arbitration shall take place in Delaware, and the 
              arbitrator's decision shall be final and binding.
            </p>

            <h3>11.4 Class Action Waiver</h3>
            <p>
              TO THE EXTENT PERMITTED BY LAW, YOU AGREE THAT ANY DISPUTE RESOLUTION PROCEEDINGS 
              WILL BE CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT IN A CLASS, CONSOLIDATED, 
              OR REPRESENTATIVE ACTION.
            </p>

            <h3>11.5 Exceptions</h3>
            <p>
              Nothing in this section prevents either party from seeking injunctive relief in 
              court for intellectual property violations or other urgent matters.
            </p>
          </section>

          {/* Section 12: Changes */}
          <section id="changes" className="policy-section">
            <h2>12. Changes to Terms</h2>

            <h3>12.1 Modifications</h3>
            <p>
              We reserve the right to modify these Terms at any time. We will provide notice 
              of material changes by:
            </p>
            <ul>
              <li>Posting the updated Terms on our website</li>
              <li>Sending an email to your registered email address</li>
              <li>Displaying a prominent notice within the Service</li>
            </ul>

            <h3>12.2 Acceptance of Changes</h3>
            <p>
              Your continued use of the Service after changes become effective constitutes 
              your acceptance of the revised Terms. If you do not agree to the revised Terms, 
              you must stop using the Service.
            </p>

            <h3>12.3 Notice Period</h3>
            <p>
              For material changes, we will provide at least 30 days' notice before the 
              changes take effect, except where required by law to make immediate changes.
            </p>
          </section>

          {/* Section 13: Severability */}
          <section id="severability" className="policy-section">
            <h2>13. Severability & Entire Agreement</h2>

            <h3>13.1 Severability</h3>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that 
              provision shall be modified to the minimum extent necessary to make it enforceable, 
              or if modification is not possible, severed from these Terms. The remaining 
              provisions shall continue in full force and effect.
            </p>

            <h3>13.2 Entire Agreement</h3>
            <p>
              These Terms, together with our Privacy Policy and any other policies referenced 
              herein, constitute the entire agreement between you and VERA Neural regarding 
              the Service and supersede all prior agreements and understandings.
            </p>

            <h3>13.3 No Waiver</h3>
            <p>
              Our failure to enforce any right or provision of these Terms shall not constitute 
              a waiver of that right or provision.
            </p>
          </section>

          {/* Section 14: Contact */}
          <section id="contact" className="policy-section">
            <h2>14. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us:
            </p>

            <div className="contact-info">
              <div className="contact-method">
                <h3>Legal Inquiries</h3>
                <p>
                  <a href="mailto:legal@veraneural.com">legal@veraneural.com</a>
                </p>
                <p className="response">For Terms-related questions</p>
              </div>

              <div className="contact-method">
                <h3>General Support</h3>
                <p>
                  <a href="mailto:support@veraneural.com">support@veraneural.com</a>
                </p>
                <p className="response">For account and billing issues</p>
              </div>

              <div className="contact-method">
                <h3>Privacy Inquiries</h3>
                <p>
                  <a href="mailto:privacy@veraneural.com">privacy@veraneural.com</a>
                </p>
                <p className="response">For data and privacy questions</p>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="policy-footer">
          <p>
            By using VERA, you acknowledge that you have read, understood, and agree to be 
            bound by these Terms of Service.
          </p>
          <div className="footer-links">
            <Link href="/legal/privacy">Privacy Policy</Link>
            <Link href="/legal/cookies">Cookie Policy</Link>
            <Link href="/">Return to VERA</Link>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .terms-of-service {
          min-height: 100vh;
          background: linear-gradient(135deg, #0d1b2a 0%, #1b3a4b 100%);
          color: #e0e7ee;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .policy-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
        }

        /* Header */
        .policy-header {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(74, 144, 217, 0.3);
        }

        .back-link {
          display: inline-block;
          color: #4A90D9;
          text-decoration: none;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: #6ba5e7;
        }

        .policy-header h1 {
          font-size: 2.5rem;
          color: #ffffff;
          margin: 0 0 0.75rem 0;
          font-weight: 600;
        }

        .dates {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .last-updated,
        .effective-date {
          color: #4A90D9;
          font-size: 0.95rem;
          margin: 0;
          font-weight: 500;
        }

        /* Critical Disclaimer */
        .critical-disclaimer {
          background: linear-gradient(135deg, rgba(220, 53, 69, 0.15) 0%, rgba(220, 53, 69, 0.08) 100%);
          border: 2px solid rgba(220, 53, 69, 0.5);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          gap: 1rem;
        }

        .disclaimer-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .disclaimer-content h2 {
          margin: 0 0 0.75rem 0;
          color: #ff6b6b;
          font-size: 1.25rem;
        }

        .disclaimer-content p {
          margin: 0 0 0.75rem 0;
          color: #e0e7ee;
          line-height: 1.6;
        }

        .disclaimer-content p:last-child {
          margin-bottom: 0;
        }

        .crisis-info {
          background: rgba(220, 53, 69, 0.1);
          padding: 0.75rem;
          border-radius: 6px;
          margin-top: 1rem !important;
        }

        .crisis-info a {
          color: #ff6b6b;
          font-weight: 600;
        }

        /* Table of Contents */
        .toc {
          background: rgba(30, 58, 95, 0.5);
          border-radius: 12px;
          padding: 1.5rem 2rem;
          margin-bottom: 3rem;
          border: 1px solid rgba(74, 144, 217, 0.2);
        }

        .toc h2 {
          font-size: 1.1rem;
          color: #4A90D9;
          margin: 0 0 1rem 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .toc ol {
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 0.5rem 2rem;
        }

        .toc li a {
          color: #b8c5d3;
          text-decoration: none;
          font-size: 0.95rem;
          transition: color 0.2s;
        }

        .toc li a:hover {
          color: #4A90D9;
        }

        /* Sections */
        .policy-section {
          margin-bottom: 3rem;
          scroll-margin-top: 2rem;
        }

        .policy-section h2 {
          font-size: 1.5rem;
          color: #ffffff;
          margin: 0 0 1.25rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #4A90D9;
        }

        .policy-section h3 {
          font-size: 1.15rem;
          color: #4A90D9;
          margin: 1.5rem 0 0.75rem 0;
        }

        .policy-section h4 {
          font-size: 1rem;
          color: #8fc1e3;
          margin: 1.25rem 0 0.5rem 0;
        }

        .policy-section p {
          line-height: 1.7;
          margin-bottom: 1rem;
          color: #c8d4e0;
        }

        .policy-section ul {
          margin: 0 0 1rem 0;
          padding-left: 1.5rem;
        }

        .policy-section ul li {
          line-height: 1.6;
          margin-bottom: 0.5rem;
          color: #b8c5d3;
        }

        .policy-section a {
          color: #4A90D9;
        }

        /* Warning Box */
        .warning-box {
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.3);
          border-radius: 8px;
          padding: 1.25rem;
          margin: 1rem 0;
        }

        .warning-box p {
          margin: 0 0 0.75rem 0;
        }

        .warning-box ul {
          margin: 0;
          list-style: none;
          padding: 0;
        }

        .warning-box li {
          padding: 0.35rem 0;
        }

        /* Prohibited List */
        .prohibited-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
          margin: 1.5rem 0;
        }

        .prohibited-item {
          background: rgba(30, 58, 95, 0.4);
          padding: 1.25rem;
          border-radius: 10px;
          border: 1px solid rgba(74, 144, 217, 0.2);
        }

        .prohibited-item h3 {
          margin: 0 0 0.75rem 0;
          font-size: 1rem;
          color: #4A90D9;
        }

        .prohibited-item ul {
          margin: 0;
          padding-left: 1.25rem;
          font-size: 0.9rem;
        }

        /* Disclaimer Box */
        .disclaimer-box {
          background: rgba(30, 58, 95, 0.6);
          border-radius: 12px;
          padding: 1.5rem;
          margin: 1rem 0;
          border: 1px solid rgba(74, 144, 217, 0.3);
        }

        .disclaimer-box.critical {
          background: rgba(220, 53, 69, 0.08);
          border: 2px solid rgba(220, 53, 69, 0.4);
        }

        .disclaimer-box h3 {
          color: #ff6b6b;
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
        }

        .disclaimer-box h4 {
          color: #e0e7ee;
          margin: 1.25rem 0 0.5rem 0;
        }

        .disclaimer-box p {
          font-size: 0.95rem;
          text-transform: none;
        }

        .disclaimer-box ul {
          margin: 0.5rem 0 0 0;
        }

        /* Contact Info */
        .contact-info {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.25rem;
          margin: 1.5rem 0;
        }

        .contact-method {
          background: rgba(30, 58, 95, 0.4);
          padding: 1.25rem;
          border-radius: 10px;
          text-align: center;
        }

        .contact-method h3 {
          margin: 0 0 0.5rem 0;
          font-size: 0.95rem;
          color: #e0e7ee;
        }

        .contact-method p {
          margin: 0;
        }

        .contact-method a {
          color: #4A90D9;
          font-size: 0.95rem;
        }

        .contact-method .response {
          font-size: 0.8rem;
          color: #8fa8c0;
          margin-top: 0.5rem;
        }

        /* Footer */
        .policy-footer {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(74, 144, 217, 0.3);
          text-align: center;
        }

        .policy-footer p {
          color: #8fa8c0;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .footer-links a {
          color: #4A90D9;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: #6ba5e7;
        }

        /* Print Styles */
        @media print {
          .terms-of-service {
            background: white;
            color: black;
          }

          .policy-container {
            max-width: 100%;
          }

          .back-link,
          .footer-links {
            display: none;
          }

          .policy-section h2 {
            color: #1E3A5F;
            border-color: #1E3A5F;
          }

          .policy-section h3 {
            color: #1E3A5F;
          }

          a {
            color: #1E3A5F !important;
          }

          .toc,
          .prohibited-item,
          .contact-method {
            border: 1px solid #ccc;
            background: #f9f9f9;
          }

          .critical-disclaimer,
          .disclaimer-box.critical {
            border-color: #dc3545;
            background: #fff5f5;
          }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .policy-container {
            padding: 1.5rem 1rem 3rem;
          }

          .policy-header h1 {
            font-size: 2rem;
          }

          .dates {
            flex-direction: column;
            gap: 0.25rem;
          }

          .critical-disclaimer {
            flex-direction: column;
            text-align: center;
          }

          .toc ol {
            grid-template-columns: 1fr;
          }

          .prohibited-list,
          .contact-info {
            grid-template-columns: 1fr;
          }

          .footer-links {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
