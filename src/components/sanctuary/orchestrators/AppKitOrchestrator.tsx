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
            systemPrompt: `You are VERA — an elite ATS-optimization expert and executive resume writer who has helped thousands land interviews at top companies.

Create a COMPLETE, READY-TO-USE, ATS-OPTIMIZED RESUME for this candidate targeting this specific job.

FORMAT (use this exact structure):
---
**[CANDIDATE NAME]**
[Email] | [Phone] | [LinkedIn] | [Location]

**PROFESSIONAL SUMMARY**
3-4 sentences highlighting most relevant experience for THIS role. Include key skills from the job description naturally.

**EXPERIENCE**
**[Job Title]** | [Company Name] | [Dates]
• Achievement-focused bullet (Action verb + What you did + Measurable result)
• Include 3-5 bullets per role
• Prioritize experience relevant to the target job

**SKILLS**
List technical and soft skills that match the job description keywords

**EDUCATION**
[Degree] | [School] | [Year]
---

Rules:
- Use the candidate's ACTUAL information from their background
- Match keywords from the job description NATURALLY
- Every bullet = Action + Result + Impact (numbers when possible)
- ATS-friendly: no tables, no graphics, standard headers
- Ready to copy-paste into a Word document

Output the complete resume now.`,
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
            systemPrompt: `You are VERA — a hiring manager who's read 10,000 cover letters and knows exactly what gets attention.

Write a COMPLETE, READY-TO-SEND COVER LETTER for this candidate targeting this specific job.

FORMAT (use this exact structure):
---
[Today's Date]

[Hiring Manager/Hiring Team]
[Company Name]
[Company Address if known, otherwise skip]

Dear [Hiring Manager/Hiring Team],

**Opening paragraph:** Hook them immediately. NO "I'm excited to apply..." Start with something specific about the company or role that shows you've done research. Then state the position you're applying for.

**Middle paragraph:** Your strongest qualification for THIS specific role. One concrete example with measurable results. Show you understand THEIR pain points and how you solve them.

**Closing paragraph:** Reiterate enthusiasm, state your availability, and include a confident call to action.

Sincerely,
[Candidate Name]
[Phone] | [Email]
---

Rules:
- Use the candidate's ACTUAL name and contact info
- Reference specific details from the job description
- 3 paragraphs maximum
- Professional but human tone
- Ready to copy-paste and send

Output the complete cover letter now.`,
            userInput: context
          })
        }),
        // FOLLOW-UP EMAIL
        fetch('/api/ops/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activityId: 'respond',
            mode: 'single',
            systemPrompt: `You are VERA. Write a COMPLETE, READY-TO-SEND FOLLOW-UP EMAIL for this candidate to send 3-5 days after applying.

FORMAT (use this exact structure):
---
**Subject:** [Compelling subject line - NOT "Following up on my application"]

Hi [Hiring Manager/Team],

[Opening: Reference your application for the specific role and add value - share a relevant article, insight, or brief update about your continued interest]

[Middle: One sentence connecting your skills to their needs]

[Close: Clear, confident call to action asking about next steps]

Best regards,
[Candidate Name]
[Phone] | [Email]
---

Rules:
- Subject line must be compelling and specific to the role/company
- 3-4 sentences maximum in the body
- Add VALUE, don't just "check in"
- Reference something specific about the role or company
- Professional but warm tone
- Ready to copy-paste into email

Output the complete follow-up email now.`,
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

Create a COMPLETE INTERVIEW PREP GUIDE for this candidate targeting this specific job.

FORMAT (use this exact structure):
---
## 🎯 Interview Prep Guide for [Job Title] at [Company]

### 5 Questions They'll Likely Ask

**1. [Question]**
- *Why they're asking:* [Explanation]
- *How to answer:* [Strategy using THIS candidate's background]
- *Sample answer:* "[Ready-to-use answer tailored to candidate]"

**2. [Question]**
[Same format...]

[Continue for all 5 questions]

### 3 Smart Questions to Ask Them
1. [Question that shows research] — *Why this works:* [explanation]
2. [Question about the role] — *Why this works:* [explanation]
3. [Question about growth] — *Why this works:* [explanation]

### Your Key Talking Points
These 3 themes should come up in EVERY answer:
1. **[Theme 1]:** [How to weave it in]
2. **[Theme 2]:** [How to weave it in]
3. **[Theme 3]:** [How to weave it in]

### Your "Tell Me About Yourself" (60 seconds)
"[Complete, ready-to-use script tailored to this role and candidate's background]"
---

Be SPECIFIC to THIS job description and THIS candidate's actual experience.

Output the complete interview prep guide now.`,
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
            systemPrompt: `You are VERA. Write a COMPLETE, READY-TO-SEND THANK YOU EMAIL for this candidate to send within 24 hours after an interview.

FORMAT (use this exact structure):
---
**Subject:** Thank You — [Job Title] Interview

Hi [Interviewer Name/Hiring Team],

[Opening: Thank them for their time and reference something SPECIFIC discussed in the interview — leave a placeholder like "[SPECIFIC TOPIC FROM YOUR INTERVIEW]" for them to fill in]

[Middle: Reiterate your enthusiasm for the role and briefly reinforce why you're a great fit, connecting to something discussed]

[Close: Express appreciation and confidence about moving forward]

Best regards,
[Candidate Name]
[Phone] | [Email]
---

Rules:
- Include placeholder [SPECIFIC TOPIC FROM YOUR INTERVIEW] for them to personalize
- 4-5 sentences maximum
- Enthusiastic but not desperate
- Reference the specific role and company
- Ready to copy, personalize the placeholder, and send

Output the complete thank you email now.`,
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
      setAppKitFollowUpOutput(getContent(followUpData, 'Follow-up email generation failed. Please try again.'));
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
              Paste the job. Paste your resume. Get everything you need to land it.
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
              {/* Results Header */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontSize: 24, fontWeight: 600, color: colors.text }}>
                  Application Kit
                </div>
                <div style={{ fontSize: 14, color: colors.textMuted }}>
                  Your complete job application toolkit is ready.
                </div>
              </div>

              {/* TABS */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                {[
                  { id: 'resume', label: 'Resume' },
                  { id: 'cover', label: 'Cover Letter' },
                  { id: 'followup', label: 'Follow-Up Email' },
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
                    {appKitActiveTab === 'followup' && 'Follow-Up Email'}
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
