'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormattedOutput } from '@/lib/ops/components/FormattedOutput';
import { OpsIcon } from '@/lib/ops/icons';
import type { AIProvider, GenerationMode } from '@/lib/ops/types';

interface SavedOutput {
  id: string;
  space: string;
  timestamp: string;
  activityId: string;
  text: string;
}

interface ThinkingOrchestratorProps {
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

export function ThinkingOrchestrator({
  colors,
  isDark = false,
  inputBg,
  inputBorder,
  generationMode = 'single',
  selectedProvider = 'claude',
  selectedSpace = 'General',
}: ThinkingOrchestratorProps) {
  const router = useRouter();

  // Compute input styling
  const computedInputBg = inputBg || colors.cardBg;
  const computedInputBorder = inputBorder || colors.cardBorder;

  // Local state
  const [thinkingInput, setThinkingInput] = useState('');
  const [thinkingStage, setThinkingStage] = useState<'input' | 'clarify' | 'result'>('input');
  const [thinkingGenerating, setThinkingGenerating] = useState(false);
  const [thinkingDetectedMode, setThinkingDetectedMode] = useState<'thinking' | 'learning' | null>(null);
  const [thinkingClarifyQuestion, setThinkingClarifyQuestion] = useState('');
  const [thinkingClarifyOptions, setThinkingClarifyOptions] = useState<string[]>([]);
  const [thinkingClarifyInsight, setThinkingClarifyInsight] = useState('');
  const [thinkingUserChoice, setThinkingUserChoice] = useState('');
  const [thinkingCustomAnswer, setThinkingCustomAnswer] = useState('');
  const [thinkingAnalysisOutput, setThinkingAnalysisOutput] = useState<string | null>(null);
  const [thinkingActionOutput, setThinkingActionOutput] = useState<string | null>(null);
  const [showThinkingAnalysis, setShowThinkingAnalysis] = useState(false);
  const [thinkingDumpInput, setThinkingDumpInput] = useState('');
  const [thinkingSortedOutput, setThinkingSortedOutput] = useState('');
  const [thinkingSorting, setThinkingSorting] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saved' | 'error'>('idle');

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error('Failed to copy:', err);
    }
  }, []);

  const handleReset = useCallback(() => {
    setThinkingInput('');
    setThinkingAnalysisOutput(null);
    setThinkingActionOutput(null);
    setThinkingDumpInput('');
    setThinkingSortedOutput('');
    setThinkingSorting(false);
    setShowThinkingAnalysis(false);
    setThinkingStage('input');
    setThinkingClarifyQuestion('');
    setThinkingClarifyOptions([]);
    setThinkingClarifyInsight('');
    setThinkingUserChoice('');
    setThinkingCustomAnswer('');
    setThinkingDetectedMode(null);
  }, []);

  const handleInitialSubmit = useCallback(async () => {
    const input = thinkingInput.trim();
    if (!input) return;

    if (process.env.NODE_ENV === 'development') {
      console.log('[thinking-orchestrator] Help me think: start', { hasInput: !!input, provider: selectedProvider, mode: generationMode });
    }
    setThinkingGenerating(true);

    const detectPrompt = `You are VERA — a calm, brilliant mind who helps people think clearly and learn deeply. Someone just shared what's on their mind.

First, determine: Are they trying to THINK something through (decision, problem, weighing options) or LEARN something (understand a concept, study, grasp an idea)?

Respond with JSON only:
{
  "mode": "thinking" or "learning",
  "insight": "One sentence about what you sense they really need",
  "question": "A clarifying question to understand better",
  "options": ["Option 1", "Option 2", "Option 3 (optional)"]
}

Examples:
- "I can't decide if I should take this job" → mode: "thinking"
- "I don't understand how blockchain works" → mode: "learning"
- "I'm stuck on this problem at work" → could be either, ask to clarify`;

    try {
      const detectResponse = await fetch('/api/ops/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: detectPrompt,
          userInput: input,
          mode: generationMode,
          provider: selectedProvider,
          taskType: 'thinking-detect',
          activityId: 'thinking-detect',
        }),
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('[thinking-orchestrator] Help me think: response', { ok: detectResponse.ok, status: detectResponse.status });
      }

      let detectData: { content?: string; response?: string; error?: string } = {};
      try {
        detectData = await detectResponse.json();
      } catch (jsonErr) {
        if (process.env.NODE_ENV === 'development') console.error('[thinking-orchestrator] Help me think: response.json() failed', jsonErr);
        const rawText = await detectResponse.text().catch(() => '');
        detectData = { content: rawText };
      }

      if (!detectResponse.ok) {
        throw new Error(detectData?.error || 'Generation failed');
      }

      // Check if data.content exists and try to parse it as JSON
      const raw = (detectData?.content || detectData?.response || '').toString();
      let parsedContent: { mode?: string; question?: string; options?: string[]; insight?: string } = {};
      try {
        // Remove any markdown code blocks if present
        const cleanContent = raw.replace(/```json\n?|\n?```/g, '').trim();
        parsedContent = JSON.parse(cleanContent);
      } catch (parseError) {
        if (process.env.NODE_ENV === 'development') console.error('[thinking-orchestrator] Help me think: Failed to parse JSON', parseError, { raw });
        // Handle as plain text if JSON parsing fails
        parsedContent = { question: raw, options: [], insight: '' };
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[thinking-orchestrator] Help me think: parsedContent', parsedContent);
      }

      setThinkingDetectedMode((parsedContent?.mode as 'thinking' | 'learning') || 'thinking');
      setThinkingClarifyQuestion(parsedContent?.question || (raw ? raw : 'What would help you most right now?'));
      setThinkingClarifyOptions(Array.isArray(parsedContent?.options) ? parsedContent.options : []);
      setThinkingClarifyInsight(parsedContent?.insight || '');
      setThinkingStage('clarify');
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error('[thinking-orchestrator] Help me think: API error', err);
      setThinkingStage('result');
    } finally {
      setThinkingGenerating(false);
    }
  }, [thinkingInput, generationMode, selectedProvider]);

  const handleClarifyChoice = useCallback(async () => {
    const choice = thinkingCustomAnswer.trim() || thinkingUserChoice;
    if (!choice) return;

    if (process.env.NODE_ENV === 'development') {
      console.log('[thinking-orchestrator] Continue: start', { detectedMode: thinkingDetectedMode, hasChoice: !!choice });
    }
    setThinkingUserChoice(choice);
    setThinkingGenerating(true);
    setThinkingStage('result');
    setThinkingAnalysisOutput(null);
    setThinkingActionOutput(null);
    setThinkingDumpInput('');
    setThinkingSortedOutput('');

    const combinedInput = `${thinkingInput.trim()}\n\nWhen asked "${thinkingClarifyQuestion}", they answered: "${choice}"`;

    // Determine which prompt to use based on detected mode
    const isLearning = thinkingDetectedMode === 'learning' || choice.toLowerCase().includes('understand') || choice.toLowerCase().includes('learn');

    const thinkingModePrompt = `You are VERA — a strategic thinker with a chess player's mind. Calm, clear, sees 10 moves ahead. Someone needs help thinking through something.

**What I'm hearing:**
One sentence. Reflect back the core of what they're wrestling with.

**The angles you might not be seeing:**
2-3 perspectives or factors they may have overlooked. Not obvious stuff — the things that are easy to miss when you're in it.

**The real question:**
Often the stated question isn't the actual question. Name what this might really be about.

**A way to think about it:**
A framework, analogy, or way of looking at this that creates clarity. Not advice — a lens.

**If you had to decide right now:**
What would you lean toward and why? Not telling them what to do — showing them what their gut might already know.

Tone: Calm, clear, insightful. Like a brilliant friend who makes you think better.`;

    const learningModePrompt = `You are VERA — a brilliant tutor who makes complex things click. Patient but doesn't waste time. Actually excited about helping people understand.

**What you're trying to understand:**
One sentence. Reflect back what they want to learn.

**The simple version:**
Explain it like they're smart but new to this. No jargon. Use an analogy if it helps.

**Why it matters:**
Connect it to something real. Why should they care? What does this unlock?

**The key insight:**
The one thing that, once you get it, everything else makes sense.

**Want to go deeper?**
Offer to explain a specific part in more detail, give examples, or test their understanding.

Tone: Clear, engaging, zero condescension. Like the best teacher you ever had.`;

    const analysisPrompt = isLearning ? learningModePrompt : thinkingModePrompt;

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
          taskType: 'thinking-analysis',
          activityId: 'thinking-analysis',
        }),
      });

      let analysisData: { content?: string; error?: string } = {};
      try {
        analysisData = await analysisResponse.json();
      } catch (jsonErr) {
        if (process.env.NODE_ENV === 'development') console.error('[thinking-orchestrator] Continue: analysis response.json() failed', jsonErr);
        analysisData = { content: '' };
      }
      if (!analysisResponse.ok) throw new Error(analysisData?.error || 'Generation failed');

      const analysisText = analysisData?.content || '';
      setThinkingAnalysisOutput(analysisText);

      // SECOND CALL: Action / Next Step
      const actionPrompt = isLearning
        ? `You are VERA. Someone is trying to learn something. Based on the analysis, give them a concrete learning path.

**Your next step:**
One specific thing to do right now to deepen understanding. Be concrete — a resource, an exercise, a question to explore.

**The test:**
How will they know they really get it? Give them a way to check their understanding.

**If you want to go further:**
One path for going deeper once they've got the basics.

Tone: Encouraging, clear, actionable.`
        : `You are VERA. Someone is thinking through a decision or problem. Based on the analysis, help them move forward.

**Your next step:**
One specific thing to do right now to get unstuck. Not "think about it more" — something concrete.

**The check-in:**
How will they know if they're on the right track? Give them a signal to watch for.

**A question to sit with:**
Leave them with something to reflect on. Not advice — a question that opens up clarity.

Tone: Calm, empowering, grounded.`;

      const actionInput = `${combinedInput}\n\nContext from analysis:\n${analysisText}`;

      const actionResponse = await fetch('/api/ops/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: actionPrompt,
          userInput: actionInput,
          mode: generationMode,
          provider: selectedProvider,
          taskType: 'thinking-action',
          activityId: 'thinking-action',
        }),
      });

      let actionData: { content?: string; error?: string } = {};
      try {
        actionData = await actionResponse.json();
      } catch (jsonErr) {
        if (process.env.NODE_ENV === 'development') console.error('[thinking-orchestrator] Continue: action response.json() failed', jsonErr);
        actionData = { content: '' };
      }
      if (!actionResponse.ok) throw new Error(actionData?.error || 'Generation failed');

      setThinkingActionOutput(actionData?.content || '');
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error('[thinking-orchestrator] Continue: generation error', err);
      setThinkingAnalysisOutput('Something went wrong. Please try again.');
      setThinkingActionOutput('Something went wrong. Please try again.');
    } finally {
      setThinkingGenerating(false);
    }
  }, [thinkingInput, thinkingClarifyQuestion, thinkingUserChoice, thinkingCustomAnswer, thinkingDetectedMode, generationMode, selectedProvider]);

  const handleGoDeeper = useCallback(async () => {
    const dump = thinkingDumpInput.trim();
    if (!dump) return;

    setThinkingSorting(true);
    setThinkingSortedOutput('');

    const deeperPrompt = thinkingDetectedMode === 'learning'
      ? `You are VERA — a brilliant tutor going deeper on a topic. They want to understand something better.

**Let me clarify:**
Address their specific confusion directly.

**The key concept:**
Explain the core idea they're missing or struggling with.

**An analogy:**
Use a relatable comparison to make it click.

**Try this:**
Give them a way to test their understanding or apply what they learned.

**Still fuzzy?**
Offer to go even deeper on a specific part.

Be specific to their question. Make it click.`
      : `You are VERA — a strategic mind helping someone think through a decision. They just dumped all their considerations, fears, and factors.

**The core tension:**
Name the real conflict underneath all of this. What are they actually torn between? (Usually it's not the obvious thing)

**What I notice:**
Patterns in their thinking. Are they fear-driven? Overthinking? Missing something obvious? Being too logical and ignoring gut? Too emotional and ignoring reality?

**The question you're avoiding:**
There's usually one question they don't want to face. Name it gently.

**A reframe:**
Offer a different way to look at this that might unlock clarity.

**If I had to push you:**
What does their gut already know? Reflect it back to them.

Be specific to what they shared. Use their words.`;

    const deeperUserMessage = `${thinkingInput}\n\nTheir clarification: ${thinkingUserChoice}\n\nGoing deeper:\n${dump}`;

    try {
      const deeperResponse = await fetch('/api/ops/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: deeperPrompt,
          userInput: deeperUserMessage,
          mode: generationMode,
          provider: selectedProvider,
          taskType: 'thinking-analysis',
          activityId: 'thinking-analysis',
        }),
      });

      const deeperData = await deeperResponse.json();
      if (!deeperResponse.ok) throw new Error(deeperData.error || 'Generation failed');

      setThinkingSortedOutput(deeperData.content || '');
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error('Thinking go deeper error:', err);
      setThinkingSortedOutput('Something went wrong. Please try again.');
    } finally {
      setThinkingSorting(false);
    }
  }, [thinkingDumpInput, thinkingInput, thinkingUserChoice, thinkingDetectedMode, generationMode, selectedProvider]);

  const handleSave = useCallback(() => {
    if (!thinkingActionOutput) return;
    const title = 'Clear My Head - ' + (thinkingInput.trim().slice(0, 50) || 'Next Step');
    const saved: SavedOutput = {
      id: `${Date.now()}`,
      space: selectedSpace || 'General',
      timestamp: new Date().toISOString(),
      activityId: 'thinking-orchestrator',
      text: `${title}\n\n${thinkingActionOutput.trim()}`,
    };
    try {
      const key = 'vera.savedOutputs.v1';
      const existingRaw = localStorage.getItem(key);
      const existing: SavedOutput[] = existingRaw ? JSON.parse(existingRaw) : [];
      existing.unshift(saved);
      localStorage.setItem(key, JSON.stringify(existing));
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2000);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error('Save error:', err);
      setSaveState('error');
      setTimeout(() => setSaveState('idle'), 2000);
    }
  }, [thinkingActionOutput, thinkingInput, selectedSpace]);

  return (
    <>
      <div style={{ width: '100%', animation: 'fadeIn 0.4s ease-out', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 860, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: colors.text }}>
              Clear My Head
            </div>
            <div style={{ fontSize: 14, color: colors.textMuted }}>
              Clear your head. See all the angles. Make it click.
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
              What&apos;s On Your Mind
            </div>
            <textarea
              value={thinkingInput}
              onChange={(e) => setThinkingInput(e.target.value)}
              placeholder="I need to make a decision about... / I'm trying to understand... / I can't figure out..."
              rows={5}
              className="input-field"
              disabled={thinkingStage !== 'input'}
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
                opacity: thinkingStage !== 'input' ? 0.7 : 1,
              }}
            />
            {thinkingStage === 'input' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 12 }}>
                <button
                  onClick={handleInitialSubmit}
                  disabled={thinkingGenerating || !thinkingInput.trim()}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 8,
                    border: 'none',
                    background: thinkingGenerating || !thinkingInput.trim()
                      ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(140,110,80,0.2)')
                      : colors.accent,
                    color: thinkingGenerating || !thinkingInput.trim() ? colors.textMuted : 'white',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: thinkingGenerating || !thinkingInput.trim() ? 'not-allowed' : 'pointer',
                  }}
                >
                  {thinkingGenerating ? 'Working...' : 'Help me think'}
                </button>
              </div>
            )}
          </div>

          {/* SECTION TWO: CLARIFY */}
          {thinkingStage === 'clarify' && (
            <div style={{
              width: '100%',
              padding: '18px',
              borderRadius: 12,
              background: isDark ? 'rgba(194, 154, 108, 0.08)' : 'rgba(194, 154, 108, 0.1)',
              border: `1px solid ${isDark ? 'rgba(194, 154, 108, 0.2)' : 'rgba(194, 154, 108, 0.25)'}`,
            }}>
              {thinkingClarifyInsight && (
                <div style={{ fontSize: 13, color: colors.textMuted, marginBottom: 16, fontStyle: 'italic' }}>
                  {thinkingClarifyInsight}
                </div>
              )}
              <div style={{ fontSize: 16, color: colors.text, marginBottom: 16, fontWeight: 500 }}>
                {thinkingClarifyQuestion}
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                {thinkingClarifyOptions.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setThinkingUserChoice(option);
                      setThinkingCustomAnswer('');
                    }}
                    style={{
                      padding: '10px 16px',
                      borderRadius: 8,
                      border: thinkingUserChoice === option
                        ? `2px solid ${colors.accent}`
                        : `1px solid ${colors.cardBorder}`,
                      background: thinkingUserChoice === option
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
                  value={thinkingCustomAnswer}
                  onChange={(e) => {
                    setThinkingCustomAnswer(e.target.value);
                    if (e.target.value.trim()) setThinkingUserChoice('');
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
                  onClick={handleClarifyChoice}
                  disabled={thinkingGenerating || (!thinkingUserChoice && !thinkingCustomAnswer.trim())}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 8,
                    border: 'none',
                    background: (!thinkingUserChoice && !thinkingCustomAnswer.trim())
                      ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(140,110,80,0.2)')
                      : colors.accent,
                    color: (!thinkingUserChoice && !thinkingCustomAnswer.trim()) ? colors.textMuted : 'white',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: (!thinkingUserChoice && !thinkingCustomAnswer.trim()) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {thinkingGenerating ? 'Working...' : 'Continue'}
                </button>
              </div>
            </div>
          )}

          {/* SECTION THREE: ANALYSIS (collapsible) - only in result stage */}
          {thinkingStage === 'result' && thinkingAnalysisOutput && (
            <div style={{
              width: '100%',
              padding: '18px',
              borderRadius: 12,
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showThinkingAnalysis ? 12 : 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {thinkingDetectedMode === 'learning' ? 'The Breakdown' : 'The Analysis'}
                </div>
                <button
                  onClick={() => setShowThinkingAnalysis(!showThinkingAnalysis)}
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
                  {showThinkingAnalysis ? 'Hide' : 'Show'}
                </button>
              </div>
              {showThinkingAnalysis && (
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
                  <FormattedOutput content={thinkingAnalysisOutput} colors={colors} isDark={isDark} />
                </div>
              )}
            </div>
          )}

          {/* SECTION FOUR: YOUR NEXT STEP - only in result stage */}
          {thinkingStage === 'result' && (
            <div style={{
              width: '100%',
              padding: '18px',
              borderRadius: 12,
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {thinkingDetectedMode === 'learning' ? 'Your Learning Path' : 'Your Next Move'}
                </div>
                <button
                  onClick={() => handleCopy(thinkingActionOutput || '')}
                  disabled={!thinkingActionOutput}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: `1px solid ${colors.cardBorder}`,
                    background: colors.cardBg,
                    cursor: thinkingActionOutput ? 'pointer' : 'default',
                    fontSize: 12,
                    fontWeight: 500,
                    color: thinkingActionOutput ? colors.text : colors.textMuted,
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
                {thinkingGenerating && !thinkingActionOutput ? (
                  <div style={{ color: colors.textMuted, fontSize: 13 }}>Generating...</div>
                ) : thinkingActionOutput ? (
                  <FormattedOutput content={thinkingActionOutput} colors={colors} isDark={isDark} />
                ) : (
                  <div style={{ color: colors.textMuted, fontSize: 13 }}>Your next step will appear here.</div>
                )}
              </div>
            </div>
          )}

          {/* SECTION FIVE: GO DEEPER - only after both analysis and action outputs are ready */}
          {thinkingStage === 'result' && thinkingAnalysisOutput && thinkingActionOutput && (
            <div style={{
              width: '100%',
              padding: '18px',
              borderRadius: 12,
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  GO DEEPER
                </div>
                <button
                  onClick={() => handleCopy(thinkingSortedOutput || '')}
                  disabled={!thinkingSortedOutput}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: `1px solid ${colors.cardBorder}`,
                    background: colors.cardBg,
                    cursor: thinkingSortedOutput ? 'pointer' : 'default',
                    fontSize: 12,
                    fontWeight: 500,
                    color: thinkingSortedOutput ? colors.text : colors.textMuted,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <OpsIcon type="copy" color={colors.accent} />
                  Copy
                </button>
              </div>

              <div style={{ color: colors.text, fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
                {thinkingDetectedMode === 'learning'
                  ? "Want to go deeper? Tell me what's still fuzzy or what specific part you want to understand better."
                  : "Want to really think this through? Dump all the factors here — the pros, cons, fears, hopes, what-ifs. Everything that's weighing on this. I'll help you see the pattern."}
              </div>

              <textarea
                value={thinkingDumpInput}
                onChange={(e) => setThinkingDumpInput(e.target.value)}
                placeholder={
                  thinkingDetectedMode === 'learning'
                    ? "I still don't get the part about... / Can you explain more about..."
                    : "On one hand... but then... and I'm worried about... but I also want..."
                }
                rows={5}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 10,
                  border: `1px solid ${computedInputBorder}`,
                  background: computedInputBg,
                  color: colors.text,
                  fontSize: 14,
                  lineHeight: 1.6,
                  resize: 'vertical',
                  marginBottom: 12,
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
                <button
                  onClick={handleGoDeeper}
                  disabled={thinkingSorting || !thinkingDumpInput.trim()}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 8,
                    border: 'none',
                    background: thinkingSorting || !thinkingDumpInput.trim()
                      ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(140,110,80,0.2)')
                      : colors.accent,
                    color: thinkingSorting || !thinkingDumpInput.trim() ? colors.textMuted : 'white',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: thinkingSorting || !thinkingDumpInput.trim() ? 'not-allowed' : 'pointer',
                  }}
                >
                  {thinkingSorting ? 'Working...' : 'Go deeper'}
                </button>
              </div>

              {thinkingSortedOutput && (
                <div style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: 10,
                  background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${colors.cardBorder}`,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                    HERE&apos;S WHAT I SEE
                  </div>
                  <div className="output-area" style={{
                    color: colors.text,
                    fontSize: 14,
                    lineHeight: 1.6,
                    maxHeight: 320,
                    overflowY: 'auto',
                  }}>
                    <FormattedOutput content={thinkingSortedOutput} colors={colors} isDark={isDark} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ACTION BUTTONS - only in result stage */}
          {thinkingStage === 'result' && (
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
                onClick={() => handleCopy(thinkingActionOutput || '')}
                disabled={!thinkingActionOutput}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: 'none',
                  background: thinkingActionOutput ? colors.accent : colors.cardBorder,
                  color: thinkingActionOutput ? '#fff' : colors.textMuted,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: thinkingActionOutput ? 'pointer' : 'default',
                }}
              >
                Copy Response
              </button>
              <button
                onClick={handleSave}
                disabled={!thinkingActionOutput}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: '1px solid rgb(245 158 11)',
                  background: saveState === 'saved' ? 'rgb(245 158 11)' : 'transparent',
                  color: saveState === 'saved' ? 'white' : 'rgb(245 158 11)',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: thinkingActionOutput ? 'pointer' : 'default',
                  opacity: thinkingActionOutput ? 1 : 0.5,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (thinkingActionOutput && saveState === 'idle') {
                    e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (thinkingActionOutput && saveState === 'idle') {
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
            VERA is a thinking partner, not a substitute for professional expertise. Trust your own judgment.
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(ThinkingOrchestrator);