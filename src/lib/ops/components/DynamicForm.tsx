import React, { useState } from 'react';
import { OpsIcon } from '../icons';
import { THINKING_MODES } from '../config/thinkingModes';
import { ACTIVITY_THINKING_MODES } from '../config/activityThinkingModes';
import { FlexibleAction, DynamicFormProps } from './forms/shared/types';
import { FormHeader } from './forms/shared/FormHeader';
import { RespondForm } from './forms/RespondForm';
import { BoundariesForm } from './forms/BoundariesForm';
import { DecodeMessageForm, getDecodePlaceholder } from './forms/DecodeMessageForm';
import { WorkLifeForm } from './forms/WorkLifeForm';
import { MoneyForm } from './forms/MoneyForm';
import { ThinkingForm } from './forms/ThinkingForm';
import { RelationshipsForm } from './forms/RelationshipsForm';

export const DynamicForm: React.FC<DynamicFormProps> = ({
  action,
  activeOptionId,
  output,
  simpleInput,
  formFields,
  onSimpleInputChange,
  onFormFieldChange,
  onGenerate,
  isGenerating,
  isValid,
  colors,
  isDark,
  onDecodeEntryChange,
  respondMode,
  onRespondModeChange,
  boundaryMode,
  onBoundaryModeChange,
  boundaryTone,
  onBoundaryToneChange,
  boundaryDelivery,
  onBoundaryDeliveryChange,
  workLifeMode,
  onWorkLifeModeChange,
  workLifeActivities,
  moneyActivities,
  workLifeTone,
  onWorkLifeToneChange,
  workLifeContext,
  onWorkLifeContextChange,
  workLifeSecondaryMode,
  onWorkLifeSecondaryModeChange,
  thinkingMode,
  onThinkingModeChange,
  thinkingStyle,
  onThinkingStyleChange,
  thinkingDepth,
  onThinkingDepthChange,
  thinkingSecondaryMode,
  onThinkingSecondaryModeChange,
  moneyMode,
  onMoneyModeChange,
  moneyPerspective,
  onMoneyPerspectiveChange,
  moneyScope,
  onMoneyScopeChange,
  moneyContext,
  onMoneyContextChange,
  moneySecondaryMode,
  onMoneySecondaryModeChange,
  relationshipMode,
  onRelationshipModeChange,
  relationshipTone,
  onRelationshipToneChange,
  relationshipDepth,
  onRelationshipDepthChange,
  focusMode,
  onFocusModeChange,
  createActivities,
  createActivityId,
  onCreateActivityChange,
  createOptionId,
  onCreateOptionChange,
  careerTone,
  onCareerToneChange,
  onSelectDropdownOption,
}) => {
  // Helper to get field key (supports both 'id' and 'name' properties)
  const getFieldKey = (field: any): string => {
    return field.id || field.name || '';
  };

  const inputBg = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.96)';
  const inputBorder = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(160, 130, 90, 0.12)';
  const separatorColor = isDark ? 'rgba(235, 210, 180, 0.12)' : 'rgba(140, 110, 80, 0.12)';
  const isApplicationKit = action.id === 'career' && activeOptionId === 'application-kit';
  const showCreateTone = action.id === 'create' && (createActivityId === 'write-email' || createActivityId === 'social-post');
  const showCareerTone = action.id === 'career' && (!activeOptionId || activeOptionId === 'cover-letter');
  const getApplicationKitSections = (text: string) => {
    const resumeMatch = text.match(/##\s*Optimized Resume[\s\S]*?(?=##\s*Cover Letter & Emails|$)/i);
    const coverMatch = text.match(/##\s*Cover Letter & Emails[\s\S]*/i);
    const resume = resumeMatch ? resumeMatch[0].replace(/##\s*Optimized Resume\s*/i, '').trim() : '';
    const cover = coverMatch ? coverMatch[0].replace(/##\s*Cover Letter & Emails\s*/i, '').trim() : '';
    return {
      resume: resume || '',
      cover: cover || (!resume ? text.trim() : ''),
    };
  };

  const [decodeEntry, setDecodeEntry] = useState('text');
  const [showAdvancedThinking, setShowAdvancedThinking] = useState(false);
  const [selectedThinkingMode, setSelectedThinkingMode] = useState<string>('');
  const [personaInput, setPersonaInput] = useState('');
  const decodePlaceholder = getDecodePlaceholder(action, decodeEntry);

  const activityThinkingKey = activeOptionId || action.id;
  const allowedThinkingModes = ACTIVITY_THINKING_MODES[activityThinkingKey] || [];
  const thinkingModeOptions = THINKING_MODES.filter((mode) => allowedThinkingModes.includes(mode.id));
  const selectedThinkingModeOption = thinkingModeOptions.find((mode) => mode.id === selectedThinkingMode);

  React.useEffect(() => {
    setSelectedThinkingMode('');
    setPersonaInput('');
  }, [activityThinkingKey, createActivityId]);

  React.useEffect(() => {
    if (selectedThinkingMode !== 'persona') {
      setPersonaInput('');
    }
  }, [selectedThinkingMode]);

  const handleGenerateClick = () => {
    if (!selectedThinkingModeOption) {
      onGenerate();
      return;
    }

    const personaValue = selectedThinkingModeOption.id === 'persona' ? personaInput.trim() : '';

    onGenerate({
      thinkingMode: {
        id: selectedThinkingModeOption.id,
        label: selectedThinkingModeOption.title,
        ...(personaValue ? { persona: personaValue } : {}),
      },
    });
  };

  const isWorkLifeActivity = Boolean(
    (workLifeActivities && workLifeActivities.some((activity) => activity.id === action.id)) ||
      action.id === 'work-life'
  );
  const isMoneyActivity = Boolean(
    (moneyActivities && moneyActivities.some((activity) => activity.id === action.id)) || action.id === 'money'
  );

  const [activeMode, setActiveMode] = useState<string>('task-breakdown');

  const focusModes = [
    { id: 'think', label: 'THINK' },
    { id: 'decide', label: 'DECIDE' },
    { id: 'do', label: 'DO' },
    { id: 'create', label: 'CREATE' },
    { id: 'reflect', label: 'REFLECT' },
  ];

  const careerToneModes = [
    { id: 'professional', label: 'Professional' },
    { id: 'confident', label: 'Confident' },
    { id: 'direct', label: 'Direct' },
    { id: 'polished', label: 'Polished' },
  ];

  const layerCardStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px',
    borderRadius: 16,
    background: colors.cardBg,
    border: `1px solid ${colors.cardBorder}`,
    marginBottom: 16,
  };

  const sectionLabelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.06em',
    color: colors.textMuted,
    margin: '0 0 8px 4px',
  };

  const thinkingToneRef = React.useRef<HTMLDivElement>(null);

  const useOverflowWatcher = (refs: React.RefObject<HTMLElement | null>[], deps: React.DependencyList) => {
    const [isOverflow, setIsOverflow] = React.useState(false);

    React.useEffect(() => {
      const checkOverflow = () => {
        setIsOverflow(
          refs.some((ref) => {
            const el = ref.current;
            return el ? el.scrollWidth > el.clientWidth + 1 : false;
          })
        );
      };

      checkOverflow();
      const observer = new ResizeObserver(checkOverflow);
      refs.forEach((ref) => {
        if (ref.current) observer.observe(ref.current);
      });
      window.addEventListener('resize', checkOverflow);

      return () => {
        observer.disconnect();
        window.removeEventListener('resize', checkOverflow);
      };
    }, deps);

    return isOverflow;
  };

  const showThinkingMore = useOverflowWatcher([thinkingToneRef], [action.id]);

  const applicationKitOutput = isApplicationKit
    ? getApplicationKitSections((output || '').trim())
    : { resume: '', cover: '' };

  return (
    <div style={{ width: '100%', maxWidth: 700, animation: 'fadeIn 0.4s ease-out' }}>
      <FormHeader
        action={action}
        colors={colors}
        isDark={isDark}
        separatorColor={separatorColor}
        layerCardStyle={layerCardStyle}
      />

      {action.id === 'respond' && onRespondModeChange && (
        <RespondForm
          action={action}
          respondMode={respondMode}
          onRespondModeChange={onRespondModeChange}
          colors={colors}
          isDark={isDark}
          inputBorder={inputBorder}
          layerCardStyle={layerCardStyle}
          sectionLabelStyle={sectionLabelStyle}
        />
      )}

      {action.id === 'boundaries' && onBoundaryModeChange && (
        <BoundariesForm
          action={action}
          boundaryMode={boundaryMode}
          onBoundaryModeChange={onBoundaryModeChange}
          boundaryTone={boundaryTone}
          onBoundaryToneChange={onBoundaryToneChange}
          boundaryDelivery={boundaryDelivery}
          onBoundaryDeliveryChange={onBoundaryDeliveryChange}
          colors={colors}
          isDark={isDark}
          inputBorder={inputBorder}
          layerCardStyle={layerCardStyle}
          sectionLabelStyle={sectionLabelStyle}
        />
      )}

      {isWorkLifeActivity && onWorkLifeModeChange && (
        <WorkLifeForm
          action={action}
          workLifeMode={workLifeMode}
          onWorkLifeModeChange={onWorkLifeModeChange}
          workLifeActivities={workLifeActivities}
          workLifeTone={workLifeTone}
          onWorkLifeToneChange={onWorkLifeToneChange}
          workLifeSecondaryMode={workLifeSecondaryMode}
          onWorkLifeSecondaryModeChange={onWorkLifeSecondaryModeChange}
          onWorkLifeContextChange={onWorkLifeContextChange}
          colors={colors}
          isDark={isDark}
          inputBorder={inputBorder}
          layerCardStyle={layerCardStyle}
          sectionLabelStyle={sectionLabelStyle}
        />
      )}

      {isMoneyActivity && onMoneyModeChange && (
        <MoneyForm
          action={action}
          moneyMode={moneyMode}
          onMoneyModeChange={onMoneyModeChange}
          moneyActivities={moneyActivities}
          moneyPerspective={moneyPerspective}
          onMoneyPerspectiveChange={onMoneyPerspectiveChange}
          moneyScope={moneyScope}
          onMoneyScopeChange={onMoneyScopeChange}
          moneyContext={moneyContext}
          onMoneyContextChange={onMoneyContextChange}
          moneySecondaryMode={moneySecondaryMode}
          onMoneySecondaryModeChange={onMoneySecondaryModeChange}
          activeOptionId={activeOptionId}
          colors={colors}
          isDark={isDark}
          inputBorder={inputBorder}
          layerCardStyle={layerCardStyle}
          sectionLabelStyle={sectionLabelStyle}
        />
      )}

      {action.id === 'thinking-learning' && onThinkingModeChange && (
        <ThinkingForm
          action={action}
          thinkingMode={thinkingMode}
          onThinkingModeChange={onThinkingModeChange}
          thinkingStyle={thinkingStyle}
          onThinkingStyleChange={onThinkingStyleChange}
          thinkingDepth={thinkingDepth}
          onThinkingDepthChange={onThinkingDepthChange}
          thinkingSecondaryMode={thinkingSecondaryMode}
          onThinkingSecondaryModeChange={onThinkingSecondaryModeChange}
          colors={colors}
          isDark={isDark}
          inputBorder={inputBorder}
          layerCardStyle={layerCardStyle}
          sectionLabelStyle={sectionLabelStyle}
        />
      )}

      {action.id === 'relationships-wellness' && onRelationshipModeChange && (
        <RelationshipsForm
          action={action}
          relationshipMode={relationshipMode}
          onRelationshipModeChange={onRelationshipModeChange}
          relationshipTone={relationshipTone}
          onRelationshipToneChange={onRelationshipToneChange}
          relationshipDepth={relationshipDepth}
          onRelationshipDepthChange={onRelationshipDepthChange}
          colors={colors}
          isDark={isDark}
          inputBorder={inputBorder}
          layerCardStyle={layerCardStyle}
          sectionLabelStyle={sectionLabelStyle}
        />
      )}

      {action.id === 'create' && onCreateActivityChange && (
        <>
          <div style={sectionLabelStyle}>Activity</div>
          <div style={layerCardStyle}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(createActivities || []).map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => onCreateActivityChange(activity.id)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 999,
                    border: `1px solid ${activity.id === createActivityId ? colors.accent : inputBorder}`,
                    background: 'transparent',
                    color: activity.id === createActivityId ? colors.text : colors.textMuted,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {activity.title}
                </button>
              ))}
            </div>
          </div>
          {showCreateTone && (
            <>
              <div style={sectionLabelStyle}>Tone</div>
              <div style={layerCardStyle}>
                <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 10 }}>
                  Select the tone of the writing
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {(() => {
                    const selectedActivity = (createActivities || []).find((a) => a.id === createActivityId);
                    const fallbackToneOptions = [
                      { id: 'clear', label: 'Clear' },
                      { id: 'warm', label: 'Warm' },
                      { id: 'bold', label: 'Bold' },
                      { id: 'playful', label: 'Playful' },
                      { id: 'minimal', label: 'Minimal' },
                      { id: 'polished', label: 'Polished' },
                    ];
                    const toneOptions = selectedActivity?.dropdownOptions?.length
                      ? selectedActivity.dropdownOptions
                      : fallbackToneOptions;
                    if (!toneOptions.length) return null;
                    return toneOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => onCreateOptionChange?.(option.id)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 999,
                          border: `1px solid ${option.id === createOptionId ? colors.accent : inputBorder}`,
                          background: 'transparent',
                          color: option.id === createOptionId ? colors.text : colors.textMuted,
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        {option.label}
                      </button>
                    ));
                  })()}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {action.id === 'career' && onSelectDropdownOption && !isApplicationKit && (
        <>
          <div style={sectionLabelStyle}>Activity</div>
          <div style={layerCardStyle}>
            <div style={{ display: 'grid', gap: 12 }}>
              {(action.dropdownOptions || []).map((option) => (
                <button
                  key={option.id}
                  className="card-btn"
                  onClick={() => onSelectDropdownOption(option as any)}
                  style={{
                    padding: '18px 20px',
                    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.85)',
                    border: `1px solid ${option.id === activeOptionId ? colors.accent : colors.cardBorder}`,
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
          {showCareerTone && (
            <>
              <div style={sectionLabelStyle}>Tone</div>
              <div style={layerCardStyle}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {careerToneModes.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => onCareerToneChange?.(tone.id)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 999,
                        border: `1px solid ${tone.id === careerTone ? colors.accent : inputBorder}`,
                        background: 'transparent',
                        color: tone.id === careerTone ? colors.text : colors.textMuted,
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      {tone.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {isApplicationKit && (
        <>
          <div style={sectionLabelStyle}>Activity</div>
          <div style={layerCardStyle}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: 999,
                  border: `1px solid ${colors.accent}`,
                  background: 'transparent',
                  color: colors.text,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Application Kit
              </div>
            </div>
          </div>
        </>
      )}

      {(action.id === 'write-email' || action.id === 'social-post') && onCreateOptionChange && (
        <>
          <div style={sectionLabelStyle}>Activity</div>
          <div style={layerCardStyle}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: 999,
                  border: `1px solid ${colors.accent}`,
                  background: 'transparent',
                  color: colors.text,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {action.id === 'write-email' ? 'Write Email' : 'Social Post'}
              </div>
            </div>
          </div>
          <div style={sectionLabelStyle}>Tone</div>
          <div style={layerCardStyle}>
            <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 10 }}>
              Select the tone of the writing
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(action.id === 'write-email'
                ? (action.dropdownOptions || [])
                : [
                    { id: 'insightful', label: 'Insightful' },
                    { id: 'friendly', label: 'Friendly' },
                    { id: 'bold', label: 'Bold' },
                    { id: 'concise', label: 'Concise' },
                    { id: 'playful', label: 'Playful' },
                    { id: 'storytelling', label: 'Storytelling' },
                  ]
              ).map((option: { id: string; label: string }) => (
                <button
                  key={option.id}
                  onClick={() => onCreateOptionChange(option.id)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 999,
                    border: `1px solid ${option.id === createOptionId ? colors.accent : inputBorder}`,
                    background: 'transparent',
                    color: option.id === createOptionId ? colors.text : colors.textMuted,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {action.id === 'decode-message' && !action.fields && (
        <DecodeMessageForm
          action={action}
          onDecodeEntryChange={(entry) => {
            setDecodeEntry(entry);
            onDecodeEntryChange?.(entry);
          }}
          colors={colors}
          isDark={isDark}
          inputBorder={inputBorder}
          layerCardStyle={layerCardStyle}
          sectionLabelStyle={sectionLabelStyle}
        />
      )}

      {onFocusModeChange && (
        <div style={layerCardStyle}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', color: colors.textMuted, marginBottom: 10 }}>
            FOCUS
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {focusModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => onFocusModeChange(mode.id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  border: `1px solid ${focusMode === mode.id ? colors.accent : inputBorder}`,
                  background: focusMode === mode.id
                    ? (isDark ? 'rgba(255,180,100,0.1)' : 'rgba(200,160,100,0.15)')
                    : 'transparent',
                  color: focusMode === mode.id ? colors.text : colors.textMuted,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {thinkingModeOptions.length > 0 && (
        <div style={layerCardStyle}>
          <button
            onClick={() => setShowAdvancedThinking((prev) => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              background: 'transparent',
              border: 'none',
              padding: 0,
              marginBottom: showAdvancedThinking ? 12 : 0,
              color: colors.text,
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', color: colors.textMuted }}>
              ADVANCED THINKING
            </div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>
              {showAdvancedThinking ? 'Hide' : 'Show'}
            </div>
          </button>
          {showAdvancedThinking && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {thinkingModeOptions.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedThinkingMode(mode.id)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 999,
                      border: `1px solid ${mode.id === selectedThinkingMode ? colors.accent : inputBorder}`,
                      background: 'transparent',
                      color: mode.id === selectedThinkingMode ? colors.text : colors.textMuted,
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    {mode.title}
                  </button>
                ))}
              </div>
              {selectedThinkingMode === 'persona' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted }}>
                    Persona
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={personaInput}
                    onChange={(e) => setPersonaInput(e.target.value)}
                    placeholder="e.g., CEO mentor, trusted friend, historian, product manager"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 12,
                      border: `1px solid ${inputBorder}`,
                      background: inputBg,
                      color: colors.text,
                      fontSize: 14,
                      outline: 'none',
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {isApplicationKit ? (
        <div style={layerCardStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: colors.textMuted, marginBottom: 6 }}>
                Job Description
              </label>
              <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8 }}>
                Paste the job description here
              </div>
              <textarea
                className="input-field"
                value={formFields.jobDescription || ''}
                onChange={(e) => onFormFieldChange('jobDescription', e.target.value)}
                placeholder="Paste the job description here"
                rows={12}
                style={{
                  width: '100%',
                  padding: '20px 22px',
                  borderRadius: 14,
                  border: `1px solid ${inputBorder}`,
                  background: inputBg,
                  color: colors.text,
                  fontSize: 16,
                  lineHeight: 1.6,
                  resize: 'vertical',
                  minHeight: 200,
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: colors.textMuted, marginBottom: 6 }}>
                Current Resume
              </label>
              <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8 }}>
                Paste your existing resume here
              </div>
              <textarea
                className="input-field"
                value={formFields.currentResume || ''}
                onChange={(e) => onFormFieldChange('currentResume', e.target.value)}
                placeholder="Paste your existing resume here"
                rows={12}
                style={{
                  width: '100%',
                  padding: '20px 22px',
                  borderRadius: 14,
                  border: `1px solid ${inputBorder}`,
                  background: inputBg,
                  color: colors.text,
                  fontSize: 16,
                  lineHeight: 1.6,
                  resize: 'vertical',
                  minHeight: 200,
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: colors.textMuted, marginBottom: 6 }}>
                Optimized Resume
              </label>
              <textarea
                className="input-field"
                value={applicationKitOutput.resume}
                placeholder="Generated output will appear here"
                readOnly
                onFocus={(e) => e.currentTarget.select()}
                rows={12}
                style={{
                  width: '100%',
                  padding: '20px 22px',
                  borderRadius: 14,
                  border: `1px solid ${inputBorder}`,
                  background: inputBg,
                  color: colors.text,
                  fontSize: 15,
                  lineHeight: 1.6,
                  resize: 'vertical',
                  minHeight: 220,
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: colors.textMuted, marginBottom: 6 }}>
                Cover Letter & Emails
              </label>
              <textarea
                className="input-field"
                value={applicationKitOutput.cover}
                placeholder="Generated output will appear here"
                readOnly
                onFocus={(e) => e.currentTarget.select()}
                rows={12}
                style={{
                  width: '100%',
                  padding: '20px 22px',
                  borderRadius: 14,
                  border: `1px solid ${inputBorder}`,
                  background: inputBg,
                  color: colors.text,
                  fontSize: 15,
                  lineHeight: 1.6,
                  resize: 'vertical',
                  minHeight: 220,
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div style={layerCardStyle}>
          {action.fields ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {action.fields.map((field) => (
                <div key={getFieldKey(field)}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 500,
                      color: colors.textMuted,
                      marginBottom: 8,
                    }}
                  >
                    {field.label}
                    {field.required && <span style={{ color: colors.accent }}> *</span>}
                  </label>
                  {field.type === 'text' && (
                    <input
                      type="text"
                      className="input-field"
                      value={formFields[getFieldKey(field)] || ''}
                      onChange={(e) => onFormFieldChange(getFieldKey(field), e.target.value)}
                      placeholder={field.placeholder}
                      style={{
                        width: '100%',
                        padding: '16px 18px',
                        borderRadius: 14,
                        border: `1px solid ${inputBorder}`,
                        background: inputBg,
                        color: colors.text,
                        fontSize: 15,
                        outline: 'none',
                      }}
                    />
                  )}
                  {field.type === 'textarea' && (
                    <textarea
                      className="input-field"
                      value={formFields[getFieldKey(field)] || ''}
                      onChange={(e) => onFormFieldChange(getFieldKey(field), e.target.value)}
                      placeholder={field.placeholder}
                      rows={12}
                      style={{
                        width: '100%',
                        padding: '20px 22px',
                        borderRadius: 14,
                        border: `1px solid ${inputBorder}`,
                        background: inputBg,
                        color: colors.text,
                        fontSize: 16,
                        lineHeight: 1.6,
                        resize: 'vertical',
                        minHeight: 200,
                        outline: 'none',
                      }}
                    />
                  )}
                  {field.type === 'select' && field.options && (
                    <select
                      className="input-field"
                      value={formFields[getFieldKey(field)] || ''}
                      onChange={(e) => onFormFieldChange(getFieldKey(field), e.target.value)}
                      style={{
                        width: '100%',
                        padding: '16px 18px',
                        borderRadius: 14,
                        border: `1px solid ${inputBorder}`,
                        background: inputBg,
                        color: colors.text,
                        fontSize: 15,
                        cursor: 'pointer',
                        colorScheme: isDark ? 'dark' : 'light',
                        outline: 'none',
                      }}
                    >
                      <option value="">Select...</option>
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <textarea
              className="input-field"
              value={simpleInput}
              onChange={(e) => onSimpleInputChange(e.target.value)}
              placeholder={decodePlaceholder}
              rows={10}
              style={{
                width: '100%',
                padding: '20px 22px',
                borderRadius: 14,
                border: `1px solid ${inputBorder}`,
                background: inputBg,
                color: colors.text,
                fontSize: 16,
                lineHeight: 1.6,
                resize: 'vertical',
                minHeight: 180,
                outline: 'none',
              }}
            />
          )}
        </div>
      )}

      <div style={{ ...layerCardStyle, marginBottom: 0 }}>
        <button
          onClick={handleGenerateClick}
          disabled={!isValid || isGenerating}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 50,
            border: 'none',
            background:
              isValid && !isGenerating
                ? `linear-gradient(135deg, ${colors.accent} 0%, ${
                    isDark ? 'rgba(160, 120, 80, 0.9)' : 'rgba(180, 140, 90, 0.9)'
                  } 100%)`
                : isDark
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(160, 130, 90, 0.15)',
            color: isValid && !isGenerating ? 'white' : colors.textMuted,
            fontSize: 15,
            fontWeight: 600,
            cursor: isValid && !isGenerating ? 'pointer' : 'not-allowed',
            boxShadow: isValid && !isGenerating ? (isDark ? 'none' : '0 6px 18px rgba(200, 160, 100, 0.3)') : 'none',
          }}
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {action.disclaimer && (
        <div style={{ marginTop: 18 }}>
          <div style={{ height: 1, backgroundColor: separatorColor, marginBottom: 10 }} />
          <div style={{
            fontSize: 11,
            color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(40,35,30,0.55)',
            textAlign: 'center',
            lineHeight: 1.5,
          }}>
            {action.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
};
