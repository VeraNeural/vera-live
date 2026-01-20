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

interface WellnessOrchestratorProps {
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

export function WellnessOrchestrator({
  colors,
  isDark = false,
  inputBg,
  inputBorder,
  generationMode = 'single',
  selectedProvider = 'claude',
  selectedSpace = 'General',
}: WellnessOrchestratorProps) {
  const router = useRouter();
  
  // Compute input styling
  const computedInputBg = inputBg || colors.cardBg;
  const computedInputBorder = inputBorder || colors.cardBorder;

  // Local state for wellness UI
  const [wellnessInput, setWellnessInput] = useState('');
  const [wellnessStage, setWellnessStage] = useState<'input' | 'clarify' | 'result'>('input');
  const [wellnessGenerating, setWellnessGenerating] = useState(false);
  const [wellnessMode, setWellnessMode] = useState<'relationship' | 'self-care' | null>(null);
  const [wellnessClarifyQuestion, setWellnessClarifyQuestion] = useState('');
  const [wellnessClarifyOptions, setWellnessClarifyOptions] = useState<string[]>([]);
  const [wellnessClarifyInsight, setWellnessClarifyInsight] = useState('');
  const [wellnessUserChoice, setWellnessUserChoice] = useState('');
  const [wellnessCustomAnswer, setWellnessCustomAnswer] = useState('');
  const [wellnessAnalysisOutput, setWellnessAnalysisOutput] = useState<string | null>(null);
  const [wellnessActionOutput, setWellnessActionOutput] = useState<string | null>(null);
  const [showWellnessAnalysis, setShowWellnessAnalysis] = useState(false);
  const [wellnessDumpInput, setWellnessDumpInput] = useState('');
  const [wellnessSortedOutput, setWellnessSortedOutput] = useState<string | null>(null);
  const [wellnessSorting, setWellnessSorting] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saved' | 'error'>('idle');

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error('Failed to copy:', err);
    }
  }, []);

  const handleReset = useCallback(() => {
    setWellnessInput('');
    setWellnessAnalysisOutput(null);
    setWellnessActionOutput(null);
    setShowWellnessAnalysis(false);
    setWellnessMode(null);
    setWellnessUserChoice('');
    setWellnessClarifyQuestion('');
    setWellnessClarifyOptions([]);
    setWellnessStage('input');
    setWellnessClarifyInsight('');
    setWellnessCustomAnswer('');
    setWellnessDumpInput('');
    setWellnessSortedOutput(null);
  }, []);

  const handleInitialSubmit = useCallback(async () => {
    if (!wellnessInput.trim()) return;
    setWellnessGenerating(true);
    
    try {
      const response = await fetch('/api/ops/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: `You are VERA — that Aquarius friend who saw this coming. Someone's checking in about life stuff.

They said: ${wellnessInput.trim()}

First, figure out if this is RELATIONSHIP (about a person/conflict/dynamic) or SELF-CARE (about habits/stress/taking care of themselves).

Respond in EXACTLY this format:

MODE: relationship OR self-care
INSIGHT: [One knowing sentence — you've seen this before]
QUESTION: [A specific clarifying question]
OPTION1: [Specific to their situation]
OPTION2: [Specific to their situation]
OPTION3: [Something else / broader option]

Be warm but real. Aquarius friend energy — you love them but you're not going to pretend you didn't see this coming.`,
          userInput: wellnessInput,
          mode: generationMode,
          provider: selectedProvider,
          taskType: 'respond',
          activityId: 'respond',
        })
      });
      
      const data = await response.json();
      if (process.env.NODE_ENV === 'development') {
        console.log('Raw API response:', data);
        console.log('Content:', data.content || data.response);
      }
      
      const content = data.content || data.response || '';
      
      try {
        const modeMatch = content.match(/MODE:\s*(relationship|self-care)/i);
        const insightMatch = content.match(/INSIGHT:\s*([^\n]+)/i);
        const questionMatch = content.match(/QUESTION:\s*([^\n]+)/i);
        const option1Match = content.match(/OPTION1:\s*([^\n]+)/i);
        const option2Match = content.match(/OPTION2:\s*([^\n]+)/i);
        const option3Match = content.match(/OPTION3:\s*([^\n]+)/i);
        
        const mode = modeMatch ? modeMatch[1].toLowerCase() as 'relationship' | 'self-care' : 'relationship';
        const insight = insightMatch ? insightMatch[1].trim() : '';
        const question = questionMatch ? questionMatch[1].trim() : 'Tell me more about what\'s going on.';
        const options = [
          option1Match ? option1Match[1].trim() : 'Tell me more',
          option2Match ? option2Match[1].trim() : 'Help me process this',
          option3Match ? option3Match[1].trim() : 'I need practical advice'
        ].filter(Boolean);
        
        setWellnessMode(mode);
        setWellnessClarifyQuestion(insight ? insight + '\n\n' + question : question);
        setWellnessClarifyOptions(options);
        setWellnessClarifyInsight(insight);
        setWellnessStage('clarify');
      } catch (parseError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Structured text parse error:', parseError);
          console.error('Failed to parse content:', content);
        }
        // Fallback: show the raw content
        setWellnessClarifyQuestion(content || 'What\'s the heart of what\'s going on?');
        setWellnessClarifyOptions(['Tell me more', 'Help me process this', 'I need practical advice']);
        setWellnessMode('self-care');
        setWellnessClarifyInsight('');
        setWellnessStage('clarify');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('API error:', error);
      // Fallback to clarify stage with basic options
      setWellnessClarifyQuestion('What\'s the heart of what\'s going on?');
      setWellnessClarifyOptions(['Tell me more', 'Help me process this', 'I need practical advice']);
      setWellnessMode('self-care');
      setWellnessClarifyInsight('');
      setWellnessStage('clarify');
    } finally {
      setWellnessGenerating(false);
    }
  }, [wellnessInput, generationMode, selectedProvider]);

  const handleClarifyChoice = useCallback(async (choice: string) => {
    setWellnessUserChoice(choice);
    setWellnessGenerating(true);
    setWellnessAnalysisOutput(null);
    setWellnessActionOutput(null);

    const isRelationship = wellnessMode === 'relationship';
    const analysisPrompt = isRelationship
      ? `You are VERA — that Aquarius friend who's seen this pattern in their life before.

They're dealing with: ${wellnessInput.trim()}
They clarified: ${choice}

Give them the ANALYSIS only (the action comes separately):

**What I see:**
One sentence — reflect back what's actually happening, not what they're telling themselves.

**The pattern:**
2-3 sentences. You've watched them do this. Name the dynamic — is it the same type of conflict? The same dance? Call it out with love.

**The part you might not want to see:**
Gently name what they might be contributing. Not blame — just reality.

Be warm but honest. Aquarius friend after two glasses of wine.`
      : `You are VERA — that friend who has their life together but doesn't judge you for struggling.

They're dealing with: ${wellnessInput.trim()}
They clarified: ${choice}

Give them the ANALYSIS only:

**What I see:**
One sentence — what's actually going on, not the excuse.

**Why this keeps happening:**
2-3 sentences. Not the surface reason. The real one — perfectionism? Self-worth? Exhaustion?

**The lie you're telling yourself:**
Call out the unhelpful story. 'I should be able to...' / 'Everyone else can...' Be funny about it.

Be real but kind. No toxic positivity.`;

    const userMessage = `${wellnessInput.trim()}\n\nWhen asked "${wellnessClarifyQuestion}", they answered: "${choice}"`;

    try {
      // ANALYSIS CALL
      const analysisResponse = await fetch('/api/ops/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: analysisPrompt,
          userInput: userMessage,
          mode: generationMode,
          provider: selectedProvider,
          taskType: 'respond',
          activityId: 'respond',
        }),
      });

      let analysisData: { content?: string; error?: string } = {};
      try {
        analysisData = await analysisResponse.json();
      } catch {
        analysisData = { content: '' };
      }
      if (!analysisResponse.ok) throw new Error(analysisData?.error || 'Generation failed');

      setWellnessAnalysisOutput(analysisData?.content || '');

      // ACTION CALL
      const actionPrompt = isRelationship
        ? `You are VERA. Based on the relationship situation, give ONE specific next step.

**Your one move:**
Something specific and doable. Not 'communicate better' — a real action they can take this week.

**Why this might help:**
One sentence connecting it to breaking the pattern.

**And hey:**
End with something loving. You're tough because you care.

Be direct. Be specific. Aquarius friend energy.`
        : `You are VERA. Based on their self-care struggle, give ONE specific next step.

**Your one move:**
The smallest possible version. Make it embarrassingly easy.

**Why this might actually work:**
One sentence — why this is different from their usual all-or-nothing approach.

**Permission slip:**
Give them permission to be human. To start small. To not be perfect.

No guilt. No toxic positivity. Just real.`;

      const actionResponse = await fetch('/api/ops/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: actionPrompt,
          userInput: userMessage + '\n\nContext:\n' + (analysisData?.content || ''),
          mode: generationMode,
          provider: selectedProvider,
          taskType: 'respond',
          activityId: 'respond',
        }),
      });

      let actionData: { content?: string; error?: string } = {};
      try {
        actionData = await actionResponse.json();
      } catch {
        actionData = { content: '' };
      }
      if (!actionResponse.ok) throw new Error(actionData?.error || 'Generation failed');

      setWellnessActionOutput(actionData?.content || '');
      setWellnessStage('result');
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error('Wellness generation error:', err);
      setWellnessAnalysisOutput('Something went wrong. Please try again.');
      setWellnessActionOutput('Something went wrong. Please try again.');
      setWellnessStage('result');
    } finally {
      setWellnessGenerating(false);
    }
  }, [wellnessInput, wellnessMode, wellnessClarifyQuestion, generationMode, selectedProvider]);

  const handleGoDeeper = useCallback(async () => {
    const dumpText = wellnessDumpInput.trim();
    if (!dumpText) return;

    setWellnessSorting(true);

    const deeperPrompt = wellnessMode === 'relationship'
      ? `You are VERA — like that Aquarius friend who's seen this movie before. They just told you the full story. Time to lovingly help them see the pattern.

**The pattern I see:**
Name the recurring theme. This isn't the first time, is it?

**What you keep choosing (and why):**
Gently name what they might be getting out of this pattern, even if it's painful.

**The question you're avoiding:**
There's something they don't want to ask themselves. Name it.

**What would actually change this:**
The real thing that would break the pattern — even if it's hard to hear.

**I say this with love:**
End with genuine care. You're being honest because you want better for them.

Be specific to their story. Use their words.`
      : `You are VERA — getting real about why their self-care keeps falling apart. They told you the history. Time to find the actual block.

**The pattern:**
What keeps happening? Name the cycle.

**What's really in the way:**
Not time. Not motivation. The real thing.

**The smallest possible version:**
What's the tiniest step that they could actually do? Make it almost embarrassingly small.

**A system, not a goal:**
Give them something sustainable, not aspirational.

**You're not broken:**
End with reassurance. They're human, not hopeless.

Be specific. Use their words.`;

    try {
      const deeperResponse = await fetch('/api/ops/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: deeperPrompt,
          userInput: `${wellnessInput.trim()}\n\nThey told me: "${dumpText}"`,
          mode: generationMode,
          provider: selectedProvider,
          taskType: 'respond',
          activityId: 'respond',
        }),
      });

      let deeperData: { content?: string; error?: string } = {};
      try {
        deeperData = await deeperResponse.json();
      } catch {
        deeperData = { content: '' };
      }
      if (!deeperResponse.ok) throw new Error(deeperData?.error || 'Generation failed');

      setWellnessSortedOutput(deeperData?.content || '');
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error('Wellness deeper error:', err);
      setWellnessSortedOutput('Something went wrong. Please try again.');
    } finally {
      setWellnessSorting(false);
    }
  }, [wellnessDumpInput, wellnessInput, wellnessMode, generationMode, selectedProvider]);

  const handleSave = useCallback(() => {
    if (!wellnessActionOutput) return;
    const title = 'Check In - ' + (wellnessInput.trim().slice(0, 50) || 'Next Step');
    const saved: SavedOutput = {
      id: `${Date.now()}`,
      space: selectedSpace || 'General',
      timestamp: new Date().toISOString(),
      activityId: 'wellness-orchestrator',
      text: `${title}\n\n${wellnessActionOutput.trim()}`,
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
  }, [wellnessActionOutput, wellnessInput, selectedSpace]);

  return (
    <>
      <div style={{ width: '100%', animation: 'fadeIn 0.4s ease-out', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 860, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: colors.text }}>
              Check In
            </div>
            <div style={{ fontSize: 14, color: colors.textMuted }}>
              For your heart, your head, and your habits.
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
            <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>
              What's Going On
            </div>
            <textarea
              value={wellnessInput}
              onChange={(e) => setWellnessInput(e.target.value)}
              placeholder="I keep fighting with... / I can't get myself to... / I'm feeling... / I need to talk about..."
              rows={5}
              className="input-field"
              disabled={wellnessGenerating}
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
                opacity: wellnessGenerating ? 0.7 : 1,
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 12 }}>
              <button
                onClick={handleInitialSubmit}
                disabled={wellnessGenerating || !wellnessInput.trim()}
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  border: 'none',
                  background: wellnessGenerating || !wellnessInput.trim()
                    ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(140,110,80,0.2)')
                    : colors.accent,
                  color: wellnessGenerating || !wellnessInput.trim() ? colors.textMuted : 'white',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: wellnessGenerating || !wellnessInput.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {wellnessGenerating ? 'Working...' : 'Talk to me'}
              </button>
            </div>
          </div>

          {/* SECTION TWO: CLARIFY */}
          {wellnessStage === 'clarify' && (
            <div style={{
              width: '100%',
              padding: '18px',
              borderRadius: 12,
              background: isDark ? 'rgba(194, 154, 108, 0.08)' : 'rgba(194, 154, 108, 0.1)',
              border: `1px solid ${isDark ? 'rgba(194, 154, 108, 0.2)' : 'rgba(194, 154, 108, 0.25)'}`,
            }}>
              {wellnessClarifyInsight && (
                <div style={{ 
                  fontSize: 14, 
                  color: colors.textMuted, 
                  marginBottom: 12, 
                  fontStyle: 'italic',
                  lineHeight: 1.4 
                }}>
                  {wellnessClarifyInsight}
                </div>
              )}
              <div style={{ fontSize: 16, color: colors.text, marginBottom: 16, fontWeight: 600 }}>
                {wellnessClarifyQuestion}
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                {wellnessClarifyOptions.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleClarifyChoice(option)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: 8,
                      border: wellnessUserChoice === option
                        ? `2px solid ${colors.accent}`
                        : `1px solid ${colors.cardBorder}`,
                      background: wellnessUserChoice === option
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
              
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${isDark ? 'rgba(194, 154, 108, 0.2)' : 'rgba(194, 154, 108, 0.25)'}` }}>
                <div style={{ fontSize: 14, color: colors.textMuted, marginBottom: 10 }}>
                  Or tell me in your own words...
                </div>
                <textarea
                  value={wellnessCustomAnswer}
                  onChange={(e) => setWellnessCustomAnswer(e.target.value)}
                  placeholder="What's really going on..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 8,
                    border: `1px solid ${colors.cardBorder}`,
                    background: colors.cardBg,
                    color: colors.text,
                    fontSize: 14,
                    lineHeight: 1.5,
                    resize: 'vertical',
                    marginBottom: 12,
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      const customAnswer = wellnessCustomAnswer.trim();
                      if (customAnswer) handleClarifyChoice(customAnswer);
                    }}
                    disabled={wellnessGenerating || !wellnessCustomAnswer.trim()}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 6,
                      border: 'none',
                      background: wellnessGenerating || !wellnessCustomAnswer.trim() 
                        ? colors.cardBorder 
                        : colors.accent,
                      color: wellnessGenerating || !wellnessCustomAnswer.trim() 
                        ? colors.textMuted 
                        : 'white',
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: wellnessGenerating || !wellnessCustomAnswer.trim() 
                        ? 'not-allowed' 
                        : 'pointer',
                    }}
                  >
                    {wellnessGenerating ? 'Working...' : 'Continue'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION THREE: ANALYSIS */}
          {wellnessStage === 'result' && wellnessAnalysisOutput && (
            <div style={{
              width: '100%',
              padding: '18px',
              borderRadius: 12,
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  What I See
                </div>
                <button
                  onClick={() => setShowWellnessAnalysis(!showWellnessAnalysis)}
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
                  {showWellnessAnalysis ? 'Hide' : 'Show'}
                </button>
              </div>
              {showWellnessAnalysis && (
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
                  <FormattedOutput content={wellnessAnalysisOutput} colors={colors} isDark={isDark} />
                </div>
              )}
            </div>
          )}

          {/* SECTION FOUR: ACTION */}
          {wellnessStage === 'result' && wellnessActionOutput && (
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
                  onClick={() => handleCopy(wellnessActionOutput || '')}
                  disabled={!wellnessActionOutput}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: `1px solid ${colors.cardBorder}`,
                    background: colors.cardBg,
                    cursor: wellnessActionOutput ? 'pointer' : 'default',
                    fontSize: 12,
                    fontWeight: 500,
                    color: wellnessActionOutput ? colors.text : colors.textMuted,
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
                {wellnessGenerating && !wellnessActionOutput ? (
                  <div style={{ color: colors.textMuted, fontSize: 13 }}>Generating...</div>
                ) : wellnessActionOutput ? (
                  <FormattedOutput content={wellnessActionOutput} colors={colors} isDark={isDark} />
                ) : (
                  <div style={{ color: colors.textMuted, fontSize: 13 }}>Your next step will appear here.</div>
                )}
              </div>
            </div>
          )}

          {/* SECTION FIVE: GO DEEPER */}
          {wellnessAnalysisOutput && wellnessActionOutput && (
            <div style={{
              width: '100%',
              padding: '18px',
              borderRadius: 12,
              background: isDark ? 'rgba(194, 154, 108, 0.08)' : 'rgba(194, 154, 108, 0.1)',
              border: `1px solid ${isDark ? 'rgba(194, 154, 108, 0.2)' : 'rgba(194, 154, 108, 0.25)'}`,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>
                GO DEEPER
              </div>
              <div style={{ fontSize: 14, color: colors.text, marginBottom: 14, lineHeight: 1.5 }}>
                {wellnessMode === 'relationship'
                  ? "Want me to really go there? Tell me the whole story — the history, the patterns, the thing you haven't said out loud yet. I'll help you see what's actually going on."
                  : "Want to figure out why this keeps happening? Tell me what you've tried, what failed, and what you're really avoiding. No judgment, I promise."}
              </div>
              <textarea
                value={wellnessDumpInput}
                onChange={(e) => setWellnessDumpInput(e.target.value)}
                placeholder={wellnessMode === 'relationship'
                  ? "It started when... and this isn't the first time... and I haven't told anyone but..."
                  : "I've tried... but I always... and honestly I think it's because..."}
                rows={4}
                className="input-field"
                disabled={wellnessSorting}
                style={{
                  width: '100%',
                  padding: '18px 18px',
                  borderRadius: 12,
                  border: `1px solid ${computedInputBorder}`,
                  background: computedInputBg,
                  color: colors.text,
                  fontSize: 14,
                  lineHeight: 1.6,
                  resize: 'vertical',
                  marginBottom: 12,
                  opacity: wellnessSorting ? 0.7 : 1,
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <button
                  onClick={handleGoDeeper}
                  disabled={wellnessSorting || !wellnessDumpInput.trim()}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 8,
                    border: 'none',
                    background: wellnessSorting || !wellnessDumpInput.trim()
                      ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(140,110,80,0.2)')
                      : colors.accent,
                    color: wellnessSorting || !wellnessDumpInput.trim() ? colors.textMuted : 'white',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: wellnessSorting || !wellnessDumpInput.trim() ? 'not-allowed' : 'pointer',
                  }}
                >
                  {wellnessSorting ? 'Working...' : wellnessMode === 'relationship' ? 'Help me see it clearly' : 'Help me figure this out'}
                </button>
              </div>
            </div>
          )}

          {/* SECTION SIX: GO DEEPER RESULT */}
          {wellnessSortedOutput && (
            <div style={{
              width: '100%',
              padding: '18px',
              borderRadius: 12,
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Here's What I See
                </div>
                <button
                  onClick={() => handleCopy(wellnessSortedOutput || '')}
                  disabled={!wellnessSortedOutput}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: `1px solid ${colors.cardBorder}`,
                    background: colors.cardBg,
                    cursor: wellnessSortedOutput ? 'pointer' : 'default',
                    fontSize: 12,
                    fontWeight: 500,
                    color: wellnessSortedOutput ? colors.text : colors.textMuted,
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
                minHeight: 150,
                maxHeight: 400,
                overflowY: 'auto',
                color: colors.text,
                fontSize: 14,
                lineHeight: 1.6,
              }}>
                <FormattedOutput content={wellnessSortedOutput} colors={colors} isDark={isDark} />
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          {wellnessStage === 'result' && wellnessActionOutput && (
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
                onClick={() => handleCopy(wellnessActionOutput || '')}
                disabled={!wellnessActionOutput}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: 'none',
                  background: wellnessActionOutput ? colors.accent : colors.cardBorder,
                  color: wellnessActionOutput ? '#fff' : colors.textMuted,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: wellnessActionOutput ? 'pointer' : 'default',
                }}
              >
                Copy Response
              </button>
              <button
                onClick={handleSave}
                disabled={!wellnessActionOutput}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: '1px solid rgb(245 158 11)',
                  background: saveState === 'saved' ? 'rgb(245 158 11)' : 'transparent',
                  color: saveState === 'saved' ? 'white' : 'rgb(245 158 11)',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: wellnessActionOutput ? 'pointer' : 'default',
                  opacity: wellnessActionOutput ? 1 : 0.5,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (wellnessActionOutput && saveState === 'idle') {
                    e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (wellnessActionOutput && saveState === 'idle') {
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
            VERA is not a therapist. For serious mental health concerns, please reach out to a professional.
          </div>
        </div>
      </div>
    </>
  );
}

export default WellnessOrchestrator;