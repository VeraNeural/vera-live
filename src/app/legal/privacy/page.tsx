import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | VERA Neural',
  description: 'Learn how VERA Neural protects your privacy and handles your personal data. GDPR and CCPA compliant privacy practices.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'January 25, 2026';

  const sections = [
    { id: 'controller', title: '1. Data Controller' },
    { id: 'data-collected', title: '2. Data We Collect' },
    { id: 'how-we-use', title: '3. How We Use Your Data' },
    { id: 'legal-basis', title: '4. Legal Basis for Processing' },
    { id: 'data-sharing', title: '5. Data Sharing' },
    { id: 'your-rights', title: '6. Your Rights' },
    { id: 'retention', title: '7. Data Retention' },
    { id: 'international', title: '8. International Transfers' },
    { id: 'security', title: '9. Security Measures' },
    { id: 'children', title: '10. Children\'s Privacy' },
    { id: 'changes', title: '11. Changes to This Policy' },
    { id: 'contact', title: '12. Contact Us' },
  ];

  return (
    <div className="privacy-policy">
      <div className="policy-container">
        {/* Header */}
        <header className="policy-header">
          <Link href="/" className="back-link">
            ← Back to VERA
          </Link>
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: {lastUpdated}</p>
          <p className="intro">
            At VERA Neural, we are committed to protecting your privacy and ensuring the security 
            of your personal information. This Privacy Policy explains how we collect, use, share, 
            and protect your data when you use our services.
          </p>
        </header>

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
          {/* Section 1: Data Controller */}
          <section id="controller" className="policy-section">
            <h2>1. Data Controller</h2>
            <p>
              The data controller responsible for your personal information is:
            </p>
            <address className="controller-info">
              <strong>VERA Neural / RegulateElevate</strong><br />
              Email: <a href="mailto:privacy@veraneural.com">privacy@veraneural.com</a><br />
              For privacy-related inquiries, please contact our Data Protection team at the email above.
            </address>
            <p>
              We are committed to responding to all privacy inquiries within 30 days, as required 
              by applicable data protection laws.
            </p>
          </section>

          {/* Section 2: Data We Collect */}
          <section id="data-collected" className="policy-section">
            <h2>2. Data We Collect</h2>
            <p>We collect the following categories of personal information:</p>

            <h3>2.1 Account Information</h3>
            <ul>
              <li>Email address</li>
              <li>Name (if provided)</li>
              <li>Profile preferences</li>
              <li>Authentication data</li>
            </ul>

            <h3>2.2 Conversation Data</h3>
            <ul>
              <li>Messages exchanged with VERA</li>
              <li>Emotional context and preferences (with consent)</li>
              <li>Session history</li>
            </ul>
            <p className="note">
              <strong>Note:</strong> Conversation data is stored securely and is only used to 
              provide you with a personalized experience. You can delete your conversation 
              history at any time.
            </p>

            <h3>2.3 Usage Data</h3>
            <ul>
              <li>Features accessed</li>
              <li>Session duration</li>
              <li>Interaction patterns (anonymized)</li>
              <li>Error logs (for troubleshooting)</li>
            </ul>

            <h3>2.4 Payment Information</h3>
            <ul>
              <li>Subscription status</li>
              <li>Transaction history</li>
              <li>Billing address (if required)</li>
            </ul>
            <p className="note">
              <strong>Important:</strong> We do not store credit card numbers or payment card 
              details. All payment processing is handled securely by Stripe, our PCI-compliant 
              payment processor.
            </p>

            <h3>2.5 Device and Technical Information</h3>
            <ul>
              <li>Browser type and version</li>
              <li>Device type</li>
              <li>Operating system</li>
              <li>IP address (hashed for privacy)</li>
              <li>Time zone and language preferences</li>
            </ul>

            <h3>2.6 Cookies and Similar Technologies</h3>
            <p>
              We use cookies to provide essential functionality, remember your preferences, 
              and analyze how our service is used. For detailed information about our cookie 
              practices, please see our <Link href="/legal/cookies">Cookie Policy</Link>.
            </p>
          </section>

          {/* Section 3: How We Use Your Data */}
          <section id="how-we-use" className="policy-section">
            <h2>3. How We Use Your Data</h2>
            <p>We use your personal information for the following purposes:</p>

            <h3>3.1 Providing the VERA Service</h3>
            <ul>
              <li>Delivering personalized emotional support and guidance</li>
              <li>Maintaining your conversation history</li>
              <li>Remembering your preferences and settings</li>
              <li>Providing customer support</li>
            </ul>

            <h3>3.2 Improving Our Service</h3>
            <ul>
              <li>Analyzing usage patterns to improve features (anonymized)</li>
              <li>Training and improving our AI models (only with your explicit consent)</li>
              <li>Developing new features based on user needs</li>
            </ul>

            <h3>3.3 Payment Processing</h3>
            <ul>
              <li>Processing subscription payments</li>
              <li>Managing billing and invoices</li>
              <li>Preventing fraud</li>
            </ul>

            <h3>3.4 Communications</h3>
            <ul>
              <li>Sending service-related notifications</li>
              <li>Responding to your inquiries</li>
              <li>Providing updates about changes to our service or policies</li>
            </ul>

            <h3>3.5 Legal Compliance</h3>
            <ul>
              <li>Complying with applicable laws and regulations</li>
              <li>Responding to legal requests</li>
              <li>Protecting our rights and the rights of others</li>
            </ul>
          </section>

          {/* Section 4: Legal Basis */}
          <section id="legal-basis" className="policy-section">
            <h2>4. Legal Basis for Processing (GDPR)</h2>
            <p>
              Under the General Data Protection Regulation (GDPR), we process your personal 
              data based on the following legal grounds:
            </p>

            <table className="legal-basis-table">
              <thead>
                <tr>
                  <th>Processing Activity</th>
                  <th>Legal Basis</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Account creation and management</td>
                  <td><strong>Contract Performance</strong> – Necessary to provide the service you requested</td>
                </tr>
                <tr>
                  <td>Conversation storage and history</td>
                  <td><strong>Consent</strong> – You can control this in your privacy settings</td>
                </tr>
                <tr>
                  <td>AI model improvement</td>
                  <td><strong>Consent</strong> – Only with your explicit opt-in consent</td>
                </tr>
                <tr>
                  <td>Security monitoring and fraud prevention</td>
                  <td><strong>Legitimate Interest</strong> – Protecting our service and users</td>
                </tr>
                <tr>
                  <td>Analytics (anonymized)</td>
                  <td><strong>Legitimate Interest</strong> – Improving our service</td>
                </tr>
                <tr>
                  <td>Payment processing</td>
                  <td><strong>Contract Performance</strong> – Fulfilling subscription agreements</td>
                </tr>
                <tr>
                  <td>Tax records retention</td>
                  <td><strong>Legal Obligation</strong> – Compliance with tax laws</td>
                </tr>
                <tr>
                  <td>Responding to law enforcement</td>
                  <td><strong>Legal Obligation</strong> – When required by valid legal process</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Section 5: Data Sharing */}
          <section id="data-sharing" className="policy-section">
            <h2>5. Data Sharing</h2>
            <p>
              We share your personal information only with trusted service providers who 
              help us operate our service. We require all third parties to respect the 
              security of your data and treat it in accordance with applicable laws.
            </p>

            <h3>5.1 Service Providers</h3>
            <table className="providers-table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Purpose</th>
                  <th>Data Shared</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Supabase</strong></td>
                  <td>Database hosting</td>
                  <td>Account data, conversation data (encrypted)</td>
                </tr>
                <tr>
                  <td><strong>Vercel</strong></td>
                  <td>Application hosting</td>
                  <td>Request logs, performance data</td>
                </tr>
                <tr>
                  <td><strong>Stripe</strong></td>
                  <td>Payment processing</td>
                  <td>Payment information, billing details</td>
                </tr>
                <tr>
                  <td><strong>Clerk</strong></td>
                  <td>Authentication</td>
                  <td>Email, authentication tokens</td>
                </tr>
                <tr>
                  <td><strong>Anthropic</strong></td>
                  <td>AI processing</td>
                  <td>Conversation content (for response generation)</td>
                </tr>
                <tr>
                  <td><strong>Hume AI</strong></td>
                  <td>Voice emotion analysis</td>
                  <td>Voice data (when using voice features)</td>
                </tr>
              </tbody>
            </table>

            <h3>5.2 We Do NOT</h3>
            <ul className="do-not-list">
              <li>❌ Sell your personal data to third parties</li>
              <li>❌ Share your data with advertisers</li>
              <li>❌ Use your conversations for marketing purposes</li>
              <li>❌ Share your data with data brokers</li>
            </ul>

            <h3>5.3 Legal Disclosures</h3>
            <p>
              We may disclose your information when required by law, such as in response to 
              valid legal process (subpoenas, court orders), or when necessary to protect 
              the safety of individuals.
            </p>
          </section>

          {/* Section 6: Your Rights */}
          <section id="your-rights" className="policy-section">
            <h2>6. Your Rights</h2>
            <p>
              You have the following rights regarding your personal data. These rights apply 
              under GDPR (EU/EEA), CCPA (California), and similar privacy laws:
            </p>

            <div className="rights-grid">
              <div className="right-card">
                <h3>📥 Right to Access</h3>
                <p>Request a copy of all personal data we hold about you.</p>
                <p className="how-to">
                  <strong>How:</strong> Settings → Export Data
                </p>
              </div>

              <div className="right-card">
                <h3>✏️ Right to Rectification</h3>
                <p>Correct any inaccurate personal data we hold about you.</p>
                <p className="how-to">
                  <strong>How:</strong> Edit your profile in Settings
                </p>
              </div>

              <div className="right-card">
                <h3>🗑️ Right to Erasure</h3>
                <p>Request deletion of your personal data ("right to be forgotten").</p>
                <p className="how-to">
                  <strong>How:</strong> Settings → Delete Account
                </p>
              </div>

              <div className="right-card">
                <h3>⏸️ Right to Restrict Processing</h3>
                <p>Limit how we use your data in certain circumstances.</p>
                <p className="how-to">
                  <strong>How:</strong> Contact privacy@veraneural.com
                </p>
              </div>

              <div className="right-card">
                <h3>📤 Right to Data Portability</h3>
                <p>Receive your data in a structured, machine-readable format (JSON).</p>
                <p className="how-to">
                  <strong>How:</strong> Settings → Export Data
                </p>
              </div>

              <div className="right-card">
                <h3>🚫 Right to Withdraw Consent</h3>
                <p>Withdraw consent for optional data processing at any time.</p>
                <p className="how-to">
                  <strong>How:</strong> Settings → Privacy
                </p>
              </div>

              <div className="right-card">
                <h3>🏛️ Right to Lodge a Complaint</h3>
                <p>File a complaint with your local data protection authority.</p>
                <p className="how-to">
                  <strong>EU:</strong> Contact your national DPA
                </p>
              </div>

              <div className="right-card">
                <h3>🛑 Right to Opt-Out (CCPA)</h3>
                <p>California residents can opt-out of data sales (we don't sell data).</p>
                <p className="how-to">
                  <strong>Note:</strong> VERA does not sell personal information
                </p>
              </div>
            </div>

            <p className="response-time">
              We will respond to all rights requests within <strong>30 days</strong>. 
              Complex requests may take up to 60 days with prior notice.
            </p>
          </section>

          {/* Section 7: Data Retention */}
          <section id="retention" className="policy-section">
            <h2>7. Data Retention</h2>
            <p>We retain your personal data for the following periods:</p>

            <table className="retention-table">
              <thead>
                <tr>
                  <th>Data Type</th>
                  <th>Retention Period</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Account data</td>
                  <td>Until you request deletion</td>
                  <td>Maintain your account</td>
                </tr>
                <tr>
                  <td>Conversation history</td>
                  <td>Until you request deletion</td>
                  <td>Provide continuity of service</td>
                </tr>
                <tr>
                  <td>Audit logs</td>
                  <td>365 days</td>
                  <td>Security and compliance</td>
                </tr>
                <tr>
                  <td>Payment records</td>
                  <td>7 years</td>
                  <td>Legal requirement (tax laws)</td>
                </tr>
                <tr>
                  <td>Anonymized analytics</td>
                  <td>Indefinitely</td>
                  <td>Service improvement (no personal data)</td>
                </tr>
                <tr>
                  <td>Backup data</td>
                  <td>30 days after deletion request</td>
                  <td>Disaster recovery</td>
                </tr>
              </tbody>
            </table>

            <p>
              When you delete your account, we will delete or anonymize your personal data 
              within 30 days, except for data we are legally required to retain.
            </p>
          </section>

          {/* Section 8: International Transfers */}
          <section id="international" className="policy-section">
            <h2>8. International Data Transfers</h2>
            <p>
              VERA Neural operates globally, and your data may be processed in countries 
              outside your own, including the United States.
            </p>

            <h3>8.1 Transfer Safeguards</h3>
            <p>When we transfer data internationally, we ensure appropriate safeguards:</p>
            <ul>
              <li>
                <strong>Standard Contractual Clauses (SCCs):</strong> We use EU-approved 
                contractual clauses with our service providers.
              </li>
              <li>
                <strong>Data Processing Agreements:</strong> All processors sign DPAs 
                committing to GDPR-equivalent protections.
              </li>
              <li>
                <strong>Encryption:</strong> Data is encrypted during transfer and at rest.
              </li>
            </ul>

            <h3>8.2 EU-US Data Transfers</h3>
            <p>
              For transfers from the EU to the US, we rely on Standard Contractual Clauses 
              and implement supplementary technical measures as recommended by the EDPB.
            </p>
          </section>

          {/* Section 9: Security */}
          <section id="security" className="policy-section">
            <h2>9. Security Measures</h2>
            <p>
              We implement comprehensive technical and organizational measures to protect 
              your personal data:
            </p>

            <div className="security-measures">
              <div className="measure">
                <h3>🔐 Encryption</h3>
                <ul>
                  <li>TLS 1.3 encryption for all data in transit</li>
                  <li>AES-256 encryption for data at rest</li>
                  <li>End-to-end encryption for sensitive data</li>
                </ul>
              </div>

              <div className="measure">
                <h3>🔑 Access Controls</h3>
                <ul>
                  <li>Role-based access control (RBAC)</li>
                  <li>Multi-factor authentication for admin access</li>
                  <li>Principle of least privilege</li>
                </ul>
              </div>

              <div className="measure">
                <h3>📊 Monitoring</h3>
                <ul>
                  <li>Comprehensive audit logging</li>
                  <li>Real-time security monitoring</li>
                  <li>Automated threat detection</li>
                </ul>
              </div>

              <div className="measure">
                <h3>🛡️ Assessments</h3>
                <ul>
                  <li>Regular security assessments</li>
                  <li>Penetration testing</li>
                  <li>Vulnerability scanning</li>
                </ul>
              </div>
            </div>

            <p>
              For more information about our security practices, please see our{' '}
              <Link href="/security">Security page</Link>.
            </p>
          </section>

          {/* Section 10: Children's Privacy */}
          <section id="children" className="policy-section">
            <h2>10. Children's Privacy</h2>
            <p>
              VERA is designed as a mental wellness and emotional support service for adults. 
              Our service is <strong>not intended for individuals under the age of 18</strong>.
            </p>
            <ul>
              <li>We do not knowingly collect personal data from children under 18.</li>
              <li>
                If we become aware that we have collected data from a child, we will 
                promptly delete it.
              </li>
              <li>
                If you believe a child has provided us with personal data, please contact 
                us immediately at{' '}
                <a href="mailto:privacy@veraneural.com">privacy@veraneural.com</a>.
              </li>
            </ul>
            <p>
              Parents or guardians who have questions about our data practices regarding 
              minors should contact us directly.
            </p>
          </section>

          {/* Section 11: Changes */}
          <section id="changes" className="policy-section">
            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our 
              practices, technology, legal requirements, or other factors.
            </p>
            <h3>How We Notify You</h3>
            <ul>
              <li>
                <strong>Material Changes:</strong> We will notify you via email and/or a 
                prominent notice in our service at least 30 days before changes take effect.
              </li>
              <li>
                <strong>Minor Changes:</strong> We will update the "Last Updated" date at 
                the top of this policy.
              </li>
            </ul>
            <p>
              We encourage you to review this policy periodically to stay informed about 
              how we protect your data.
            </p>
          </section>

          {/* Section 12: Contact */}
          <section id="contact" className="policy-section">
            <h2>12. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy 
              or our data practices, please contact us:
            </p>

            <div className="contact-info">
              <div className="contact-method">
                <h3>Privacy Inquiries</h3>
                <p>
                  <a href="mailto:privacy@veraneural.com">privacy@veraneural.com</a>
                </p>
                <p className="response">Response time: Within 30 days</p>
              </div>

              <div className="contact-method">
                <h3>Data Protection Officer</h3>
                <p>
                  <a href="mailto:dpo@veraneural.com">dpo@veraneural.com</a>
                </p>
                <p className="response">For GDPR-specific inquiries</p>
              </div>

              <div className="contact-method">
                <h3>General Support</h3>
                <p>
                  <a href="mailto:support@veraneural.com">support@veraneural.com</a>
                </p>
                <p className="response">For non-privacy inquiries</p>
              </div>
            </div>

            <p className="eu-rep">
              <strong>EU Representative:</strong> If you are in the EU and wish to contact 
              our EU representative, please email{' '}
              <a href="mailto:eu-rep@veraneural.com">eu-rep@veraneural.com</a>.
            </p>
          </section>
        </main>

        {/* Footer */}
        <footer className="policy-footer">
          <p>
            By using VERA, you acknowledge that you have read and understood this Privacy Policy.
          </p>
          <div className="footer-links">
            <Link href="/legal/terms">Terms of Service</Link>
            <Link href="/legal/cookies">Cookie Policy</Link>
            <Link href="/">Return to VERA</Link>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .privacy-policy {
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
          margin-bottom: 3rem;
          padding-bottom: 2rem;
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
          margin: 0 0 0.5rem 0;
          font-weight: 600;
        }

        .last-updated {
          color: #4A90D9;
          font-size: 0.95rem;
          margin: 0 0 1.5rem 0;
          font-weight: 500;
        }

        .intro {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #b8c5d3;
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

        /* Address */
        .controller-info {
          background: rgba(30, 58, 95, 0.4);
          padding: 1.25rem;
          border-radius: 8px;
          margin: 1rem 0;
          font-style: normal;
          border-left: 3px solid #4A90D9;
        }

        .controller-info a {
          color: #4A90D9;
        }

        /* Notes */
        .note {
          background: rgba(74, 144, 217, 0.1);
          padding: 1rem 1.25rem;
          border-radius: 8px;
          border-left: 3px solid #4A90D9;
          font-size: 0.95rem;
        }

        /* Tables */
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.25rem 0;
          font-size: 0.95rem;
        }

        th, td {
          padding: 0.875rem 1rem;
          text-align: left;
          border-bottom: 1px solid rgba(74, 144, 217, 0.2);
        }

        th {
          background: rgba(30, 58, 95, 0.6);
          color: #4A90D9;
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        td {
          color: #b8c5d3;
        }

        tr:hover td {
          background: rgba(74, 144, 217, 0.05);
        }

        /* Do Not List */
        .do-not-list {
          list-style: none !important;
          padding-left: 0 !important;
        }

        .do-not-list li {
          padding: 0.5rem 0;
        }

        /* Rights Grid */
        .rights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
          margin: 1.5rem 0;
        }

        .right-card {
          background: rgba(30, 58, 95, 0.4);
          padding: 1.25rem;
          border-radius: 10px;
          border: 1px solid rgba(74, 144, 217, 0.2);
        }

        .right-card h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.05rem;
        }

        .right-card p {
          margin: 0;
          font-size: 0.9rem;
        }

        .right-card .how-to {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(74, 144, 217, 0.2);
          font-size: 0.85rem;
          color: #8fa8c0;
        }

        .response-time {
          background: rgba(74, 144, 217, 0.1);
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
        }

        /* Security Measures */
        .security-measures {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.25rem;
          margin: 1.5rem 0;
        }

        .measure {
          background: rgba(30, 58, 95, 0.4);
          padding: 1.25rem;
          border-radius: 10px;
        }

        .measure h3 {
          margin: 0 0 0.75rem 0;
          font-size: 1rem;
        }

        .measure ul {
          margin: 0;
          padding-left: 1.25rem;
          font-size: 0.9rem;
        }

        .measure li {
          margin-bottom: 0.35rem;
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

        .eu-rep {
          background: rgba(30, 58, 95, 0.4);
          padding: 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .eu-rep a {
          color: #4A90D9;
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
          .privacy-policy {
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
          .right-card,
          .measure,
          .contact-method {
            border: 1px solid #ccc;
            background: #f9f9f9;
          }

          table {
            border: 1px solid #ccc;
          }

          th {
            background: #e0e0e0 !important;
            color: #1E3A5F !important;
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

          .toc ol {
            grid-template-columns: 1fr;
          }

          .rights-grid,
          .security-measures,
          .contact-info {
            grid-template-columns: 1fr;
          }

          table {
            font-size: 0.85rem;
          }

          th, td {
            padding: 0.6rem 0.75rem;
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
