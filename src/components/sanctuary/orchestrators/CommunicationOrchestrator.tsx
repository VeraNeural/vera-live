'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormattedOutput } from '@/lib/ops/components/FormattedOutput';
import { OpsIcon } from '@/lib/ops/icons';
import type { AIProvider, GenerationMode } from '@/lib/ops/types';
import { logError, safeCopyToClipboard, handleApiResponse, DEFAULT_ERROR_MESSAGE, safeLocalStorage } from '../utils/errorHandler';

interface SavedOutput {
  id: string;
  space: string;
  timestamp: string;
  activityId: string;
  text: string;
}

interface CommunicationOrchestratorProps {
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

export function CommunicationOrchestrator({
  colors,
  isDark = false,
  inputBg,
  inputBorder,
  generationMode = 'single',
  selectedProvider = 'claude',
  selectedSpace = 'General',
}: CommunicationOrchestratorProps) {
  const router = useRouter();
  
  // Local state for communication UI
  const [communicationInput, setCommunicationInput] = useState('');
  const [communicationDecodeOutput, setCommunicationDecodeOutput] = useState<string | null>(null);
  const [communicationRespondOutput, setCommunicationRespondOutput] = useState<string | null>(null);
  const [communicationDecodeGenerating, setCommunicationDecodeGenerating] = useState(false);
  const [communicationRespondGenerating, setCommunicationRespondGenerating] = useState(false);
  const [communicationBoundaryNeeded, setCommunicationBoundaryNeeded] = useState(false);
  const [communicationBoundaryMode, setCommunicationBoundaryMode] = useState(false);
  const [communicationBoundaryType, setCommunicationBoundaryType] = useState('boundary-script');
  const [communicationBoundaryTone, setCommunicationBoundaryTone] = useState('gentle');
  const [communicationBoundaryGenerating, setCommunicationBoundaryGenerating] = useState(false);
  const [showCommunicationAnalysis, setShowCommunicationAnalysis] = useState(false);
  const [showClosingMessage, setShowClosingMessage] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saved' | 'error'>('idle');

  // Compute input styling
  const computedInputBg = inputBg || colors.cardBg;
  const computedInputBorder = inputBorder || colors.cardBorder;

  const handleCopy = useCallback(async (text: string) => {
    await safeCopyToClipboard(text);
  }, []);

  const handleCommunicationGenerate = useCallback(async () => {
    if (!communicationInput.trim()) return;
    
    setCommunicationDecodeGenerating(true);
    setCommunicationRespondGenerating(true);
    setCommunicationDecodeOutput(null);
    setCommunicationRespondOutput(null);
    
    try {
      // Decode phase
      const decodePrompt = `Analyze this message for communication patterns, emotional undertones, and what's really being said:
---
${communicationInput}
---

Identify:
1. The core message or request
2. Emotional undertones
3. Any manipulation patterns (guilt language, pressure/urgency, boundary-crossing)
4. What the person might actually need

Be concise but thorough.`;

      const decodeRes = await fetch('/api/ops/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: decodePrompt,
          userInput: communicationInput,
          mode: generationMode,
          provider: selectedProvider,
          taskType: 'decode',
          activityId: 'communication-orchestrator',
        }),
      });
      
      const decodeData = await handleApiResponse(decodeRes) as { content?: string };
      setCommunicationDecodeOutput(decodeData.content || '');
      setCommunicationDecodeGenerating(false);
      
      // Check for boundary patterns
      const lower = (decodeData.content || '').toLowerCase();
      if (lower.includes('boundary') || lower.includes('pressure') || lower.includes('guilt') || lower.includes('manipulation')) {
        setCommunicationBoundaryNeeded(true);
      }

      // Respond phase
      const respondPrompt = `Based on the message received and the analysis, generate a clear, confident response.

Original message:
---
${communicationInput}
---

Analysis:
---
${decodeData.content || ''}
---

Generate a response that:
1. Acknowledges the other person's perspective
2. Is clear about your own position
3. Maintains healthy boundaries
4. Is warm but firm

Write ONLY the response they can copy and send.`;

      const respondRes = await fetch('/api/ops/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: respondPrompt,
          userInput: communicationInput,
          mode: generationMode,
          provider: selectedProvider,
          taskType: 'respond',
          activityId: 'respond',
        }),
      });
      
      const respondData = await handleApiResponse(respondRes) as { content?: string };
      setCommunicationRespondOutput(respondData.content || '');
      
    } catch (err) {
      logError(err, { operation: 'communicationGenerate', activityId: 'communication-orchestrator' });
      setCommunicationDecodeOutput(DEFAULT_ERROR_MESSAGE);
      setCommunicationRespondOutput(DEFAULT_ERROR_MESSAGE);
    } finally {
      setCommunicationDecodeGenerating(false);
      setCommunicationRespondGenerating(false);
    }
  }, [communicationInput, generationMode, selectedProvider]);

  const handleBoundaryGenerate = useCallback(async () => {
    setCommunicationBoundaryGenerating(true);
    setCommunicationRespondOutput(null);
    try {
      const boundaryTypeLabels: Record<string, string> = {
        'boundary-script': 'Boundary Script',
        'say-no': 'Say No Clearly',
        'soften-hold': 'Soften But Hold',
      };
      const selectedType = boundaryTypeLabels[communicationBoundaryType] || 'Boundary Script';
      const originalMessage = communicationInput.trim();
      
      if (!originalMessage) {
        setCommunicationRespondOutput('Please enter a message first.');
        setCommunicationBoundaryGenerating(false);
        return;
      }

      const systemPrompt = `You are VERA, helping someone set a boundary in response to a message they received.

Here is the message they received:
---
${originalMessage}
---

${communicationDecodeOutput ? `Analysis of this message:
---
${communicationDecodeOutput}
---

` : ''}The user wants to respond with a boundary. Generate a response based on:

Boundary type: ${selectedType}
- 'Boundary Script': A complete message that acknowledges the other person while clearly stating the boundary with warmth and firmness.
- 'Say No Clearly': A brief, direct response that declines without over-explaining or apologizing excessively.
- 'Soften But Hold': A gentle response that shows care for the relationship while still holding the boundary firmly.

Tone: ${communicationBoundaryTone}

Write ONLY the response they can copy and send. Make it specific to the actual message they received. No analysis, no alternatives, no meta-commentary.`;

      const res = await fetch('/api/ops/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          userInput: originalMessage,
          mode: generationMode,
          provider: selectedProvider,
          taskType: 'respond',
          activityId: 'respond',
        }),
      });
      const data = await handleApiResponse(res) as { content?: string };
      setCommunicationRespondOutput(data.content || 'Unable to generate response.');
    } catch (err) {
      logError(err, { operation: 'boundaryGenerate', activityId: 'respond' });
      setCommunicationRespondOutput(DEFAULT_ERROR_MESSAGE);
    } finally {
      setCommunicationBoundaryGenerating(false);
    }
  }, [communicationInput, communicationDecodeOutput, communicationBoundaryType, communicationBoundaryTone, generationMode, selectedProvider]);

  const handleSave = useCallback(() => {
    if (!communicationRespondOutput) return;
    const title = 'Understand & Respond - ' + (communicationInput.trim().slice(0, 50) || 'Response');
    const saved: SavedOutput = {
      id: `${Date.now()}`,
      space: selectedSpace || 'General',
      timestamp: new Date().toISOString(),
      activityId: 'communication-orchestrator',
      text: `${title}\n\n${communicationRespondOutput.trim()}`,
    };
    try {
      const key = 'vera.savedOutputs.v1';
      const existing: SavedOutput[] = safeLocalStorage<SavedOutput[]>('get', key) || [];
      existing.unshift(saved);
      safeLocalStorage('set', key, existing);
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2000);
    } catch (err) {
      logError(err, { operation: 'saveOutput', activityId: 'communication-orchestrator' });
      setSaveState('error');
      setTimeout(() => setSaveState('idle'), 2000);
    }
  }, [communicationRespondOutput, communicationInput, selectedSpace]);

  const handleReset = useCallback(() => {
    setCommunicationInput('');
    setCommunicationDecodeOutput(null);
    setCommunicationRespondOutput(null);
    setShowCommunicationAnalysis(false);
    setCommunicationBoundaryMode(false);
    setCommunicationBoundaryNeeded(false);
  }, []);

  return (
    <>
      <div style={{ width: '100%', animation: 'fadeIn 0.4s ease-out', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 860, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: colors.text }}>
              Communication
            </div>
            <div style={{ fontSize: 14, color: colors.textMuted }}>
              Understand what's really being said. Respond with clarity.
            </div>
          </div>

          {/* SECTION ONE: DECODE */}
          <div style={{
            width: '100%',
            padding: '18px',
            borderRadius: 12,
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Decode
            </div>
            <textarea
              value={communicationInput}
              onChange={(e) => setCommunicationInput(e.target.value)}
              placeholder="Paste or say the message you want help with."
              rows={5}
              className="input-field"
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
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 12 }}>
              <button
                onClick={handleCommunicationGenerate}
                disabled={communicationDecodeGenerating || communicationRespondGenerating || !communicationInput.trim()}
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  border: 'none',
                  background: communicationDecodeGenerating || communicationRespondGenerating || !communicationInput.trim()
                    ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(140,110,80,0.2)')
                    : colors.accent,
                  color: communicationDecodeGenerating || communicationRespondGenerating || !communicationInput.trim() ? colors.textMuted : 'white',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: communicationDecodeGenerating || communicationRespondGenerating || !communicationInput.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {communicationDecodeGenerating || communicationRespondGenerating ? 'Working...' : 'Generate response'}
              </button>
            </div>
          </div>

          {communicationBoundaryNeeded && (
            <div style={{ fontSize: 12, color: colors.textMuted }}>
              A boundary is needed here.
            </div>
          )}

          {/* SECTION TWO: ANALYSIS */}
          <div style={{
            width: '100%',
            padding: '18px',
            borderRadius: 12,
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Analysis
              </div>
              <button
                onClick={() => setShowCommunicationAnalysis(!showCommunicationAnalysis)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: `1px solid ${colors.cardBorder}`,
                  background: 'transparent',
                  color: colors.textMuted,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {showCommunicationAnalysis ? 'Hide' : 'Show'}
              </button>
            </div>
            {showCommunicationAnalysis && (
              <div style={{ marginTop: 12, maxHeight: 400, overflowY: 'auto' }}>
                {communicationDecodeOutput ? (
                  <FormattedOutput content={communicationDecodeOutput} colors={colors} isDark={isDark} />
                ) : (
                  <div style={{ color: colors.textMuted, fontSize: 13 }}>Analysis will appear here.</div>
                )}
              </div>
            )}
          </div>

          {/* BOUNDARY CALLOUT - appears if analysis mentions boundary-related patterns */}
          {communicationDecodeOutput && !communicationBoundaryMode && (() => {
            const lower = communicationDecodeOutput.toLowerCase();
            return lower.includes('boundary') || lower.includes('pressure/urgency') || lower.includes('guilt language') || lower.includes('manipulation pattern');
          })() && (
            <div style={{
              width: '100%',
              padding: '16px 20px',
              borderRadius: 12,
              background: isDark ? 'rgba(194, 154, 108, 0.12)' : 'rgba(194, 154, 108, 0.15)',
              border: `1px solid ${isDark ? 'rgba(194, 154, 108, 0.25)' : 'rgba(194, 154, 108, 0.35)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}>
              <span style={{ fontSize: 14, color: colors.text }}>
                This looks like a boundary situation.
              </span>
              <button
                onClick={() => setCommunicationBoundaryMode(true)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: isDark ? 'rgba(194, 154, 108, 0.25)' : 'rgba(194, 154, 108, 0.3)',
                  color: colors.text,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Need help setting a boundary?
              </button>
            </div>
          )}

          {/* SECTION: BOUNDARY MODE */}
          {communicationBoundaryMode && (
            <div style={{
              width: '100%',
              padding: '18px',
              borderRadius: 12,
              background: isDark ? 'rgba(194, 154, 108, 0.08)' : 'rgba(194, 154, 108, 0.1)',
              border: `1px solid ${isDark ? 'rgba(194, 154, 108, 0.2)' : 'rgba(194, 154, 108, 0.25)'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Boundary
                </div>
                <button
                  onClick={() => setCommunicationBoundaryMode(false)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: 6,
                    border: `1px solid ${colors.cardBorder}`,
                    background: 'transparent',
                    color: colors.textMuted,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>
              <div style={{ fontSize: 14, color: colors.text, marginBottom: 16 }}>
                Choose how you want to set this boundary
              </div>

              {/* Boundary Type Options */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {[
                  { id: 'boundary-script', label: 'Boundary Script', desc: 'A full script for setting the boundary' },
                  { id: 'say-no', label: 'Say No Clearly', desc: 'A direct, clear no' },
                  { id: 'soften-hold', label: 'Soften But Hold', desc: 'Gentle but firm boundary' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setCommunicationBoundaryType(opt.id)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: 8,
                      border: communicationBoundaryType === opt.id
                        ? `2px solid ${colors.accent}`
                        : `1px solid ${colors.cardBorder}`,
                      background: communicationBoundaryType === opt.id
                        ? (isDark ? 'rgba(194, 154, 108, 0.15)' : 'rgba(194, 154, 108, 0.12)')
                        : colors.cardBg,
                      color: colors.text,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                      flex: '1 1 auto',
                      minWidth: 120,
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Tone Selector */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8 }}>Tone</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['Gentle', 'Firm', 'Professional', 'Personal'].map((tone) => (
                    <button
                      key={tone}
                      onClick={() => setCommunicationBoundaryTone(tone.toLowerCase())}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 20,
                        border: communicationBoundaryTone === tone.toLowerCase()
                          ? `2px solid ${colors.accent}`
                          : `1px solid ${colors.cardBorder}`,
                        background: communicationBoundaryTone === tone.toLowerCase()
                          ? (isDark ? 'rgba(194, 154, 108, 0.15)' : 'rgba(194, 154, 108, 0.12)')
                          : 'transparent',
                        color: colors.text,
                        fontSize: 12,
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleBoundaryGenerate}
                disabled={communicationBoundaryGenerating || !communicationInput.trim()}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  borderRadius: 8,
                  border: 'none',
                  background: communicationInput.trim() ? colors.accent : colors.cardBorder,
                  color: communicationInput.trim() ? '#fff' : colors.textMuted,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: communicationInput.trim() ? 'pointer' : 'default',
                }}
              >
                {communicationBoundaryGenerating ? 'Generating...' : 'Generate Boundary Response'}
              </button>
            </div>
          )}

          {/* SECTION THREE: RESPOND */}
          <div style={{
            width: '100%',
            padding: '18px',
            borderRadius: 12,
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Respond
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>
                A response you can send
              </div>
              <button
                onClick={() => {
                  handleCopy(communicationRespondOutput || '');
                  setShowClosingMessage(true);
                  setTimeout(() => setShowClosingMessage(false), 3000);
                }}
                disabled={!communicationRespondOutput}
                style={{
                  padding: '6px 10px',
                  borderRadius: 8,
                  border: `1px solid ${colors.cardBorder}`,
                  background: colors.cardBg,
                  cursor: communicationRespondOutput ? 'pointer' : 'default',
                  fontSize: 12,
                  fontWeight: 500,
                  color: communicationRespondOutput ? colors.text : colors.textMuted,
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
              maxHeight: '45vh',
              overflowY: 'auto',
              color: colors.text,
              fontSize: 14,
              lineHeight: 1.6,
            }}>
              {communicationRespondGenerating && !communicationRespondOutput ? (
                <div style={{ color: colors.textMuted, fontSize: 13 }}>Generating...</div>
              ) : communicationRespondOutput ? (
                <FormattedOutput content={communicationRespondOutput} colors={colors} isDark={isDark} />
              ) : (
                <div style={{ color: colors.textMuted, fontSize: 13 }}>Response will appear here.</div>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
            marginTop: 8,
          }}>
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
                if (communicationRespondOutput) {
                  try {
                    await navigator.clipboard.writeText(communicationRespondOutput);
                    setShowClosingMessage(true);
                    setTimeout(() => setShowClosingMessage(false), 3000);
                  } catch (err) {
                    console.error('Failed to copy:', err);
                  }
                }
              }}
              disabled={!communicationRespondOutput}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: 'none',
                background: communicationRespondOutput ? 'rgb(217 119 6)' : (isDark ? 'rgb(55 65 81)' : 'rgb(229 231 235)'),
                color: communicationRespondOutput ? 'white' : (isDark ? 'rgb(156 163 175)' : 'rgb(107 114 128)'),
                fontSize: 14,
                fontWeight: 500,
                cursor: communicationRespondOutput ? 'pointer' : 'default',
                boxShadow: communicationRespondOutput ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (communicationRespondOutput) {
                  e.currentTarget.style.background = 'rgb(180 83 9)';
                }
              }}
              onMouseLeave={(e) => {
                if (communicationRespondOutput) {
                  e.currentTarget.style.background = 'rgb(217 119 6)';
                }
              }}
            >
              Copy Response
            </button>
            <button
              onClick={handleSave}
              disabled={!communicationRespondOutput}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: '1px solid rgb(245 158 11)',
                background: saveState === 'saved' ? 'rgb(245 158 11)' : 'transparent',
                color: saveState === 'saved' ? 'white' : 'rgb(245 158 11)',
                fontSize: 14,
                fontWeight: 500,
                cursor: communicationRespondOutput ? 'pointer' : 'default',
                opacity: communicationRespondOutput ? 1 : 0.5,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (communicationRespondOutput && saveState === 'idle') {
                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (communicationRespondOutput && saveState === 'idle') {
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

          {/* CLOSING MESSAGE */}
          {showClosingMessage && (
            <div style={{
              textAlign: 'center',
              marginTop: 20,
              fontSize: 14,
              fontStyle: 'italic',
              color: colors.accent,
              opacity: 1,
              animation: 'fadeIn 0.5s ease-out',
            }}>
              You've got this. Trust yourself.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default React.memo(CommunicationOrchestrator);
