'use client';

import { useState, useEffect, useRef } from 'react';
import { opsRoom, type Category, type Activity, type DropdownOption } from '@/app/sanctuary/ops/consolidatedData';
import { ActionSelector } from '@/lib/ops/components/ActionSelector';
import { DynamicForm } from '@/lib/ops/components/DynamicForm';
import { ProviderSelector } from '@/lib/ops/components/ProviderSelector';
import { ModeSelector } from '@/lib/ops/components/ModeSelector';
import { FormattedOutput } from '@/lib/ops/components/FormattedOutput';
import { OpsIcon } from '@/lib/ops/icons';
import { TIME_COLORS, getTimeOfDay } from '@/lib/ops/theme';
import { type AIProvider, type GenerationMode, type TimeOfDay, type ThemeMode } from '@/lib/ops/types';
import { default as LanguageExperience } from '@/lib/ops/experiences/Language';

interface OpsRoomProps {
  onBack: () => void;
  initialView?: string;
  initialCategory?: string;
  initialActivity?: string;
  initialOption?: string;
}

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:wght@400;500;600&display=swap');
  
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }
  
  html, body {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .card-btn {
    transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
  }
  .card-btn:hover { transform: translateY(-2px); }
  .card-btn:active { transform: scale(0.98); }

  .input-field {
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .input-field:focus { outline: none; }

  .output-area::-webkit-scrollbar { width: 4px; }
  .output-area::-webkit-scrollbar-track { background: transparent; }
  .output-area::-webkit-scrollbar-thumb { background: rgba(150, 140, 130, 0.3); border-radius: 4px; }

  .generating {
    background: linear-gradient(90deg, rgba(200,180,150,0.1) 25%, rgba(200,180,150,0.2) 50%, rgba(200,180,150,0.1) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  select.input-field {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
    padding-right: 40px !important;
  }

  select.input-field option {
    background: #1a1a24;
    color: #e8e4de;
    padding: 12px;
  }

  @media (prefers-color-scheme: light) {
    select.input-field option {
      background: #ffffff;
      color: #2a2a2a;
    }
  }

  .ops-category-grid {
    grid-template-columns: repeat(3, 1fr) !important;
  }

  @media (max-width: 400px) {
    .ops-category-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }
`;

const GENERATION_MODES: Record<GenerationMode, { name: string }> = {
  single: { name: 'Single AI' },
  specialist: { name: 'Specialist' },
  consensus: { name: 'Consensus' },
  'review-chain': { name: 'Review Chain' },
  compare: { name: 'Compare' },
};

const AI_PROVIDERS: Record<AIProvider, { name: string; color: string }> = {
  claude: { name: 'Claude', color: '#D97706' },
  gpt4: { name: 'GPT-4', color: '#10B981' },
  grok: { name: 'Grok', color: '#8B5CF6' },
};

export default function OpsRoom({ onBack, initialView, initialCategory, initialActivity, initialOption }: OpsRoomProps) {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('afternoon');
  const [manualTheme, setManualTheme] = useState<ThemeMode>('auto');
  const [isLoaded, setIsLoaded] = useState(false);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<Activity | null>(null);
  const [selectedDropdownOption, setSelectedDropdownOption] = useState<DropdownOption | null>(null);

  const [generationMode, setGenerationMode] = useState<GenerationMode>('specialist');
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('claude');
  const [showModeSelector, setShowModeSelector] = useState(false);

  const [simpleInput, setSimpleInput] = useState('');
  const [formFields, setFormFields] = useState<Record<string, string>>({});

  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [compareOutputs, setCompareOutputs] = useState<{ provider: AIProvider; content: string }[] | null>(null);
  const [usedProvider, setUsedProvider] = useState<AIProvider | null>(null);
  const [copied, setCopied] = useState(false);

  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeOfDay(getTimeOfDay());
    setTimeout(() => setIsLoaded(true), 100);
    const interval = setInterval(() => setTimeOfDay(getTimeOfDay()), 60000);
    return () => clearInterval(interval);
  }, []);

  const normalizeCategoryFromView = (view?: string): { category: string; actionId?: string; languageTab?: 'learn' | 'translate' } | null => {
    const v = (view || '').toLowerCase().trim();
    if (!v) return null;

    // Direct category IDs from new structure
    if (opsRoom.categories.some((c) => c.id === v)) return { category: v };

    // Map old category names to new ones
    if (v === 'communication') return { category: 'communication' };
    if (v === 'work-career' || v === 'work') return { category: 'work-life' };
    if (v === 'money-finance' || v === 'money') return { category: 'money' };
    if (v === 'planning-goals' || v === 'planning') return { category: 'work-life' };
    if (v === 'learning-growth' || v === 'learning') return { category: 'thinking-learning' };
    if (v === 'reflect-connect' || v === 'relationships') return { category: 'relationships-wellness' };
    if (v === 'creativity' || v === 'content') return { category: 'create' };

    return null;
  };

  useEffect(() => {
    const mapped = normalizeCategoryFromView(initialView);
    if (!mapped) return;
    setActiveCategory(mapped.category);
    if (mapped.actionId) {
      const category = opsRoom.categories.find((c) => c.id === mapped.category);
      const action = category?.activities.find((a) => a.id === mapped.actionId) ?? null;
      setSelectedAction(action);

      if (mapped.actionId === 'language-learning' && mapped.languageTab) {
        try {
          window.localStorage.setItem('vera.ops.language.lastTab.v1', mapped.languageTab);
        } catch {
          // ignore
        }
      }
    } else {
      setSelectedAction(null);
    }
  }, [initialView]);

  // Handle direct navigation from sidebar (category + activity + option)
  useEffect(() => {
    if (!initialCategory || !initialActivity) return;
    
    const category = opsRoom.categories.find(c => c.id === initialCategory);
    if (!category) return;
    
    const activity = category.activities.find(a => a.id === initialActivity);
    if (!activity) return;
    
    setActiveCategory(initialCategory);
    setSelectedAction(activity);
    
    // Standalone or custom-component → form shows directly (selectedDropdownOption stays null)
    // Dropdown without option param → shows option cards (selectedDropdownOption stays null)
    // Dropdown with option param → go to specific option form
    
    if (activity.type === 'dropdown' && initialOption && activity.dropdownOptions) {
      const option = activity.dropdownOptions.find(o => o.id === initialOption);
      if (option) {
        setSelectedDropdownOption(option);
      }
    }
  }, [initialCategory, initialActivity, initialOption]);

  const isDark = manualTheme === 'dark' ? true : manualTheme === 'light' ? false : (timeOfDay === 'evening' || timeOfDay === 'night');
  const colors = isDark ? TIME_COLORS.evening : TIME_COLORS[timeOfDay];

  const handleGenerate = async () => {
    if (!selectedAction) return;

    // Determine which fields and prompt to use (dropdown option takes precedence)
    const effectiveFields = selectedDropdownOption?.fields || selectedAction.fields;
    const effectivePrompt = selectedDropdownOption?.systemPrompt || selectedAction.systemPrompt;

    let userInput = '';
    if (effectiveFields) {
      userInput = effectiveFields.map(f => `${f.label}: ${formFields[f.name] || 'Not specified'}`).join('\n');
    } else {
      userInput = simpleInput;
    }
    if (!userInput.trim()) return;

    setIsGenerating(true);
    setOutput(null);
    setCompareOutputs(null);

    try {
      const response = await fetch('/api/ops/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: effectivePrompt,
          userInput,
          mode: generationMode,
          provider: selectedProvider,
          taskType: selectedDropdownOption?.id || selectedAction.id,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Generation failed');

      if (generationMode === 'compare' && data.responses) {
        setCompareOutputs(data.responses);
      } else {
        setOutput(data.content);
        setUsedProvider(data.provider || null);
      }
    } catch (err) {
      setOutput('Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text?: string) => {
    const textToCopy = text || output;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setSelectedAction(null);
    setSelectedDropdownOption(null);
    setSimpleInput('');
    setFormFields({});
    setOutput(null);
    setCompareOutputs(null);
    setUsedProvider(null);
  };

  const handleBack = () => {
    // Came from sidebar - always go back to sanctuary
    if (initialActivity) {
      onBack();
      return;
    }
    
    // Normal navigation (user browsing within OpsRoom)
    if (output || compareOutputs) {
      handleReset();
    } else if (selectedDropdownOption) {
      setSelectedDropdownOption(null);
      setSimpleInput('');
      setFormFields({});
    } else if (selectedAction) {
      setSelectedAction(null);
      setSimpleInput('');
      setFormFields({});
    } else if (activeCategory) {
      setActiveCategory(null);
    } else {
      onBack();
    }
  };

  const isFormValid = () => {
    if (!selectedAction) return false;
    const effectiveFields = selectedDropdownOption?.fields || selectedAction.fields;
    if (effectiveFields) {
      const required = effectiveFields.filter(f => f.required);
      return required.every(f => formFields[f.name]?.trim());
    }
    return simpleInput.trim().length > 0;
  };

  const handleFormFieldChange = (fieldId: string, value: string) => {
    setFormFields(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSelectCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    setSelectedAction(null);
    setSelectedDropdownOption(null);
  };

  const handleSelectAction = (action: Activity) => {
    setSelectedAction(action);
    setSelectedDropdownOption(null);
    setFormFields({});
    setSimpleInput('');
  };

  const handleSelectDropdownOption = (option: DropdownOption) => {
    setSelectedDropdownOption(option);
    setFormFields({});
    setSimpleInput('');
  };

  return (
    <>
      <style jsx global>{GLOBAL_STYLES}</style>

      <div style={{ position: 'fixed', inset: 0, background: colors.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Ambient Background */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
            width: 'min(120vw, 700px)', height: 'min(80vh, 500px)',
            background: isDark
              ? 'radial-gradient(ellipse at 50% 30%, rgba(255, 180, 100, 0.08) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at 50% 30%, rgba(255, 220, 180, 0.4) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
        </div>

        {/* Header */}
        <header style={{ padding: '16px', paddingTop: 'max(16px, env(safe-area-inset-top))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 50 }}>
          <button onClick={handleBack} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px',
            background: colors.cardBg, border: `1px solid ${colors.cardBorder}`,
            borderRadius: 50, cursor: 'pointer', fontSize: 14, fontWeight: 500, color: colors.textMuted,
          }}>
            <OpsIcon type="arrow-left" color={colors.textMuted} />
            <span>Back</span>
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            {['light', 'auto', 'dark'].map((theme) => (
              <button
                key={theme}
                onClick={() => setManualTheme(theme as ThemeMode)}
                style={{
                  padding: '8px 12px', borderRadius: 20, border: `1px solid ${manualTheme === theme ? colors.accent : colors.cardBorder}`,
                  background: manualTheme === theme ? (isDark ? 'rgba(255,180,100,0.1)' : 'rgba(200,160,100,0.15)') : 'transparent',
                  cursor: 'pointer', fontSize: 12, fontWeight: 500, color: manualTheme === theme ? colors.accent : colors.textMuted,
                }}
              >
                {theme}
              </button>
            ))}
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 20px 40px', opacity: isLoaded ? 1 : 0, transition: 'opacity 0.4s ease-out' }}>
          {!activeCategory && !selectedAction && !output && !compareOutputs && (
            <>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 40, fontWeight: 300, color: colors.text, marginBottom: 8 }}>Focus</h1>
                <p style={{ fontSize: 15, color: colors.textMuted }}>Select a category from the sidebar to get started</p>
              </div>

              <ProviderSelector
                selectedMode={generationMode}
                selectedProvider={selectedProvider}
                onOpenModeSelector={() => setShowModeSelector(true)}
                colors={colors}
                isDark={isDark}
              />
            </>
          )}

          {activeCategory && !selectedAction && !output && !compareOutputs && (() => {
            const category = opsRoom.categories.find(c => c.id === activeCategory);
            if (!category) return null;
            return (
              <ActionSelector
                category={activeCategory}
                categoryTitle={category.name}
                actions={category.activities}
                onSelectAction={(action) => handleSelectAction(action as Activity)}
                colors={colors}
                isDark={isDark}
              />
            );
          })()}

          {selectedAction?.id === 'language-learning' && !output && !compareOutputs && !isGenerating && (
            <LanguageExperience
              colors={colors}
              isDark={isDark}
              onExit={() => setSelectedAction(null)}
            />
          )}

          {selectedAction && selectedAction.id !== 'language-learning' && !output && !compareOutputs && !isGenerating && (
            selectedAction.type === 'dropdown' && !selectedDropdownOption ? (
              <div style={{ width: '100%', maxWidth: 600, animation: 'fadeIn 0.4s ease-out' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 300, color: colors.text, marginBottom: 8 }}>
                    {selectedAction.title}
                  </h2>
                  <p style={{ fontSize: 14, color: colors.textMuted }}>{selectedAction.description}</p>
                </div>
                <div style={{ display: 'grid', gap: 12 }}>
                  {selectedAction.dropdownOptions?.map((option) => (
                    <button
                      key={option.id}
                      className="card-btn"
                      onClick={() => handleSelectDropdownOption(option)}
                      style={{
                        padding: '18px 20px',
                        background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.85)',
                        border: `1px solid ${colors.cardBorder}`,
                        borderRadius: 14,
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                      }}
                    >
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isDark ? 'rgba(255, 180, 100, 0.1)' : 'rgba(200, 160, 100, 0.12)',
                        border: `1px solid ${isDark ? 'rgba(255, 180, 100, 0.18)' : 'rgba(200, 160, 100, 0.2)'}`,
                        flexShrink: 0,
                      }}>
                        <OpsIcon type={option.icon} color={colors.accent} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: colors.text, marginBottom: 4 }}>
                          {option.label}
                        </div>
                        <div style={{ fontSize: 13, color: colors.textMuted }}>
                          {option.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <DynamicForm
                action={selectedDropdownOption ? {
                  ...selectedAction,
                  title: selectedDropdownOption.label,
                  description: selectedDropdownOption.description,
                  placeholder: selectedDropdownOption.placeholder,
                  fields: selectedDropdownOption.fields,
                } : selectedAction}
                simpleInput={simpleInput}
                formFields={formFields}
                onSimpleInputChange={setSimpleInput}
                onFormFieldChange={handleFormFieldChange}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                isValid={isFormValid()}
                colors={colors}
                isDark={isDark}
              />
            )
          )}

          {isGenerating && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, marginTop: 60 }}>
              <div className="generating" style={{ width: 50, height: 50, borderRadius: '50%' }} />
              <p style={{ fontSize: 15, color: colors.textMuted }}>
                {generationMode === 'compare' ? 'Generating from all 3 AIs...' :
                 generationMode === 'consensus' ? 'Getting consensus from all AIs...' :
                 generationMode === 'review-chain' ? 'Running review chain...' :
                 'Generating...'}
              </p>
            </div>
          )}

          {output && !compareOutputs && (
            <div ref={outputRef} style={{ width: '100%', maxWidth: 700, animation: 'fadeIn 0.4s ease-out' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                {usedProvider && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: AI_PROVIDERS[usedProvider].color + '20', border: `1px solid ${AI_PROVIDERS[usedProvider].color}40`, borderRadius: 50, fontSize: 13, fontWeight: 500, color: AI_PROVIDERS[usedProvider].color }}>
                    <OpsIcon type={`ai-${usedProvider}`} color={AI_PROVIDERS[usedProvider].color} />
                    {AI_PROVIDERS[usedProvider].name}
                  </div>
                )}
                <button onClick={() => handleCopy()} style={{ padding: '10px 16px', borderRadius: 50, border: `1px solid ${colors.cardBorder}`, background: colors.cardBg, cursor: 'pointer', fontSize: 13, fontWeight: 500, color: colors.text, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <OpsIcon type={copied ? 'check' : 'copy'} color={colors.accent} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="output-area" style={{ padding: '24px', background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 16, maxHeight: '60vh', overflowY: 'auto' }}>
                <FormattedOutput content={output} colors={colors} isDark={isDark} />
              </div>
              <button onClick={handleReset} style={{ marginTop: 20, padding: '14px', borderRadius: 50, border: 'none', background: colors.accent, color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer', width: '100%' }}>
                Start Over
              </button>
            </div>
          )}

          {compareOutputs && (
            <div style={{ width: '100%', maxWidth: 900, animation: 'fadeIn 0.4s ease-out' }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: colors.text, marginBottom: 20, textAlign: 'center' }}>Compare Results</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                {compareOutputs.map(({ provider, content }) => (
                  <div key={provider} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: AI_PROVIDERS[provider].color + '20', border: `1px solid ${AI_PROVIDERS[provider].color}40`, borderRadius: 50, fontSize: 13, fontWeight: 500, color: AI_PROVIDERS[provider].color }}>
                        <OpsIcon type={`ai-${provider}`} color={AI_PROVIDERS[provider].color} />
                        {AI_PROVIDERS[provider].name}
                      </div>
                      <button onClick={() => handleCopy(content)} style={{ padding: '8px 12px', borderRadius: 50, border: `1px solid ${colors.cardBorder}`, background: colors.cardBg, cursor: 'pointer', fontSize: 12, fontWeight: 500, color: colors.text }}>
                        <OpsIcon type="copy" color={colors.accent} />
                      </button>
                    </div>
                    <div className="output-area" style={{ padding: '20px', background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 14, maxHeight: '50vh', overflowY: 'auto', flex: 1 }}>
                      <FormattedOutput content={content} colors={colors} isDark={isDark} />
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={handleReset} style={{ marginTop: 20, padding: '14px', borderRadius: 50, border: 'none', background: colors.accent, color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer', width: '100%' }}>
                Start Over
              </button>
            </div>
          )}
        </div>

        <ModeSelector
          isOpen={showModeSelector}
          onClose={() => setShowModeSelector(false)}
          selectedMode={generationMode}
          onSelectMode={setGenerationMode}
          selectedProvider={selectedProvider}
          onSelectProvider={setSelectedProvider}
          colors={colors}
          isDark={isDark}
        />
      </div>
    </>
  );
}
