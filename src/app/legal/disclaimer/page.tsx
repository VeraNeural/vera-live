"use client";

import Link from 'next/link';

export default function DisclaimerPage() {
  const lastUpdated = 'January 25, 2026';

  return (
    <div className="disclaimer-page">
      <div className="policy-container">
        {/* Header */}
        <header className="policy-header">
          <Link href="/" className="back-link">
            ← Back to VERA
          </Link>
          <h1>Medical Disclaimer</h1>
          <p className="last-updated">Last Updated: {lastUpdated}</p>
        </header>

        {/* Critical Alert */}
        <div className="critical-alert" role="alert">
          <div className="alert-icon">⚠️</div>
          <div className="alert-content">
            <h2>VERA is NOT a Mental Health Provider</h2>
            <p>
              VERA is an AI wellness companion designed for <strong>educational and 
              informational purposes only</strong>. It is not a substitute for professional 
              medical advice, diagnosis, or treatment.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <main className="policy-content">
          {/* Section: Crisis Resources */}
          <section className="policy-section crisis-section">
            <h2>🆘 If You Are in Crisis</h2>
            <p>
              If you or someone you know is in immediate danger or experiencing a mental 
              health emergency, please:
            </p>
            <div className="crisis-resources">
              <div className="resource-card">
                <h3>Emergency Services</h3>
                <p>Call <strong>911</strong> (US) or your local emergency number</p>
              </div>
              <div className="resource-card">
                <h3>Suicide & Crisis Lifeline</h3>
                <p>Call or text <a href="tel:988"><strong>988</strong></a> (US)</p>
              </div>
              <div className="resource-card">
                <h3>Crisis Text Line</h3>
                <p>Text <strong>HOME</strong> to <strong>741741</strong> (US)</p>
              </div>
              <div className="resource-card">
                <h3>International Association for Suicide Prevention</h3>
                <p>Visit <a href="https://www.iasp.info/resources/Crisis_Centres/" target="_blank" rel="noopener noreferrer">IASP Crisis Centers</a></p>
              </div>
            </div>
          </section>

          {/* Section: What VERA Is */}
          <section className="policy-section">
            <h2>What VERA Is</h2>
            <p>VERA is an AI-powered platform that provides:</p>
            <ul>
              <li>Conversational support and emotional companionship</li>
              <li>Tools for self-reflection and emotional awareness</li>
              <li>General wellness information and educational content</li>
              <li>Guided exercises for relaxation and mindfulness</li>
            </ul>
            <p>
              VERA uses artificial intelligence to generate responses. While we strive for 
              accuracy and helpfulness, AI-generated content may sometimes be incorrect, 
              incomplete, or not appropriate for your specific situation.
            </p>
          </section>

          {/* Section: What VERA Is NOT */}
          <section className="policy-section warning-section">
            <h2>What VERA Is NOT</h2>
            <div className="warning-list">
              <div className="warning-item">
                <span className="warning-icon">❌</span>
                <div>
                  <strong>Not a licensed therapist or counselor</strong>
                  <p>VERA cannot provide therapy, counseling, or psychological treatment.</p>
                </div>
              </div>
              <div className="warning-item">
                <span className="warning-icon">❌</span>
                <div>
                  <strong>Not a medical professional</strong>
                  <p>VERA cannot diagnose conditions, prescribe medications, or provide medical advice.</p>
                </div>
              </div>
              <div className="warning-item">
                <span className="warning-icon">❌</span>
                <div>
                  <strong>Not a crisis intervention service</strong>
                  <p>VERA is not equipped to handle emergencies or crisis situations.</p>
                </div>
              </div>
              <div className="warning-item">
                <span className="warning-icon">❌</span>
                <div>
                  <strong>Not a replacement for professional care</strong>
                  <p>If you&apos;re experiencing mental health challenges, please seek help from qualified professionals.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Your Responsibility */}
          <section className="policy-section">
            <h2>Your Responsibility</h2>
            <p>By using VERA, you acknowledge and agree that:</p>
            <ul>
              <li>
                <strong>You are responsible for your own health decisions.</strong> Any 
                information provided by VERA should not be used as a basis for making 
                health-related decisions without consulting qualified professionals.
              </li>
              <li>
                <strong>VERA&apos;s responses are AI-generated.</strong> They may not always be 
                accurate, appropriate, or applicable to your specific circumstances.
              </li>
              <li>
                <strong>Professional help is important.</strong> If you are experiencing 
                mental health symptoms, we encourage you to seek evaluation and treatment 
                from licensed mental health professionals.
              </li>
              <li>
                <strong>Emergency situations require professional help.</strong> In any 
                emergency, contact emergency services immediately.
              </li>
            </ul>
          </section>

          {/* Section: No Professional Relationship */}
          <section className="policy-section">
            <h2>No Professional Relationship</h2>
            <p>
              Use of VERA does not create a therapist-client, doctor-patient, or any 
              other professional relationship. VERA is not licensed to practice medicine, 
              psychology, counseling, or any other regulated profession.
            </p>
            <p>
              The conversations you have with VERA are with an artificial intelligence 
              system, not a human professional. While VERA aims to be supportive and 
              helpful, it cannot replace the nuanced understanding, ethical obligations, 
              and professional judgment of licensed practitioners.
            </p>
          </section>

          {/* Section: Limitation of Liability */}
          <section className="policy-section">
            <h2>Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, VERA Neural and its affiliates, 
              officers, directors, employees, and agents shall not be liable for:
            </p>
            <ul>
              <li>Any decisions or actions you take based on information from VERA</li>
              <li>Any harm, injury, or damages arising from the use of VERA</li>
              <li>Any reliance on AI-generated content or suggestions</li>
              <li>Any delay in seeking professional help due to use of VERA</li>
            </ul>
          </section>

          {/* Section: Seek Professional Help */}
          <section className="policy-section recommendation-section">
            <h2>When to Seek Professional Help</h2>
            <p>
              We strongly encourage you to consult with qualified mental health 
              professionals if you are experiencing:
            </p>
            <ul>
              <li>Persistent feelings of sadness, hopelessness, or emptiness</li>
              <li>Anxiety that interferes with daily activities</li>
              <li>Thoughts of self-harm or suicide</li>
              <li>Difficulty functioning at work, school, or in relationships</li>
              <li>Substance abuse or addiction</li>
              <li>Trauma or PTSD symptoms</li>
              <li>Any other concerning mental health symptoms</li>
            </ul>
            <p>
              Professional mental health providers can offer personalized assessment, 
              diagnosis, and evidence-based treatment that VERA cannot provide.
            </p>
          </section>

          {/* Section: Contact */}
          <section className="policy-section">
            <h2>Questions?</h2>
            <p>
              If you have questions about this disclaimer or our services, please contact 
              us at{' '}
              <a href="mailto:support@veraneural.com">support@veraneural.com</a>.
            </p>
          </section>
        </main>

        {/* Footer */}
        <footer className="policy-footer">
          <p>
            By using VERA, you acknowledge that you have read, understood, and agree 
            to this Medical Disclaimer.
          </p>
          <div className="footer-links">
            <Link href="/legal/privacy">Privacy Policy</Link>
            <Link href="/legal/terms">Terms of Service</Link>
            <Link href="/">Return to VERA</Link>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .disclaimer-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0d1b2a 0%, #1b3a4b 100%);
          color: #e0e7ee;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative;
          z-index: 1;
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
          margin: 0 0 0.5rem 0;
          font-weight: 600;
        }

        .last-updated {
          color: #4A90D9;
          font-size: 0.95rem;
          margin: 0;
          font-weight: 500;
        }

        /* Critical Alert */
        .critical-alert {
          background: linear-gradient(135deg, rgba(220, 53, 69, 0.2) 0%, rgba(220, 53, 69, 0.1) 100%);
          border: 2px solid rgba(220, 53, 69, 0.6);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          gap: 1rem;
        }

        .alert-icon {
          font-size: 2.5rem;
          flex-shrink: 0;
        }

        .alert-content h2 {
          margin: 0 0 0.75rem 0;
          color: #ff6b6b;
          font-size: 1.4rem;
        }

        .alert-content p {
          margin: 0;
          color: #e0e7ee;
          line-height: 1.7;
          font-size: 1.05rem;
        }

        /* Crisis Section */
        .crisis-section {
          background: rgba(30, 58, 95, 0.4);
          border-radius: 12px;
          padding: 1.5rem 2rem;
          border: 1px solid rgba(74, 144, 217, 0.3);
        }

        .crisis-section h2 {
          border-bottom: none;
          color: #ff6b6b;
        }

        .crisis-resources {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .resource-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .resource-card h3 {
          margin: 0 0 0.5rem 0;
          font-size: 0.95rem;
          color: #ffffff;
        }

        .resource-card p {
          margin: 0;
          font-size: 0.9rem;
          color: #b8c5d3;
        }

        .resource-card a {
          color: #4A90D9;
          text-decoration: none;
        }

        .resource-card a:hover {
          text-decoration: underline;
        }

        /* Policy Sections */
        .policy-section {
          margin-bottom: 2.5rem;
        }

        .policy-section h2 {
          font-size: 1.5rem;
          color: #ffffff;
          margin: 0 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #4A90D9;
        }

        .policy-section p {
          color: #b8c5d3;
          line-height: 1.7;
          margin-bottom: 1rem;
        }

        .policy-section ul {
          color: #b8c5d3;
          line-height: 1.8;
          padding-left: 1.5rem;
          margin: 1rem 0;
        }

        .policy-section li {
          margin-bottom: 0.5rem;
        }

        .policy-section a {
          color: #4A90D9;
          text-decoration: none;
        }

        .policy-section a:hover {
          text-decoration: underline;
        }

        /* Warning Section */
        .warning-section {
          background: rgba(220, 53, 69, 0.08);
          border-radius: 12px;
          padding: 1.5rem 2rem;
          border: 1px solid rgba(220, 53, 69, 0.3);
        }

        .warning-section h2 {
          color: #ff6b6b;
          border-color: #ff6b6b;
        }

        .warning-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .warning-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .warning-icon {
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .warning-item strong {
          color: #ffffff;
          display: block;
          margin-bottom: 0.25rem;
        }

        .warning-item p {
          margin: 0;
          font-size: 0.95rem;
          color: #b8c5d3;
        }

        /* Recommendation Section */
        .recommendation-section {
          background: rgba(34, 197, 94, 0.08);
          border-radius: 12px;
          padding: 1.5rem 2rem;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .recommendation-section h2 {
          color: #22c55e;
          border-color: #22c55e;
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

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .policy-container {
            padding: 1.5rem 1rem 3rem;
          }

          .policy-header h1 {
            font-size: 2rem;
          }

          .critical-alert {
            flex-direction: column;
          }

          .crisis-resources {
            grid-template-columns: 1fr;
          }

          .warning-section,
          .recommendation-section,
          .crisis-section {
            padding: 1rem 1.25rem;
          }

          .footer-links {
            flex-direction: column;
            gap: 1rem;
          }
        }

        /* Print Styles */
        @media print {
          .disclaimer-page {
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

          a {
            color: #1E3A5F !important;
          }
        }
      `}</style>
    </div>
  );
}
