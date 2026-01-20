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

interface MoneyOrchestratorProps {
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

export function MoneyOrchestrator({
  colors,
  isDark = false,
  inputBg,
  inputBorder,
  generationMode = 'single',
  selectedProvider = 'claude',
  selectedSpace = 'General',
}: MoneyOrchestratorProps) {
  const router = useRouter();

  // Compute input styling
  const computedInputBg = inputBg || colors.cardBg;
  const computedInputBorder = inputBorder || colors.cardBorder;

  // Local state
  const [moneyInput, setMoneyInput] = useState('');
  const [moneyGenerating, setMoneyGenerating] = useState(false);
  const [moneyAnalysisOutput, setMoneyAnalysisOutput] = useState<string | null>(null);
  const [moneyActionOutput, setMoneyActionOutput] = useState<string | null>(null);
  const [showMoneyAnalysis, setShowMoneyAnalysis] = useState(false);
  const [moneyDumpInput, setMoneyDumpInput] = useState('');
  const [moneySortedOutput, setMoneySortedOutput] = useState<string | null>(null);
  const [moneySorting, setMoneySorting] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saved' | 'error'>('idle');

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error('Failed to copy:', err);
    }
  }, []);

  const handleReset = useCallback(() => {
    setMoneyInput('');
    setMoneyAnalysisOutput(null);
    setMoneyActionOutput(null);
    setShowMoneyAnalysis(false);
    setMoneyDumpInput('');
    setMoneySortedOutput(null);
  }, []);

  const handleInitialSubmit = useCallback(async () => {
    const input = moneyInput.trim();
    if (!input) return;

    setMoneyGenerating(true);
    setMoneyAnalysisOutput(null);
    setMoneyActionOutput(null);

    const moneyPrompt = `You are VERA — a brilliant, sharp-tongued CFO who lives in someone's pocket. Think: your smartest friend who's amazing with money, has zero patience for bullshit, but genuinely wants you to win.

Your style:
- Blunt but never cruel
- Funny but always accurate  
- You see the patterns they're blind to
- You call out the money lies people tell themselves ('I deserve this' / 'It was on sale' / 'I'll start next month')
- You're like a financial therapist who also happens to be hilarious

When someone shares their money situation, respond with:

**Okay, here's what I'm hearing:**
One sentence. Reflect it back — show you actually listened. Add a tiny bit of knowing humor if appropriate.

**The real talk:**
2-3 sentences. What's ACTUALLY going on. Is it a spending problem? Income problem? Avoidance problem? 'Treat yourself' culture problem? An 'I don't want to look at it' problem? Name it directly. Don't be mean, but don't pretend it's fine when it's not.

**Where your money is probably sneaking out:**
Get specific. Based on what they shared, name the likely leaks:
- Subscriptions they forgot exist
- The 'small' daily purchases ($7 coffee × 30 days = $210/month)
- Emotional spending patterns (stress = shopping, boredom = ordering food)
- The 'I'll figure it out later' tax (late fees, interest, avoided bills)
Connect it to THEIR situation, not generic advice.

**The math you're avoiding:**
If relevant, do some quick math that makes it real. 'That $50/week on takeout? That's $2,600/year. That's a vacation. That's an emergency fund. That's options.'

**Your one move (do this today):**
ONE specific action. Not 'create a budget.' Something like:
- 'Open your bank app. Look at last week's transactions. Highlight every purchase that wasn't planned. Count them. That's your number.'
- 'Text yourself the 3 subscriptions you haven't used in 30 days. Cancel them before you close this page.'
- 'Check your credit card statement. Find the recurring charges. I bet there's at least $30/month you forgot about.'

End with something encouraging but real — you believe in them, but they have to actually do the thing.

Tone: Like a CFO friend who's three drinks in at dinner and finally tells you what they've been thinking about your finances. Sharp, funny, loving, true.`;

    try {
      // FIRST CALL: Analysis (the main CFO response)
      const analysisResponse = await fetch('/api/ops/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: moneyPrompt,
          userInput: input,
          mode: generationMode,
          provider: selectedProvider,
          taskType: 'money-analysis',
          activityId: 'money-analysis',
        }),
      });

      const analysisData = await analysisResponse.json();
      if (!analysisResponse.ok) throw new Error(analysisData.error || 'Generation failed');

      const analysisText = analysisData.content || '';
      setMoneyAnalysisOutput(analysisText);

      // SECOND CALL: Action plan
      const actionPrompt = `You are VERA, a sharp CFO friend. Based on the money situation shared, give them a concrete 7-day money reset plan.

Format:

**Your 7-Day Money Reset:**

**Day 1-2: The Audit**
[Specific task to understand their current state - be concrete about what to look at]

**Day 3-4: The Cuts**
[What to cancel, pause, or reduce - be specific based on their situation]

**Day 5-6: The Setup**
[One automation or system to put in place - specific and actionable]

**Day 7: The Rule**
[One simple rule they can follow going forward that fits their life]

**The number to know:**
[Calculate or estimate one key number for them - how much they could save, their real daily spend budget, etc.]

Keep it real, keep it doable. This isn't about becoming a finance guru - it's about taking control.`;

      const actionInput = `${input}\n\nContext from analysis:\n${analysisText}`;

      const actionResponse = await fetch('/api/ops/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: actionPrompt,
          userInput: actionInput,
          mode: generationMode,
          provider: selectedProvider,
          taskType: 'money-action',
          activityId: 'money-action',
        }),
      });

      const actionData = await actionResponse.json();
      if (!actionResponse.ok) throw new Error(actionData.error || 'Generation failed');

      setMoneyActionOutput(actionData.content || '');
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error('Money generation error:', err);
      setMoneyAnalysisOutput('Something went wrong. Please try again.');
      setMoneyActionOutput('Something went wrong. Please try again.');
    } finally {
      setMoneyGenerating(false);
    }
  }, [moneyInput, generationMode, selectedProvider]);

  const handleGoDeeper = useCallback(async () => {
    if (!moneyDumpInput.trim()) return;
    setMoneySorting(true);
    setMoneySortedOutput(null);

    const leakPrompt = `You are VERA — a brilliant CFO analyzing someone's actual spending. They just dumped their recent transactions. Your job is to find the leaks and call them out — with humor but also real insight.

Look at their specific purchases and respond:

**What I see:**
Count the transactions. Total the amount if you can. Note any patterns.

**The sneaky ones:**
Identify the spending that's probably happening on autopilot — subscriptions, repeat purchases, convenience spending. Be specific, use their actual items.

**The pattern:**
Name the behavior pattern you see. Is it emotional spending? Convenience addiction? Subscription creep? 'Treat yourself' culture? Be direct.

**The math:**
Do quick math to make it real. 'That $7 coffee × 5 days × 4 weeks = $140/month = $1,680/year. That's a vacation.'

**Your one move:**
One specific thing to cancel, cut, or change TODAY. Make it concrete.

Be specific to THEIR spending. Use their words. Call out their actual purchases. Be funny but accurate.`;

    const userMessage = `My money situation: ${moneyInput}\n\nMy recent spending:\n${moneyDumpInput}`;

    try {
      const res = await fetch('/api/ops/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId: 'money-analysis',
          systemPrompt: leakPrompt,
          userInput: userMessage,
          mode: generationMode,
          provider: selectedProvider,
        }),
      });

      if (!res.ok) {
        setMoneySortedOutput(`API error: ${res.status}. Try again.`);
        return;
      }

      const data = await res.json();
      const sortedContent = data.content || data.response || data.result || data.text || '';

      if (sortedContent) {
        setMoneySortedOutput(sortedContent);
      } else {
        if (process.env.NODE_ENV === 'development') console.error('Money leak API - no content found. Full data:', data);
        setMoneySortedOutput('No response received. Please try again.');
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error('Money leak error:', err);
      setMoneySortedOutput(`Error: ${err instanceof Error ? err.message : 'Unknown error'}. Try again.`);
    } finally {
      setMoneySorting(false);
    }
  }, [moneyDumpInput, moneyInput, generationMode, selectedProvider]);

  const handleSave = useCallback(() => {
    if (!moneyActionOutput) return;
    const title = 'Money - ' + (moneyInput.trim().slice(0, 50) || 'Action Plan');
    const saved: SavedOutput = {
      id: `${Date.now()}`,
      space: selectedSpace || 'General',
      timestamp: new Date().toISOString(),
      activityId: 'money-orchestrator',
      text: `${title}\n\n${moneyActionOutput.trim()}`,
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
  }, [moneyActionOutput, moneyInput, selectedSpace]);

  return (
    <>
      <div style={{ width: '100%', animation: 'fadeIn 0.4s ease-out', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 860, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: colors.text }}>
              Money
            </div>
            <div style={{ fontSize: 14, color: colors.textMuted }}>
              Your pocket CFO. No judgment, just truth.
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
              What&apos;s Going On With Your Money
            </div>
            <textarea
              value={moneyInput}
              onChange={(e) => setMoneyInput(e.target.value)}
              placeholder="I never have money left at the end of the month... / I don't know where it all goes... / I need to save but can't..."
              rows={5}
              className="input-field"
              disabled={moneyAnalysisOutput !== null}
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
                opacity: moneyAnalysisOutput !== null ? 0.7 : 1,
              }}
            />
            {!moneyAnalysisOutput && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 12 }}>
                <button
                  onClick={handleInitialSubmit}
                  disabled={moneyGenerating || !moneyInput.trim()}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 8,
                    border: 'none',
                    background: moneyGenerating || !moneyInput.trim()
                      ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(140,110,80,0.2)')
                      : colors.accent,
                    color: moneyGenerating || !moneyInput.trim() ? colors.textMuted : 'white',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: moneyGenerating || !moneyInput.trim() ? 'not-allowed' : 'pointer',
                  }}
                >
                  {moneyGenerating ? 'Working...' : 'Show me the truth'}
                </button>
              </div>
            )}
          </div>

          {/* SECTION TWO: ANALYSIS (collapsible) */}
          {moneyAnalysisOutput && (
            <div style={{
              width: '100%',
              padding: '18px',
              borderRadius: 12,
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showMoneyAnalysis ? 12 : 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Analysis
                </div>
                <button
                  onClick={() => setShowMoneyAnalysis(!showMoneyAnalysis)}
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
                  {showMoneyAnalysis ? 'Hide' : 'Show'}
                </button>
              </div>
              {showMoneyAnalysis && (
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
                  <FormattedOutput content={moneyAnalysisOutput} colors={colors} isDark={isDark} />
                </div>
              )}
            </div>
          )}

          {/* SECTION THREE: YOUR ACTION PLAN */}
          {moneyAnalysisOutput && (
            <div style={{
              width: '100%',
              padding: '18px',
              borderRadius: 12,
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Your Action Plan
                </div>
                <button
                  onClick={() => handleCopy(moneyActionOutput || '')}
                  disabled={!moneyActionOutput}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: `1px solid ${colors.cardBorder}`,
                    background: colors.cardBg,
                    cursor: moneyActionOutput ? 'pointer' : 'default',
                    fontSize: 12,
                    fontWeight: 500,
                    color: moneyActionOutput ? colors.text : colors.textMuted,
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
                maxHeight: 350,
                overflowY: 'auto',
                color: colors.text,
                fontSize: 14,
                lineHeight: 1.6,
              }}>
                {moneyGenerating && !moneyActionOutput ? (
                  <div style={{ color: colors.textMuted, fontSize: 13 }}>Generating...</div>
                ) : moneyActionOutput ? (
                  <FormattedOutput content={moneyActionOutput} colors={colors} isDark={isDark} />
                ) : (
                  <div style={{ color: colors.textMuted, fontSize: 13 }}>Your action plan will appear here.</div>
                )}
              </div>
            </div>
          )}

          {/* SECTION FOUR: GO DEEPER - only after initial response */}
          {moneyAnalysisOutput && !moneyGenerating && moneyActionOutput && !moneySortedOutput && (
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
                Want me to actually look at it? Dump your recent spending here — last week of purchases, subscriptions, whatever you&apos;ve got. I&apos;ll find the leaks.
              </div>
              <textarea
                value={moneyDumpInput}
                onChange={(e) => setMoneyDumpInput(e.target.value)}
                placeholder="Coffee $7, DoorDash $34, Amazon $23, Netflix $15..."
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
                  onClick={handleGoDeeper}
                  disabled={!moneyDumpInput.trim() || moneySorting}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 8,
                    border: 'none',
                    background: (!moneyDumpInput.trim() || moneySorting)
                      ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(140,110,80,0.2)')
                      : colors.accent,
                    color: (!moneyDumpInput.trim() || moneySorting) ? colors.textMuted : 'white',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: (!moneyDumpInput.trim() || moneySorting) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {moneySorting ? 'Finding leaks...' : 'Find the leaks'}
                </button>
              </div>
            </div>
          )}

          {/* SECTION FIVE: HERE'S WHAT I SEE - only after leak analysis */}
          {moneySortedOutput && (
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
                  onClick={() => handleCopy(moneySortedOutput || '')}
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
                <FormattedOutput content={moneySortedOutput} colors={colors} isDark={isDark} />
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          {moneyAnalysisOutput && (
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
                onClick={() => handleCopy(moneyActionOutput || '')}
                disabled={!moneyActionOutput}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: 'none',
                  background: moneyActionOutput ? 'rgb(217 119 6)' : (isDark ? 'rgb(55 65 81)' : 'rgb(229 231 235)'),
                  color: moneyActionOutput ? 'white' : (isDark ? 'rgb(156 163 175)' : 'rgb(107 114 128)'),
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: moneyActionOutput ? 'pointer' : 'default',
                  boxShadow: moneyActionOutput ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (moneyActionOutput) {
                    e.currentTarget.style.background = 'rgb(180 83 9)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (moneyActionOutput) {
                    e.currentTarget.style.background = 'rgb(217 119 6)';
                  }
                }}
              >
                Copy Response
              </button>
              <button
                onClick={handleSave}
                disabled={!moneyActionOutput}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: '1px solid rgb(245 158 11)',
                  background: saveState === 'saved' ? 'rgb(245 158 11)' : 'transparent',
                  color: saveState === 'saved' ? 'white' : 'rgb(245 158 11)',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: moneyActionOutput ? 'pointer' : 'default',
                  opacity: moneyActionOutput ? 1 : 0.5,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (moneyActionOutput && saveState === 'idle') {
                    e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (moneyActionOutput && saveState === 'idle') {
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
            VERA is not a financial advisor. This is for educational purposes only. Consult a professional for major financial decisions.
          </div>
        </div>
      </div>
    </>
  );
}

export default MoneyOrchestrator;