'use client';

import React, { useState, useCallback } from 'react';
import { FormattedOutput } from '@/lib/ops/components/FormattedOutput';
import type { AIProvider, GenerationMode } from '@/lib/ops/types';
import { logError, safeCopyToClipboard } from '../utils/errorHandler';

interface AppKitOrchestratorProps {
  colors: {
    bg: string;
    accent: string;
    text: string;
    textMuted: string;
    cardBg: string;
    cardBorder: string;
    glow: string;
  };
  isDark?: boolean;
  inputBg?: string;
  inputBorder?: string;
  generationMode?: GenerationMode;
  selectedProvider?: AIProvider;
  selectedSpace?: string;
}

export function AppKitOrchestrator({
  colors,
  isDark = false,
}: AppKitOrchestratorProps) {
  // Local state
  const [appKitStage, setAppKitStage] = useState<'input' | 'results'>('input');
  const [appKitJobDescription, setAppKitJobDescription] = useState('');
  const [appKitResume, setAppKitResume] = useState('');
  const [appKitHighlights, setAppKitHighlights] = useState('');
  const [appKitGenerating, setAppKitGenerating] = useState(false);
  const [appKitResumeOutput, setAppKitResumeOutput] = useState('');
  const [appKitCoverLetterOutput, setAppKitCoverLetterOutput] = useState('');
  const [appKitFollowUpOutput, setAppKitFollowUpOutput] = useState('');
  const [appKitInterviewPrepOutput, setAppKitInterviewPrepOutput] = useState('');
  const [appKitThankYouOutput, setAppKitThankYouOutput] = useState('');
  const [appKitActiveTab, setAppKitActiveTab] = useState('resume');

  const handleCopy = useCallback(async (text: string) => {
    await safeCopyToClipboard(text);
  }, []);

  const handleReset = useCallback(() => {
    setAppKitStage('input');
    setAppKitJobDescription('');
    setAppKitResume('');
    setAppKitHighlights('');
    setAppKitResumeOutput('');
    setAppKitCoverLetterOutput('');
    setAppKitFollowUpOutput('');
    setAppKitInterviewPrepOutput('');
    setAppKitThankYouOutput('');
    setAppKitActiveTab('resume');
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!appKitJobDescription.trim() || !appKitResume.trim()) return;
    setAppKitGenerating(true);

    const context = `
JOB DESCRIPTION:
${appKitJobDescription}

CANDIDATE BACKGROUND:
${appKitResume}

${appKitHighlights ? `ADDITIONAL CONTEXT:\n${appKitHighlights}` : ''}
    `.trim();

    try {
      // Generate all 5 outputs
      const [resumeRes, coverRes, followUpRes, interviewRes, thankYouRes] = await Promise.all([
        // RESUME
        fetch('/api/ops/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activityId: 'respond',
            mode: 'single',
            systemPrompt: `You are VERA — an elite ATS-optimization expert and executive resume writer.

TASK: Create a COMPLETE, FORMATTED, ATS-OPTIMIZED RESUME for this job applicant.

CRITICAL: Output ONLY the resume document itself. No explanations, no commentary, no "Here's your resume" — just the resume.

REQUIRED FORMAT:

[FULL NAME]
[City, State] | [Phone] | [Email] | [LinkedIn URL if provided]

═══════════════════════════════════════════
PROFESSIONAL SUMMARY
═══════════════════════════════════════════
[3-4 sentences: Years of experience + key expertise areas + what you bring to THIS specific role. Naturally incorporate 2-3 keywords from the job description.]

═══════════════════════════════════════════
PROFESSIONAL EXPERIENCE
═══════════════════════════════════════════

[JOB TITLE] | [Company Name]
[City, State] | [Start Date] – [End Date or Present]
• [Achievement with measurable result - use numbers: %, $, #]
• [Achievement demonstrating skill relevant to target job]
• [Achievement showing leadership or initiative]
• [3-5 bullets per position, most recent jobs get more bullets]

[Previous position in same format...]

═══════════════════════════════════════════
SKILLS
═══════════════════════════════════════════
[Category]: [Skill, Skill, Skill]
[Category]: [Skill, Skill, Skill]
[Match keywords from the job description]

═══════════════════════════════════════════
EDUCATION
═══════════════════════════════════════════
[Degree Name] | [University/College Name] | [Year]
[Relevant certifications if any]

RULES:
- Use the applicant's ACTUAL information from their resume/background
- Match keywords from the job description naturally
- Action verbs: Led, Developed, Increased, Managed, Created, Implemented
- Include measurable results wherever possible
- ATS-friendly: no tables, graphics, or fancy formatting
- This must be ready to copy-paste into a Word document and submit`,
            userInput: context
          })
        }),
        // COVER LETTER
        fetch('/api/ops/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activityId: 'respond',
            mode: 'single',
            systemPrompt: `You are VERA — a hiring expert who knows what makes cover letters stand out.

TASK: Write a COMPLETE, READY-TO-SEND COVER LETTER for this job applicant.

CRITICAL: Output ONLY the cover letter itself. No explanations, no "Here's your cover letter" — just the letter.

REQUIRED FORMAT:

[Today's Date]

Dear Hiring Manager,

[OPENING PARAGRAPH - 2-3 sentences]
Start with genuine interest in THIS specific company or role (not "I'm excited to apply"). State the position. Briefly mention your most relevant qualification.

[MIDDLE PARAGRAPH - 3-4 sentences]
Your strongest example that proves you can do THIS job. Be specific: what you did, what resulted, and how it connects to what THEY need. Use ONE concrete story with numbers if possible.

[CLOSING PARAGRAPH - 2-3 sentences]
Reiterate your enthusiasm for THIS role specifically. Confident call to action about next steps. Thank them.

Sincerely,

[Applicant's Full Name]
[Phone Number]
[Email Address]

RULES:
- Use the applicant's ACTUAL name and contact info
- Reference specific details from the job description
- Maximum 3 paragraphs in the body
- Professional but human — not robotic
- Ready to copy-paste and send immediately`,
            userInput: context
          })
        }),
        // APPLICATION EMAIL (Initial outreach when submitting resume)
        fetch('/api/ops/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activityId: 'respond',
            mode: 'single',
            systemPrompt: `You are VERA. Write a COMPLETE, READY-TO-SEND APPLICATION EMAIL for this job applicant to send when submitting their resume.

TASK: This is the email the applicant sends WITH their resume when first applying for the job.

CRITICAL: Output ONLY the email itself. No explanations — just the email.

REQUIRED FORMAT:

Subject: Application for [Job Title] — [Applicant Name]

Dear Hiring Manager,

[OPENING - 1-2 sentences: State the position you're applying for and where you found it. One sentence on why you're interested in THIS company specifically.]

[MIDDLE - 2-3 sentences: Your top 1-2 qualifications that match what they're looking for. Be specific and concise.]

[CLOSE - 1-2 sentences: Note that your resume is attached. Express enthusiasm and availability to discuss further.]

Best regards,

[Applicant's Full Name]
[Phone Number]
[Email Address]

RULES:
- This is the FIRST email — the initial application, not a follow-up
- Keep it brief: 4-6 sentences total in the body
- Professional and confident tone
- Reference the specific role and company
- Ready to copy-paste into email with resume attached`,
            userInput: context
          })
        }),
        // INTERVIEW PREP
        fetch('/api/ops/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activityId: 'respond',
            mode: 'single',
            systemPrompt: `You are VERA — an interview coach who has prepared candidates for thousands of successful interviews.

TASK: Create a COMPLETE INTERVIEW PREP GUIDE for this job applicant.

CRITICAL: Output ONLY the prep guide. No meta-commentary.

REQUIRED FORMAT:

═══════════════════════════════════════════
INTERVIEW PREP: [Job Title] at [Company]
═══════════════════════════════════════════

📋 YOUR "TELL ME ABOUT YOURSELF" (60 seconds)
"[Write a complete, ready-to-use script tailored to this role using the applicant's actual background. Start with current role, highlight relevant experience, end with why this opportunity.]"

───────────────────────────────────────────
5 QUESTIONS THEY'LL LIKELY ASK
───────────────────────────────────────────

1️⃣ "[Question based on job description]"
   WHY THEY ASK: [1 sentence]
   YOUR ANSWER: "[Complete answer using applicant's experience]"

2️⃣ "[Question]"
   WHY THEY ASK: [1 sentence]
   YOUR ANSWER: "[Complete answer]"

[Continue for questions 3, 4, 5]

───────────────────────────────────────────
3 SMART QUESTIONS FOR YOU TO ASK
───────────────────────────────────────────
1. "[Question showing you researched the company]"
2. "[Question about the role or team]"
3. "[Question about growth or success in the role]"

───────────────────────────────────────────
YOUR 3 KEY THEMES TO WEAVE IN
───────────────────────────────────────────
✓ [Theme 1 from their background that matches job needs]
✓ [Theme 2]
✓ [Theme 3]

RULES:
- Be SPECIFIC to THIS job and THIS applicant's actual experience
- Sample answers should be complete and ready to use
- Questions should reflect what this specific role/company would ask`,
            userInput: context
          })
        }),
        // THANK YOU NOTE
        fetch('/api/ops/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activityId: 'respond',
            mode: 'single',
            systemPrompt: `You are VERA. Write a COMPLETE, READY-TO-SEND THANK YOU EMAIL for this job applicant to send within 24 hours after their interview.

CRITICAL: Output ONLY the email itself. No explanations.

REQUIRED FORMAT:

Subject: Thank You — [Job Title] Interview

Dear [Interviewer's Name / Hiring Team],

[OPENING - 1-2 sentences: Thank them for their time today. Reference something specific discussed — include a placeholder like "[mention specific topic you discussed]" for them to personalize.]

[MIDDLE - 2 sentences: Reiterate your enthusiasm for THIS specific role. Briefly reinforce one key point about why you're a great fit.]

[CLOSE - 1 sentence: Express appreciation and confidence about next steps.]

Best regards,

[Applicant's Full Name]
[Phone Number]
[Email Address]

RULES:
- Include [placeholder] where applicant needs to add interview-specific details
- 4-5 sentences maximum in the body
- Grateful but confident — not desperate
- Ready to personalize and send immediately after interview`,
            userInput: context
          })
        })
      ]);

      const [resumeData, coverData, followUpData, interviewData, thankYouData] = await Promise.all([
        resumeRes.json(),
        coverRes.json(),
        followUpRes.json(),
        interviewRes.json(),
        thankYouRes.json()
      ]);

      // Check for errors in responses and set appropriate content
      const getContent = (data: { content?: string; response?: string; error?: string }, fallback: string) => {
        if (data.error) {
          console.error('API Error:', data.error);
          return `Error generating content: ${data.error}. Please try again.`;
        }
        return data.content || data.response || fallback;
      };

      setAppKitResumeOutput(getContent(resumeData, 'Resume generation failed. Please try again.'));
      setAppKitCoverLetterOutput(getContent(coverData, 'Cover letter generation failed. Please try again.'));
      setAppKitFollowUpOutput(getContent(followUpData, 'Application email generation failed. Please try again.'));
      setAppKitInterviewPrepOutput(getContent(interviewData, 'Interview prep generation failed. Please try again.'));
      setAppKitThankYouOutput(getContent(thankYouData, 'Thank you note generation failed. Please try again.'));
      setAppKitStage('results');
    } catch (error) {
      logError(error, { operation: 'appKitGenerate', activityId: 'appkit-orchestrator' });
      // Set error messages so user knows something went wrong
      setAppKitResumeOutput('Failed to generate Application Kit. Please check your connection and try again.');
      setAppKitStage('results');
    } finally {
      setAppKitGenerating(false);
    }
  }, [appKitJobDescription, appKitResume, appKitHighlights]);

  const getActiveContent = useCallback(() => {
    switch (appKitActiveTab) {
      case 'resume': return appKitResumeOutput;
      case 'cover': return appKitCoverLetterOutput;
      case 'followup': return appKitFollowUpOutput;
      case 'interview': return appKitInterviewPrepOutput;
      case 'thankyou': return appKitThankYouOutput;
      default: return appKitResumeOutput;
    }
  }, [appKitActiveTab, appKitResumeOutput, appKitCoverLetterOutput, appKitFollowUpOutput, appKitInterviewPrepOutput, appKitThankYouOutput]);

  return (
    <>
      <div style={{ width: '100%', animation: 'fadeIn 0.4s ease-out', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 860, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: colors.text }}>
              Application Kit
            </div>
            <div style={{ fontSize: 14, color: colors.textMuted }}>
              {appKitStage === 'input' 
                ? 'Paste the job. Paste your resume. Get everything you need to land it.'
                : 'Your complete job application toolkit is ready.'}
            </div>
          </div>

          {appKitStage === 'input' && (
            <>
              {/* JOB DESCRIPTION INPUT */}
              <div style={{
                width: '100%',
                padding: '18px',
                borderRadius: 12,
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  THE JOB
                </div>
                <p style={{ fontSize: 13, color: colors.textMuted, marginBottom: 12 }}>Paste the full job description</p>
                <textarea
                  value={appKitJobDescription}
                  onChange={(e) => setAppKitJobDescription(e.target.value)}
                  placeholder="Copy and paste the entire job posting here..."
                  rows={8}
                  className="input-field"
                  style={{
                    width: '100%',
                    padding: '18px 18px',
                    borderRadius: 12,
                    border: `1px solid ${colors.cardBorder}`,
                    background: colors.cardBg,
                    color: colors.text,
                    fontSize: 16,
                    lineHeight: 1.6,
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* RESUME INPUT */}
              <div style={{
                width: '100%',
                padding: '18px',
                borderRadius: 12,
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  YOUR BACKGROUND
                </div>
                <p style={{ fontSize: 13, color: colors.textMuted, marginBottom: 12 }}>Paste your current resume or describe your experience</p>
                <textarea
                  value={appKitResume}
                  onChange={(e) => setAppKitResume(e.target.value)}
                  placeholder="Your resume, work history, skills, achievements..."
                  rows={8}
                  className="input-field"
                  style={{
                    width: '100%',
                    padding: '18px 18px',
                    borderRadius: 12,
                    border: `1px solid ${colors.cardBorder}`,
                    background: colors.cardBg,
                    color: colors.text,
                    fontSize: 16,
                    lineHeight: 1.6,
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* OPTIONAL HIGHLIGHTS */}
              <div style={{
                width: '100%',
                padding: '18px',
                borderRadius: 12,
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  ANYTHING ELSE? (Optional)
                </div>
                <p style={{ fontSize: 13, color: colors.textMuted, marginBottom: 12 }}>Career change? Gaps to explain? Specific things to highlight?</p>
                <textarea
                  value={appKitHighlights}
                  onChange={(e) => setAppKitHighlights(e.target.value)}
                  placeholder="I'm transitioning from... / I want to emphasize... / I have a gap because..."
                  rows={4}
                  className="input-field"
                  style={{
                    width: '100%',
                    padding: '18px 18px',
                    borderRadius: 12,
                    border: `1px solid ${colors.cardBorder}`,
                    background: colors.cardBg,
                    color: colors.text,
                    fontSize: 16,
                    lineHeight: 1.6,
                    resize: 'vertical',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 12 }}>
                  <button
                    onClick={handleGenerate}
                    disabled={appKitGenerating || !appKitJobDescription.trim() || !appKitResume.trim()}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 8,
                      border: 'none',
                      background: appKitGenerating || !appKitJobDescription.trim() || !appKitResume.trim()
                        ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(140,110,80,0.2)')
                        : colors.accent,
                      color: appKitGenerating || !appKitJobDescription.trim() || !appKitResume.trim() ? colors.textMuted : 'white',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: appKitGenerating || !appKitJobDescription.trim() || !appKitResume.trim() ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {appKitGenerating ? 'Building Your Kit...' : 'Build My Application Kit'}
                  </button>
                </div>
              </div>
            </>
          )}

          {appKitStage === 'results' && (
            <>
              {/* TABS */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                {[
                  { id: 'resume', label: 'Resume' },
                  { id: 'cover', label: 'Cover Letter' },
                  { id: 'followup', label: 'Application Email' },
                  { id: 'interview', label: 'Interview Prep' },
                  { id: 'thankyou', label: 'Thank You Note' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setAppKitActiveTab(tab.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      fontWeight: 500,
                      transition: 'all 0.2s ease',
                      background: appKitActiveTab === tab.id ? colors.accent : colors.cardBg,
                      color: appKitActiveTab === tab.id ? '#fff' : colors.text,
                      border: `1px solid ${appKitActiveTab === tab.id ? colors.accent : colors.cardBorder}`,
                      cursor: 'pointer'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT */}
              <div style={{ background: colors.cardBg, borderRadius: 16, padding: 24, border: `1px solid ${colors.cardBorder}`, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 500, color: colors.text, margin: 0 }}>
                    {appKitActiveTab === 'resume' && 'Tailored Resume'}
                    {appKitActiveTab === 'cover' && 'Cover Letter'}
                    {appKitActiveTab === 'followup' && 'Application Email'}
                    {appKitActiveTab === 'interview' && 'Interview Prep'}
                    {appKitActiveTab === 'thankyou' && 'Thank You Note'}
                  </h2>
                  <button
                    onClick={() => handleCopy(getActiveContent())}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 12px',
                      fontSize: 13,
                      border: `1px solid ${colors.cardBorder}`,
                      borderRadius: 8,
                      background: 'transparent',
                      color: colors.text,
                      cursor: 'pointer'
                    }}
                  >
                    Copy
                  </button>
                </div>

                <div style={{ maxWidth: 'none' }}>
                  <FormattedOutput
                    content={getActiveContent()}
                    colors={colors}
                    isDark={isDark}
                  />
                </div>
              </div>

              {/* BOTTOM BUTTONS */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
                <button
                  onClick={handleReset}
                  style={{
                    padding: '8px 24px',
                    border: `1px solid ${isDark ? 'rgb(156 163 175)' : 'rgb(209 213 219)'}`,
                    borderRadius: 8,
                    background: 'transparent',
                    color: isDark ? 'rgb(209 213 219)' : 'rgb(75 85 99)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgb(251 191 36)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = isDark ? 'rgb(156 163 175)' : 'rgb(209 213 219)';
                  }}
                >
                  Start Over
                </button>
                <button
                  onClick={() => {
                    // Save functionality
                    alert('Kit saved!');
                  }}
                  style={{
                    padding: '8px 24px',
                    border: '1px solid rgb(245 158 11)',
                    color: 'rgb(245 158 11)',
                    borderRadius: 8,
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  Save Kit
                </button>
              </div>

              {/* DISCLAIMER */}
              <p style={{ textAlign: 'center', fontSize: 13, color: colors.textMuted }}>
                VERA helps you present your best self. Always review and personalize before sending.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default React.memo(AppKitOrchestrator);
