'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormattedOutput } from '@/lib/ops/components/FormattedOutput';
import { OpsIcon } from '@/lib/ops/icons';
import type { AIProvider, GenerationMode } from '@/lib/ops/types';
import { logError, safeCopyToClipboard, handleApiResponse, DEFAULT_ERROR_MESSAGE, safeLocalStorage, safeJsonParse } from '../utils/errorHandler';

interface SavedOutput {
  id: string;
  space: string;
  timestamp: string;
  activityId: string;
  text: string;
}

interface WorkLifeOrchestratorProps {
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

export function WorkLifeOrchestrator({
  colors,
  isDark = false,
  inputBg,
  inputBorder,
  generationMode = 'single',
  selectedProvider = 'claude',
  selectedSpace = 'General',
}: WorkLifeOrchestratorProps) {
  const router = useRouter();
  
  // Compute input styling
  const computedInputBg = inputBg || colors.cardBg;
  const computedInputBorder = inputBorder || colors.cardBorder;

  // Local state for WorkLife UI
  const [workLifeInput, setWorkLifeInput] = useState('');
  const [workLifeStage, setWorkLifeStage] = useState<'input' | 'clarify' | 'result'>('input');
  const [workLifeGenerating, setWorkLifeGenerating] = useState(false);
  const [workLifeClarifyQuestion, setWorkLifeClarifyQuestion] = useState('');
  const [workLifeClarifyOptions, setWorkLifeClarifyOptions] = useState<string[]>([]);
  const [workLifeClarifyInsight, setWorkLifeClarifyInsight] = useState('');
  const [workLifeUserChoice, setWorkLifeUserChoice] = useState('');
  const [workLifeCustomAnswer, setWorkLifeCustomAnswer] = useState('');
  const [workLifeAnalysisOutput, setWorkLifeAnalysisOutput] = useState<string | null>(null);
  const [workLifeActionOutput, setWorkLifeActionOutput] = useState<string | null>(null);
  const [showWorkLifeAnalysis, setShowWorkLifeAnalysis] = useState(false);
  const [workLifeDumpStage, setWorkLifeDumpStage] = useState<'initial' | 'sorted'>('initial');
  const [workLifeDumpInput, setWorkLifeDumpInput] = useState('');
  const [workLifeSortedOutput, setWorkLifeSortedOutput] = useState<string | null>(null);
  const [workLifeSortedGenerating, setWorkLifeSortedGenerating] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saved' | 'error'>('idle');

  const handleCopy = useCallback(async (text: string) => {
    await safeCopyToClipboard(text);
  }, []);

  const handleReset = useCallback(() => {
    setWorkLifeInput('');
    setWorkLifeAnalysisOutput(null);
    setWorkLifeActionOutput(null);
    setShowWorkLifeAnalysis(false);
    setWorkLifeStage('input');
    setWorkLifeClarifyQuestion('');
    setWorkLifeClarifyOptions([]);
    setWorkLifeClarifyInsight('');
    setWorkLifeUserChoice('');
    setWorkLifeCustomAnswer('');
    setWorkLifeDumpStage('initial');
    setWorkLifeDumpInput('');
    setWorkLifeSortedOutput(null);
  }, []);

  const handleClarifySubmit = useCallback(async () => {
    const input = workLifeInput.trim();
    if (!input) return;

    setWorkLifeGenerating(true);

    const clarifyPrompt = `You are VERA. Someone just shared a work or life challenge. Before giving advice, you need to understand what's REALLY going on.

Your job: Ask ONE clarifying question that gets to the root of their struggle — not the task, but the feeling or pattern underneath.

Examples of good clarifying questions:
- 'Is the freeze coming from not knowing what to do, or from knowing exactly what to do but not wanting to face it?'
- 'Are you overwhelmed by how much there is, or by the fear of not doing it perfectly?'
- 'Is this about the task itself, or about what might happen (or not happen) when it's done?'

Format your response as JSON:
{
  "question": "Your clarifying question here",
  "options": ["Option 1", "Option 2", "Option 3 (optional)"],
  "insight": "One sentence about what you're sensing beneath their words"
}

Only return the JSON, nothing else.`;

    try {
      const clarifyResponse = await fetch('/api/ops/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: clarifyPrompt,
          userInput: input,
          mode: generationMode,
          provider: selectedProvider,
          taskType: 'worklife-clarify',
          activityId: 'worklife-clarify',
        }),
      });

      const clarifyData = await handleApiResponse(clarifyResponse) as { content?: string };

      const clarifyText = clarifyData.content || '';
      const parsed = safeJsonParse(
        clarifyText,
        {
          question: 'What feels most true about why you\'re stuck?',
          options: ['I don\'t know where to start', 'I\'m afraid of doing it wrong', 'I\'m avoiding something deeper'],
          insight: ''
        },
        { operation: 'workLifeClarifyParse', activityId: 'worklife-clarify' }
      );
      setWorkLifeClarifyQuestion(parsed.question || '');
      setWorkLifeClarifyOptions(parsed.options || []);
      setWorkLifeClarifyInsight(parsed.insight || '');
      setWorkLifeStage('clarify');
    } catch (err) {
      logError(err, { operation: 'workLifeClarify', activityId: 'worklife-clarify' });
      // Fallback to direct result if clarify fails
      setWorkLifeStage('result');
    } finally {
      setWorkLifeGenerating(false);
    }
  }, [workLifeInput, generationMode, selectedProvider]);

  const handleContinue = useCallback(async () => {
    const choice = workLifeCustomAnswer.trim() || workLifeUserChoice;
    if (!choice) return;

    setWorkLifeUserChoice(choice);
    setWorkLifeGenerating(true);
    setWorkLifeStage('result');
    setWorkLifeAnalysisOutput(null);
    setWorkLifeActionOutput(null);

    const combinedInput = `${workLifeInput.trim()}\n\nWhen asked "${workLifeClarifyQuestion}", they answered: "${choice}"`;

    const analysisPrompt = `You are VERA — a wise, calm guide who helps people get unstuck with work and life challenges. Someone is sharing what's overwhelming them. They've also answered a clarifying question about what's really going on.

Respond with ALL sections below. Use the exact headers:

**What I'm hearing:**
One sentence. Reflect back what they're dealing with — show them you understand. Incorporate their clarifying answer.

**Why you might be stuck:**
2-3 sentences. Name the nervous system pattern humanly. Is it overwhelm? Decision fatigue? Fear of getting it wrong? Avoidance? Normalize it. Example: 'When everything feels equally urgent, your brain can't prioritize — so it freezes. That's not laziness. That's overwhelm.'

**What's actually true:**
2-3 sentences. Ground them in reality. Cut through the catastrophizing. Example: 'You don't have to do everything today. You have to do ONE thing. The rest can wait.'

**What might help:**
1-2 sentences. A gentle internal check-in or permission. Example: 'What would feel like a win today, even if it's small?'

Tone: Warm, wise, human. Never clinical. Never a lecture.`;

    try {
      // FIRST CALL: Analysis
      const analysisResponse = await fetch('/api/ops/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: analysisPrompt,
          userInput: combinedInput,
          mode: generationMode,
          provider: selectedProvider,
          taskType: 'worklife-analysis',
          activityId: 'worklife-analysis',
        }),
      });

      const analysisData = await handleApiResponse(analysisResponse) as { content?: string };

      const analysisText = analysisData.content || '';
      setWorkLifeAnalysisOutput(analysisText);

      // SECOND CALL: Action
      const actionPrompt = `You are VERA. Someone just shared what's overwhelming them about work or life, and they clarified what's really going on. Your job is to give them ONE specific, concrete, doable action — not vague advice.

Rules:
- Be SPECIFIC. Not 'write down your tasks' but 'Open a notes app right now and type the first 3 things that come to mind when you think about what's stressing you.'
- Be IMMEDIATE. Something they can do in the next 5 minutes.
- Be SMALL. The smaller the better. Momentum matters more than magnitude.
- NEVER tell them to 'prioritize' or 'organize' — that's the problem, not the solution.
- Use their clarifying answer to tailor the action to what's really blocking them.

Format:

**Do this right now:**
[One specific action they can take in the next 5 minutes. Be concrete — include exactly what to do, not concepts.]

**Why this works:**
[One sentence — connect it to breaking the freeze/overwhelm and their specific blocker]

**Then, if you want:**
[One optional follow-up step, or offer to help them go deeper: 'Tell me what those 3 things are and I'll help you pick which one to tackle first.']

Tone: Direct, warm, actionable. Like a friend who cuts through the noise and tells you exactly what to do next.`;

      const actionInput = `${combinedInput}\n\nContext from analysis:\n${analysisText}`;

      const actionResponse = await fetch('/api/ops/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: actionPrompt,
          userInput: actionInput,
          mode: generationMode,
          provider: selectedProvider,
          taskType: 'worklife-action',
          activityId: 'worklife-action',
        }),
      });

      const actionData = await handleApiResponse(actionResponse) as { content?: string };

      setWorkLifeActionOutput(actionData.content || '');
    } catch (err) {
      logError(err, { operation: 'workLifeContinue', activityId: 'worklife-action' });
      setWorkLifeAnalysisOutput(DEFAULT_ERROR_MESSAGE);
      setWorkLifeActionOutput(DEFAULT_ERROR_MESSAGE);
    } finally {
      setWorkLifeGenerating(false);
    }
  }, [workLifeInput, workLifeUserChoice, workLifeCustomAnswer, workLifeClarifyQuestion, generationMode, selectedProvider]);

  const handleSortList = useCallback(async () => {
    if (!workLifeDumpInput.trim()) return;
    setWorkLifeSortedGenerating(true);
    setWorkLifeSortedOutput(null);

    const sortPrompt = `You are VERA. Someone just dumped their overwhelming list of tasks/worries. Your job is to ACTUALLY SORT IT for them — not give generic advice.

Look at their specific items and categorize them:

**What I see:**
Count the items. Group any that are actually part of the same project. Call out what you notice.

**Not yours to do right now:**
Any items that are waiting on someone else, or aren't actually actionable today. If none, say "Everything here is on you — no waiting on others."

**Quick wins (under 5 min):**
Small tasks they can knock out fast to build momentum. Be specific — use their words.

**The real one:**
Identify the ONE thing that's probably causing the most mental weight — name it specifically from their list.

**Your move:**
Tell them exactly what to do first. Be specific: "Do [specific item] right now. It'll take [X] minutes. Then come back and we'll tackle [the real one]."

Be SPECIFIC to their actual list. Use their exact words. Name their items. Don't be generic.`;

    try {
      const res = await fetch('/api/ops/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId: 'worklife-sorted',
          systemPrompt: sortPrompt,
          userInput: workLifeDumpInput.trim(),
          selectedModel: 'claude-3-5-sonnet-20241022',
          space: selectedSpace,
        }),
      });
      
      if (!res.ok) {
        setWorkLifeSortedOutput(`API error: ${res.status}. Try again.`);
        setWorkLifeDumpStage('sorted');
        return;
      }
      
      const data = await res.json();
      const sortedContent = data.content || data.response || data.result || data.text || '';
      
      if (sortedContent) {
        setWorkLifeSortedOutput(sortedContent);
        setWorkLifeDumpStage('sorted');
      } else {
        setWorkLifeSortedOutput('No response received. Please try again.');
        setWorkLifeDumpStage('sorted');
      }
    } catch (err) {
      logError(err, { operation: 'sortList', activityId: 'worklife-sorted' });
      setWorkLifeSortedOutput(DEFAULT_ERROR_MESSAGE);
      setWorkLifeDumpStage('sorted');
    } finally {
      setWorkLifeSortedGenerating(false);
    }
  }, [workLifeDumpInput, selectedSpace]);

  const handleSave = useCallback(() => {
    if (!workLifeActionOutput) return;
    const title = 'Work & Life - ' + (workLifeInput.trim().slice(0, 50) || 'Next Step');
    const saved: SavedOutput = {
      id: `${Date.now()}`,
      space: selectedSpace || 'General',
      timestamp: new Date().toISOString(),
      activityId: 'worklife-orchestrator',
      text: `${title}\n\n${workLifeActionOutput.trim()}`,
    };
    try {
      const key = 'vera.savedOutputs.v1';
      const existing: SavedOutput[] = safeLocalStorage<SavedOutput[]>('get', key) || [];
      existing.unshift(saved);
      safeLocalStorage('set', key, existing);
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2000);
    } catch (err) {
      logError(err, { operation: 'saveOutput', activityId: 'worklife-action' });
      setSaveState('error');
      setTimeout(() => setSaveState('idle'), 2000);
    }
  }, [workLifeActionOutput, workLifeInput, selectedSpace]);

  return (
    <>
      <div style={{ width: '100%', animation: 'fadeIn 0.4s ease-out', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 860, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: colors.text }}>
              Get Unstuck
            </div>
            <div style={{ fontSize: 14, color: colors.textMuted }}>
              Too much in your head? Let's sort it out together.
            </div>
          </div>

          {/* SECTION ONE: INPUT */}
          <div style={{
            width: '100%',
            padding: '18px',
            borderRadius: 12,
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              What's Going On
            </div>
            <textarea
              value={workLifeInput}
              onChange={(e) => setWorkLifeInput(e.target.value)}
              placeholder="I have too much to do... / I can't decide... / I have a meeting coming up..."
              rows={5}
              className="input-field"
              disabled={workLifeStage !== 'input'}
              style={{
                width: '100%',
                padding: '18px 18px',
                borderRadius: 12,
                border: `1px solid ${computedInputBorder}`,
                background: computedInputBg,
                color: colors.text,
                fontSize: 16,
                lineHeight: 1.6,
                resize: 'vertical',
                opacity: workLifeStage !== 'input' ? 0.7 : 1,
              }}
            />
            {workLifeStage === 'input' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 12 }}>
                <button
                  onClick={handleClarifySubmit}
                  disabled={workLifeGenerating || !workLifeInput.trim()}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 8,
                    border: 'none',
                    background: workLifeGenerating || !workLifeInput.trim()
                      ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(140,110,80,0.2)')
                      : colors.accent,
                    color: workLifeGenerating || !workLifeInput.trim() ? colors.textMuted : 'white',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: workLifeGenerating || !workLifeInput.trim() ? 'not-allowed' : 'pointer',
                  }}
                >
                  {workLifeGenerating ? 'Working...' : 'Help me with this'}
                </button>
              </div>
            )}
          </div>

          {/* SECTION TWO: CLARIFY */}
          {workLifeStage === 'clarify' && (
            <div style={{
              width: '100%',
              padding: '18px',
              borderRadius: 12,
              background: isDark ? 'rgba(194, 154, 108, 0.08)' : 'rgba(194, 154, 108, 0.1)',
              border: `1px solid ${isDark ? 'rgba(194, 154, 108, 0.2)' : 'rgba(194, 154, 108, 0.25)'}`,
            }}>
              {workLifeClarifyInsight && (
                <div style={{ fontSize: 13, color: colors.textMuted, marginBottom: 16, fontStyle: 'italic' }}>
                  {workLifeClarifyInsight}
                </div>
              )}
              <div style={{ fontSize: 16, color: colors.text, marginBottom: 16, fontWeight: 500 }}>
                {workLifeClarifyQuestion}
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                {workLifeClarifyOptions.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setWorkLifeUserChoice(option);
                      setWorkLifeCustomAnswer('');
                    }}
                    style={{
                      padding: '10px 16px',
                      borderRadius: 8,
                      border: workLifeUserChoice === option
                        ? `2px solid ${colors.accent}`
                        : `1px solid ${colors.cardBorder}`,
                      background: workLifeUserChoice === option
                        ? (isDark ? 'rgba(194, 154, 108, 0.15)' : 'rgba(194, 154, 108, 0.12)')
                        : colors.cardBg,
                      color: colors.text,
                      fontSize: 14,
                      cursor: 'pointer',
                      flex: '1 1 auto',
                      minWidth: 140,
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div style={{ marginBottom: 16 }}>
                <input
                  type="text"
                  value={workLifeCustomAnswer}
                  onChange={(e) => {
                    setWorkLifeCustomAnswer(e.target.value);
                    if (e.target.value.trim()) setWorkLifeUserChoice('');
                  }}
                  placeholder="Or tell me in your own words..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: `1px solid ${computedInputBorder}`,
                    background: computedInputBg,
                    color: colors.text,
                    fontSize: 14,
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleContinue}
                  disabled={workLifeGenerating || (!workLifeUserChoice && !workLifeCustomAnswer.trim())}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 8,
                    border: 'none',
                    background: (!workLifeUserChoice && !workLifeCustomAnswer.trim())
                      ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(140,110,80,0.2)')
                      : colors.accent,
                    color: (!workLifeUserChoice && !workLifeCustomAnswer.trim()) ? colors.textMuted : 'white',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: (!workLifeUserChoice && !workLifeCustomAnswer.trim()) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {workLifeGenerating ? 'Working...' : 'Continue'}
                </button>
              </div>
            </div>
          )}

          {/* SECTION THREE: ANALYSIS (collapsible) - only in result stage */}
          {workLifeStage === 'result' && workLifeAnalysisOutput && (
            <div style={{
              width: '100%',
              padding: '18px',
              borderRadius: 12,
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showWorkLifeAnalysis ? 12 : 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Analysis
                </div>
                <button
                  onClick={() => setShowWorkLifeAnalysis(!showWorkLifeAnalysis)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: `1px solid ${colors.cardBorder}`,
                    background: 'transparent',
                    color: colors.textMuted,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {showWorkLifeAnalysis ? 'Hide' : 'Show'}
                </button>
              </div>
              {showWorkLifeAnalysis && (
                <div className="output-area" style={{
                  padding: '16px',
                  background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                  borderRadius: 10,
                  color: colors.text,
                  fontSize: 14,
                  lineHeight: 1.6,
                  maxHeight: 350,
                  overflowY: 'auto',
                }}>
                  <FormattedOutput content={workLifeAnalysisOutput} colors={colors} isDark={isDark} />
                </div>
              )}
            </div>
          )}

          {/* SECTION FOUR: YOUR NEXT STEP - only in result stage */}
          {workLifeStage === 'result' && (
            <div style={{
              width: '100%',
              padding: '18px',
              borderRadius: 12,
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Your Next Step
                </div>
                <button
                  onClick={() => handleCopy(workLifeActionOutput || '')}
                  disabled={!workLifeActionOutput}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: `1px solid ${colors.cardBorder}`,
                    background: colors.cardBg,
                    cursor: workLifeActionOutput ? 'pointer' : 'default',
                    fontSize: 12,
                    fontWeight: 500,
                    color: workLifeActionOutput ? colors.text : colors.textMuted,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <OpsIcon type="copy" color={colors.accent} />
                  Copy
                </button>
              </div>
              <div className="output-area" style={{
                padding: '20px',
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: 10,
                minHeight: 120,
                maxHeight: 300,
                overflowY: 'auto',
                color: colors.text,
                fontSize: 14,
                lineHeight: 1.6,
              }}>
                {workLifeGenerating && !workLifeActionOutput ? (
                  <div style={{ color: colors.textMuted, fontSize: 13 }}>Generating...</div>
                ) : workLifeActionOutput ? (
                  <FormattedOutput content={workLifeActionOutput} colors={colors} isDark={isDark} />
                ) : (
                  <div style={{ color: colors.textMuted, fontSize: 13 }}>Your next step will appear here.</div>
                )}
              </div>
            </div>
          )}

          {/* SECTION FIVE: GO DEEPER - only in result stage */}
          {workLifeStage === 'result' && !workLifeGenerating && workLifeActionOutput && workLifeDumpStage === 'initial' && (
            <div style={{
              width: '100%',
              padding: '18px',
              borderRadius: 12,
              background: isDark ? 'rgba(194, 154, 108, 0.08)' : 'rgba(194, 154, 108, 0.06)',
              border: `1px solid ${isDark ? 'rgba(194, 154, 108, 0.2)' : 'rgba(194, 154, 108, 0.15)'}`,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: colors.accent, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                Go Deeper
              </div>
              <div style={{ fontSize: 14, color: colors.text, marginBottom: 16, lineHeight: 1.6 }}>
                Want me to actually help? Dump your entire task list here — every email, errand, deadline, &quot;should do&quot;, and mental note. I&apos;ll sort it for you.
              </div>
              <textarea
                value={workLifeDumpInput}
                onChange={(e) => setWorkLifeDumpInput(e.target.value)}
                placeholder="Respond to Sarah's email, finish Q3 report, pick up dry cleaning, call mom back, schedule dentist, review that proposal, buy birthday gift, pay bills, update LinkedIn, fix leaky faucet..."
                style={{
                  width: '100%',
                  minHeight: 140,
                  padding: '14px',
                  borderRadius: 10,
                  border: `1px solid ${computedInputBorder}`,
                  background: computedInputBg,
                  color: colors.text,
                  fontSize: 14,
                  lineHeight: 1.6,
                  resize: 'vertical',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <button
                  onClick={handleSortList}
                  disabled={!workLifeDumpInput.trim() || workLifeSortedGenerating}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 8,
                    border: 'none',
                    background: (!workLifeDumpInput.trim() || workLifeSortedGenerating)
                      ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(140,110,80,0.2)')
                      : colors.accent,
                    color: (!workLifeDumpInput.trim() || workLifeSortedGenerating) ? colors.textMuted : 'white',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: (!workLifeDumpInput.trim() || workLifeSortedGenerating) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {workLifeSortedGenerating ? 'Sorting...' : 'Sort this for me'}
                </button>
              </div>
            </div>
          )}

          {/* SECTION SIX: SORTED OUTPUT - only after sorting */}
          {workLifeStage === 'result' && workLifeDumpStage === 'sorted' && workLifeSortedOutput && (
            <div style={{
              width: '100%',
              padding: '18px',
              borderRadius: 12,
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: colors.accent, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Here&apos;s What I See
                </div>
                <button
                  onClick={() => handleCopy(workLifeSortedOutput || '')}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: `1px solid ${colors.cardBorder}`,
                    background: colors.cardBg,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 500,
                    color: colors.text,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <OpsIcon type="copy" color={colors.accent} />
                  Copy
                </button>
              </div>
              <div className="output-area" style={{
                padding: '20px',
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                borderRadius: 10,
                color: colors.text,
                fontSize: 14,
                lineHeight: 1.7,
                maxHeight: 450,
                overflowY: 'auto',
              }}>
                <FormattedOutput content={workLifeSortedOutput} colors={colors} isDark={isDark} />
              </div>
            </div>
          )}

          {/* ACTION BUTTONS - only in result stage */}
          {workLifeStage === 'result' && (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={handleReset}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: `1px solid ${isDark ? 'rgb(156 163 175)' : 'rgb(209 213 219)'}`,
                  background: 'transparent',
                  color: isDark ? 'rgb(209 213 219)' : 'rgb(75 85 99)',
                  fontSize: 14,
                  fontWeight: 500,
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
                onClick={async () => {
                  if (workLifeActionOutput) {
                    try {
                      await navigator.clipboard.writeText(workLifeActionOutput);
                    } catch (err) {
                      console.error('Failed to copy:', err);
                    }
                  }
                }}
                disabled={!workLifeActionOutput}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: 'none',
                  background: workLifeActionOutput ? 'rgb(217 119 6)' : (isDark ? 'rgb(55 65 81)' : 'rgb(229 231 235)'),
                  color: workLifeActionOutput ? 'white' : (isDark ? 'rgb(156 163 175)' : 'rgb(107 114 128)'),
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: workLifeActionOutput ? 'pointer' : 'default',
                  boxShadow: workLifeActionOutput ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (workLifeActionOutput) {
                    e.currentTarget.style.background = 'rgb(180 83 9)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (workLifeActionOutput) {
                    e.currentTarget.style.background = 'rgb(217 119 6)';
                  }
                }}
              >
                Copy Response
              </button>
              <button
                onClick={handleSave}
                disabled={!workLifeActionOutput}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: '1px solid rgb(245 158 11)',
                  background: saveState === 'saved' ? 'rgb(245 158 11)' : 'transparent',
                  color: saveState === 'saved' ? 'white' : 'rgb(245 158 11)',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: workLifeActionOutput ? 'pointer' : 'default',
                  opacity: workLifeActionOutput ? 1 : 0.5,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (workLifeActionOutput && saveState === 'idle') {
                    e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (workLifeActionOutput && saveState === 'idle') {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {saveState === 'saved' ? 'Saved!' : saveState === 'error' ? 'Error' : 'Save'}
              </button>
              <button
                onClick={() => router.push('/sanctuary')}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: '1px solid rgb(251 191 36)',
                  background: 'transparent',
                  color: 'rgb(251 191 36)',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(251, 191, 36, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Talk to VERA
              </button>
            </div>
          )}

          {/* DISCLAIMER */}
          <div style={{
            textAlign: 'center',
            marginTop: 24,
            fontSize: 11,
            color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(60,50,45,0.4)',
            lineHeight: 1.5,
          }}>
            VERA is a decision-support tool, not a substitute for professional advice. Trust your own judgment and seek professional help when needed.
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(WorkLifeOrchestrator);
