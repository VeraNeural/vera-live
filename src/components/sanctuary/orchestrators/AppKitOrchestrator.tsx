'use client';

import React, { useState, useCallback } from 'react';
import { FormattedOutput } from '@/lib/ops/components/FormattedOutput';
import type { AIProvider, GenerationMode } from '@/lib/ops/types';

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
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error('Failed to copy:', err);
    }
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
            systemPrompt: `You are VERA — a recruiting insider who's reviewed 10,000 resumes. You know what gets interviews and what gets trashed.

Create a TAILORED RESUME for this specific job. Rules:
- Match keywords from the job description NATURALLY (not keyword stuffing)
- Every bullet = Achievement + Action + Impact (numbers when possible)
- Lead with most relevant experience for THIS role
- Remove fluff, generic statements, and anything that doesn't serve THIS application
- ATS-friendly: simple formatting, standard section headers
- Keep it to 1-2 pages max

Format it cleanly. Output ONLY the resume content, ready to copy into a document.`,
            userMessage: context
          })
        }),
        // COVER LETTER
        fetch('/api/ops/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activityId: 'respond',
            systemPrompt: `You are VERA — a hiring manager who's read 10,000 cover letters. You can spot a template in 2 seconds.

Write a COVER LETTER that actually stands out. Rules:
- First line CANNOT be "I'm excited to apply..." — hook them immediately
- Show you understand THEIR needs, not just what you want
- One specific example proving you can do this job
- 3 paragraphs max — respect their time
- Clear closing with confidence (not desperation)
- Sound human, not corporate

Output ONLY the cover letter, ready to send.`,
            userMessage: context
          })
        }),
        // FOLLOW-UP EMAIL
        fetch('/api/ops/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activityId: 'respond',
            systemPrompt: `You are VERA. Write a FOLLOW-UP EMAIL to send 3-5 days after applying if they haven't heard back.

Rules:
- Subject line that gets opened (not "Following up on my application")
- 3-4 sentences MAX
- Add value — don't just "check in"
- Reference something specific about the role or company
- Professional but human
- Clear call to action

Output ONLY the email, ready to send.`,
            userMessage: context
          })
        }),
        // INTERVIEW PREP
        fetch('/api/ops/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activityId: 'respond',
            systemPrompt: `You are VERA — an interview coach who knows exactly what this company will ask based on the job description.

Create an INTERVIEW PREP guide:

**5 Questions They'll Likely Ask:**
For each question:
- The question
- Why they're asking it
- How to answer using THIS candidate's background
- A sample answer outline

**3 Smart Questions to Ask Them:**
Questions that show you've done your homework and are evaluating THEM too.

**Your Key Talking Points:**
The 3 things this candidate should emphasize in every answer to stand out.

**The "Tell Me About Yourself" Answer:**
A 60-second version tailored to this specific role.

Be specific to THIS job and THIS candidate's background.`,
            userMessage: context
          })
        }),
        // THANK YOU NOTE
        fetch('/api/ops/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activityId: 'respond',
            systemPrompt: `You are VERA. Write a THANK YOU EMAIL to send within 24 hours after an interview.

Rules:
- Send within 24 hours
- Reference [SPECIFIC TOPIC FROM INTERVIEW] — leave this as a placeholder they'll fill in
- Reiterate enthusiasm without sounding desperate
- Brief: 4-5 sentences
- End with confidence

Output ONLY the email template.`,
            userMessage: context
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

      setAppKitResumeOutput(resumeData.content || resumeData.response || '');
      setAppKitCoverLetterOutput(coverData.content || coverData.response || '');
      setAppKitFollowUpOutput(followUpData.content || followUpData.response || '');
      setAppKitInterviewPrepOutput(interviewData.content || interviewData.response || '');
      setAppKitThankYouOutput(thankYouData.content || thankYouData.response || '');
      setAppKitStage('results');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Error generating kit:', error);
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

export default AppKitOrchestrator;
