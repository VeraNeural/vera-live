import React, { useState } from 'react';
import { ActionItem } from '../types';
import { OpsIcon } from '../icons';
import { THINKING_MODES } from '../config/thinkingModes';
import { ACTIVITY_THINKING_MODES } from '../config/activityThinkingModes';

// Make DynamicForm accept activities with either field structure
type FlexibleAction = Omit<ActionItem, 'fields'> & {
  fields?: Array<{
    id?: string;
    name?: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'number';
    placeholder?: string;
    options?: { value: string; label: string }[];
    required?: boolean;
  }>;
  dropdownOptions?: Array<{
    id: string;
    label: string;
    description: string;
    icon: string;
    placeholder?: string;
  }>;
  disclaimer?: string;
};

interface DynamicFormProps {
  action: FlexibleAction;
  activeOptionId?: string;
  output?: string | null;
  simpleInput: string;
  formFields: Record<string, string>;
  onSimpleInputChange: (value: string) => void;
  onFormFieldChange: (fieldId: string, value: string) => void;
  onGenerate: (payload?: { thinkingMode?: { id: string; label: string; persona?: string } }) => void;
  isGenerating: boolean;
  isValid: boolean;
  colors: {
    text: string;
    textMuted: string;
    accent: string;
    cardBg: string;
    cardBorder: string;
  };
  isDark: boolean;
  onDecodeEntryChange?: (entryId: string) => void;
  respondMode?: string;
  onRespondModeChange?: (modeId: string) => void;
  boundaryMode?: string;
  onBoundaryModeChange?: (modeId: string) => void;
  boundaryTone?: string;
  onBoundaryToneChange?: (toneId: string) => void;
  boundaryDelivery?: string;
  onBoundaryDeliveryChange?: (deliveryId: string) => void;
  workLifeMode?: string;
  onWorkLifeModeChange?: (modeId: string) => void;
  workLifeActivities?: Array<{ id: string; title: string; label?: string }>;
  moneyActivities?: Array<{ id: string; title: string; label?: string }>;
  workLifeTone?: string;
  onWorkLifeToneChange?: (toneId: string) => void;
  workLifeContext?: string;
  onWorkLifeContextChange?: (contextId: string) => void;
  workLifeSecondaryMode?: string;
  onWorkLifeSecondaryModeChange?: (modeId: string) => void;
  thinkingMode?: string;
  onThinkingModeChange?: (modeId: string) => void;
  thinkingStyle?: string;
  onThinkingStyleChange?: (styleId: string) => void;
  thinkingDepth?: string;
  onThinkingDepthChange?: (depthId: string) => void;
  thinkingSecondaryMode?: string;
  onThinkingSecondaryModeChange?: (modeId: string) => void;
  moneyMode?: string;
  onMoneyModeChange?: (modeId: string) => void;
  moneyPerspective?: string;
  onMoneyPerspectiveChange?: (perspectiveId: string) => void;
  moneyScope?: string;
  onMoneyScopeChange?: (scopeId: string) => void;
  moneyContext?: string;
  onMoneyContextChange?: (contextId: string) => void;
  moneySecondaryMode?: string;
  onMoneySecondaryModeChange?: (modeId: string) => void;
  relationshipMode?: string;
  onRelationshipModeChange?: (modeId: string) => void;
  relationshipTone?: string;
  onRelationshipToneChange?: (toneId: string) => void;
  relationshipDepth?: string;
  onRelationshipDepthChange?: (depthId: string) => void;
  focusMode?: string;
  onFocusModeChange?: (modeId: string) => void;
  createActivities?: Array<{ id: string; title: string; description: string; dropdownOptions?: Array<{ id: string; label: string; description: string; icon: string }> }>;
  createActivityId?: string;
  onCreateActivityChange?: (activityId: string) => void;
  createOptionId?: string;
  onCreateOptionChange?: (optionId: string) => void;
  careerTone?: string;
  onCareerToneChange?: (toneId: string) => void;
  onSelectDropdownOption?: (option: { id: string; label: string; description: string; icon: string; placeholder: string; systemPrompt: string; fields?: any[] }) => void;
}

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
  const showMoneyTone = action.id === 'money' && moneyMode === 'money-conversations' && (!activeOptionId || activeOptionId === 'salary-negotiation');
  const showRelationshipsTone = action.id === 'relationships-wellness' && relationshipMode === 'relationship-help';
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
  const decodeEntryOptions = {
    primary: [
      { id: 'email', label: 'Decode an email', placeholder: 'Paste the email you want to decode...' },
      { id: 'text', label: 'Decode a text', placeholder: 'Paste the text you want to decode...' },
      { id: 'summary', label: 'Summarize something', placeholder: 'Paste the content you want summarized...' },
    ],
    secondary: [
      { id: 'promise', label: 'Decode a promise', placeholder: 'Paste the promise you want to decode...' },
      { id: 'request', label: 'Decode a request', placeholder: 'Paste the request you want to decode...' },
      { id: 'sales', label: 'Decode a sales message', placeholder: 'Paste the sales message you want to decode...' },
      { id: 'boundary', label: 'Decode a boundary message', placeholder: 'Paste the boundary message you want to decode...' },
      { id: 'legal', label: 'Decode a legal notice', placeholder: 'Paste the legal notice you want to decode...' },
      { id: 'work', label: 'Decode a work message', placeholder: 'Paste the work message you want to decode...' },
      { id: 'personal', label: 'Decode a personal message', placeholder: 'Paste the personal message you want to decode...' },
      { id: 'power', label: 'Decode a power dynamic', placeholder: 'Paste the message you want to decode...' },
    ],
  };
  const decodePlaceholder = (() => {
    if (action.id !== 'decode-message') return action.placeholder;
    const allOptions = [...decodeEntryOptions.primary, ...decodeEntryOptions.secondary];
    const match = allOptions.find((opt) => opt.id === decodeEntry);
    return match?.placeholder || action.placeholder;
  })();

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

  const [showMoreBoundaryModes, setShowMoreBoundaryModes] = useState(false);
  const boundaryPrimaryModes = [
    { id: 'boundary-script', label: 'Boundary Script' },
    { id: 'tough-conversation', label: 'Tough Conversation' },
    { id: 'say-no-clearly', label: 'Say No Clearly' },
  ];
  const boundaryToneModes = [
    { id: 'gentle', label: 'Gentle' },
    { id: 'firm', label: 'Firm' },
    { id: 'professional', label: 'Professional' },
    { id: 'personal', label: 'Personal' },
  ];
  const boundarySecondaryModes = [
    { id: 'short-direct', label: 'Short & Direct' },
    { id: 'long-thoughtful', label: 'Long & Thoughtful' },
    { id: 'written-message', label: 'Written Message' },
    { id: 'spoken-conversation', label: 'Spoken Conversation' },
  ];

  const [showMoreRespondModes, setShowMoreRespondModes] = useState(false);
  const respondPrimaryModes = [
    { id: 'quick', label: 'Quick' },
    { id: 'follow-up', label: 'Follow up' },
    { id: 'acknowledge', label: 'Acknowledge' },
    { id: 'buy-time', label: 'Buy time' },
  ];
  const respondSecondaryModes = [
    { id: 'decline', label: 'Decline' },
    { id: 'clarify', label: 'Clarify' },
    { id: 'apology', label: 'Apology' },
    { id: 'reframe', label: 'Reframe' },
    { id: 'confirm-understanding', label: 'Confirm understanding' },
  ];

  const isWorkLifeActivity = Boolean(
    (workLifeActivities && workLifeActivities.some((activity) => activity.id === action.id)) ||
      action.id === 'work-life'
  );
  const isMoneyActivity = Boolean(
    (moneyActivities && moneyActivities.some((activity) => activity.id === action.id)) || action.id === 'money'
  );

  const [activeMode, setActiveMode] = useState<string>('task-breakdown');
  const showWorkLifeTone = isWorkLifeActivity && (activeMode === 'decision-helper' || activeMode === 'planning');
  const [showMoreModes, setShowMoreModes] = useState(false);
  const workLifePrimaryModes = (workLifeActivities?.length
    ? workLifeActivities.map((activity) => ({
        id: activity.id,
        label: activity.label || activity.title,
      }))
    : [
        { id: 'task-breakdown', label: 'Task Breakdown' },
        { id: 'decision-helper', label: 'Decision Helper' },
        { id: 'planning', label: 'Planning' },
      ]
  );
  const workLifeToneModes = [
    { id: 'clear', label: 'Clear' },
    { id: 'strategic', label: 'Strategic' },
    { id: 'practical', label: 'Practical' },
    { id: 'calm', label: 'Calm' },
  ];
  const workLifeSecondaryModes = [
    { id: 'prioritization', label: 'Prioritization' },
    { id: 'time', label: 'Time Blocking' },
    { id: 'overwhelm', label: 'Overwhelm Reset' },
    { id: 'project', label: 'Project Mapping' },
  ];

  const [showMoreMoneyModes, setShowMoreMoneyModes] = useState(false);
  const moneyPrimaryModes = moneyActivities?.length
    ? moneyActivities.map((activity) => ({
        id: activity.id,
        label: activity.label || activity.title,
      }))
    : [
        { id: 'budget-check', label: 'Budget Check' },
        { id: 'savings-goal', label: 'Savings Goal' },
        { id: 'investment-basics', label: 'Investment Basics' },
        { id: 'expense-review', label: 'Expense Review' },
        { id: 'money-conversations', label: 'Money Conversations' },
      ];
  const moneyPerspectiveModes = [
    { id: 'conservative', label: 'Conservative' },
    { id: 'balanced', label: 'Balanced' },
    { id: 'aggressive', label: 'Aggressive' },
    { id: 'risk-aware', label: 'Risk-Aware' },
  ];
  const moneySecondaryModes = [
    { id: 'cash-flow', label: 'Cash Flow' },
    { id: 'tradeoff-analysis', label: 'Tradeoff Analysis' },
    { id: 'scenario-comparison', label: 'Scenario Comparison' },
    { id: 'risk-scan', label: 'Risk Scan' },
    { id: 'cost-breakdown', label: 'Cost Breakdown' },
  ];
  const moneyScopeModes = [
    { id: 'monthly', label: 'Monthly' },
    { id: 'short-term', label: 'Short-Term (3–6 months)' },
    { id: 'long-term', label: 'Long-Term' },
    { id: 'one-time', label: 'One-Time Decision' },
  ];
  const moneyContextModes = [
    { id: 'personal', label: 'Personal' },
    { id: 'household', label: 'Household' },
    { id: 'business-freelance', label: 'Business / Freelance' },
    { id: 'shared-finances', label: 'Shared Finances' },
  ];

  const [showMoreThinkingModes, setShowMoreThinkingModes] = useState(false);
  const thinkingPrimaryModes = [
    { id: 'brainstorm', label: 'Brainstorm' },
    { id: 'summarize', label: 'Summarize' },
    { id: 'explain-like', label: 'Explain Like…' },
    { id: 'perspective-shift', label: 'Perspective Shift' },
  ];
  const thinkingSecondaryModes = [
    { id: 'compare-ideas', label: 'Compare Ideas' },
    { id: 'clarify-thinking', label: 'Clarify Thinking' },
    { id: 'reduce-complexity', label: 'Reduce Complexity' },
    { id: 'expand-options', label: 'Expand Options' },
    { id: 'mental-model', label: 'Mental Model' },
  ];
  const thinkingStyleModes = [
    { id: 'simple', label: 'Simple' },
    { id: 'structured', label: 'Structured' },
    { id: 'creative', label: 'Creative' },
    { id: 'analytical', label: 'Analytical' },
  ];
  const thinkingDepthModes = [
    { id: 'short', label: 'Short' },
    { id: 'medium', label: 'Medium' },
    { id: 'deep', label: 'Deep' },
  ];

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

  const respondRowRef = React.useRef<HTMLDivElement>(null);
  const boundaryToneRef = React.useRef<HTMLDivElement>(null);
  const workLifeToneRef = React.useRef<HTMLDivElement>(null);
  const moneyToneRef = React.useRef<HTMLDivElement>(null);
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

  const showRespondMore = useOverflowWatcher([respondRowRef], [action.id]);
  const showBoundaryMore = useOverflowWatcher([boundaryToneRef], [action.id]);
  const showWorkLifeMore = useOverflowWatcher([workLifeToneRef], [action.id]);
  const showMoneyMore = useOverflowWatcher([moneyToneRef], [action.id]);
  const showThinkingMore = useOverflowWatcher([thinkingToneRef], [action.id]);

  const relationshipPrimaryModes = [
    { id: 'perspective-shift', label: 'Perspective Shift' },
    { id: 'vent-session', label: 'Vent Session' },
    { id: 'self-check-in', label: 'Self Check-In' },
    { id: 'relationship-help', label: 'Relationship Help' },
  ];
  const relationshipToneModes = [
    { id: 'gentle', label: 'Gentle' },
    { id: 'honest', label: 'Honest' },
    { id: 'grounded', label: 'Grounded' },
    { id: 'supportive', label: 'Supportive' },
  ];
  const relationshipDepthModes = [
    { id: 'short', label: 'Short' },
    { id: 'medium', label: 'Medium' },
    { id: 'deep', label: 'Deep' },
  ];

  React.useEffect(() => {
    if (action.id === 'decode-message' && onDecodeEntryChange) {
      onDecodeEntryChange(decodeEntry);
    }
  }, [action.id, decodeEntry, onDecodeEntryChange]);

  React.useEffect(() => {
    if (!isWorkLifeActivity) return;
    if (!workLifeMode) return;
    if (workLifeMode === activeMode) return;
    setActiveMode(workLifeMode);
  }, [isWorkLifeActivity, workLifeMode, activeMode]);

  React.useEffect(() => {
    if (action.id === 'respond') {
      setShowMoreRespondModes(false);
    }
    if (action.id === 'boundaries') {
      setShowMoreBoundaryModes(false);
      onBoundaryModeChange?.('boundary-script');
      onBoundaryToneChange?.('gentle');
      onBoundaryDeliveryChange?.('');
    }
    if (isWorkLifeActivity) {
      setShowMoreModes(false);
      const defaultWorkLifeId = workLifeMode || workLifeActivities?.[0]?.id || 'task-breakdown';
      setActiveMode(defaultWorkLifeId);
      if (!workLifeMode) {
        onWorkLifeModeChange?.(defaultWorkLifeId);
      }
      onWorkLifeToneChange?.('clear');
      onWorkLifeContextChange?.('');
      onWorkLifeSecondaryModeChange?.('');
    }
    if (isMoneyActivity) {
      setShowMoreMoneyModes(false);
      if (!moneyMode) {
        onMoneyModeChange?.('budget-check');
      }
      onMoneyPerspectiveChange?.('conservative');
      onMoneyScopeChange?.('');
      onMoneyContextChange?.('');
      onMoneySecondaryModeChange?.('');
    }
    if (action.id === 'thinking-learning') {
      setShowMoreThinkingModes(false);
      onThinkingModeChange?.('brainstorm');
      onThinkingStyleChange?.('simple');
      onThinkingDepthChange?.('short');
      onThinkingSecondaryModeChange?.('');
    }
    if (action.id === 'relationships-wellness') {
      onRelationshipModeChange?.('perspective-shift');
      onRelationshipToneChange?.('gentle');
      onRelationshipDepthChange?.('short');
    }
  }, [action.id]);

  const applicationKitOutput = isApplicationKit
    ? getApplicationKitSections((output || '').trim())
    : { resume: '', cover: '' };

  return (
    <div style={{ width: '100%', maxWidth: 700, animation: 'fadeIn 0.4s ease-out' }}>
      <div style={layerCardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isDark
                ? 'rgba(255, 180, 100, 0.1)'
                : 'rgba(200, 160, 100, 0.15)',
            }}
          >
            <OpsIcon type={action.icon} color={colors.accent} />
          </div>
          <div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 22,
                fontWeight: 300,
                color: colors.text,
              }}
            >
              {action.title}
            </h2>
            <p style={{ fontSize: 13, color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(30,30,30,0.7)' }}>{action.description}</p>
          </div>
        </div>
        <div style={{ height: 1, backgroundColor: separatorColor }} />
      </div>

      {action.id === 'respond' && onRespondModeChange && (
        <>
          <div style={sectionLabelStyle}>Activity</div>
          <div style={layerCardStyle}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div ref={respondRowRef} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {respondPrimaryModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      onRespondModeChange(mode.id);
                      setShowMoreRespondModes(false);
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 999,
                      border: `1px solid ${mode.id === respondMode ? colors.accent : inputBorder}`,
                      background: 'transparent',
                      color: mode.id === respondMode ? colors.text : colors.textMuted,
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
              {showRespondMore && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setShowMoreRespondModes((prev) => !prev)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 999,
                      border: `1px solid ${showMoreRespondModes ? colors.accent : inputBorder}`,
                      background: 'transparent',
                      color: showMoreRespondModes ? colors.text : colors.textMuted,
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    More
                  </button>
                </div>
              )}
              {showMoreRespondModes && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {respondSecondaryModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => {
                        onRespondModeChange(mode.id);
                        setShowMoreRespondModes(false);
                      }}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 999,
                        border: `1px solid ${mode.id === respondMode ? colors.accent : inputBorder}`,
                        background: 'transparent',
                        color: mode.id === respondMode ? colors.text : colors.textMuted,
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={sectionLabelStyle}>Tone</div>
          <div style={layerCardStyle} />
        </>
      )}

      {action.id === 'boundaries' && onBoundaryModeChange && (
        <>
          <div style={sectionLabelStyle}>Activity</div>
          <div style={layerCardStyle}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {boundaryPrimaryModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    onBoundaryModeChange(mode.id);
                    setShowMoreBoundaryModes(false);
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 999,
                    border: `1px solid ${mode.id === boundaryMode ? colors.accent : inputBorder}`,
                    background: 'transparent',
                    color: mode.id === boundaryMode ? colors.text : colors.textMuted,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
          <div style={sectionLabelStyle}>Tone</div>
          <div style={layerCardStyle}>
            <div ref={boundaryToneRef} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {onBoundaryToneChange && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {boundaryToneModes.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => onBoundaryToneChange(tone.id)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 999,
                        border: `1px solid ${tone.id === boundaryTone ? colors.accent : inputBorder}`,
                        background: 'transparent',
                        color: tone.id === boundaryTone ? colors.text : colors.textMuted,
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      {tone.label}
                    </button>
                  ))}
                </div>
              )}
              {showBoundaryMore && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setShowMoreBoundaryModes((prev) => !prev)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 999,
                      border: `1px solid ${showMoreBoundaryModes ? colors.accent : inputBorder}`,
                      background: 'transparent',
                      color: showMoreBoundaryModes ? colors.text : colors.textMuted,
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    More
                  </button>
                </div>
              )}
              {showMoreBoundaryModes && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {boundarySecondaryModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => {
                        onBoundaryDeliveryChange?.(mode.id);
                        setShowMoreBoundaryModes(false);
                      }}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 999,
                        border: `1px solid ${mode.id === boundaryDelivery ? colors.accent : inputBorder}`,
                        background: 'transparent',
                        color: mode.id === boundaryDelivery ? colors.text : colors.textMuted,
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {isWorkLifeActivity && onWorkLifeModeChange && (
        <>
          <div style={sectionLabelStyle}>Activity</div>
          <div style={layerCardStyle}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {workLifePrimaryModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setActiveMode(mode.id as typeof activeMode);
                    onWorkLifeModeChange(mode.id);
                    setShowMoreModes(false);
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 999,
                    border: `1px solid ${mode.id === activeMode ? colors.accent : inputBorder}`,
                    background: 'transparent',
                    color: mode.id === activeMode ? colors.text : colors.textMuted,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
          {showWorkLifeTone && (
            <>
              <div style={sectionLabelStyle}>Tone</div>
              <div style={layerCardStyle}>
                <div ref={workLifeToneRef} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {onWorkLifeToneChange && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {workLifeToneModes.map((tone) => (
                        <button
                          key={tone.id}
                          onClick={() => onWorkLifeToneChange(tone.id)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: 999,
                            border: `1px solid ${tone.id === workLifeTone ? colors.accent : inputBorder}`,
                            background: 'transparent',
                            color: tone.id === workLifeTone ? colors.text : colors.textMuted,
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                        >
                          {tone.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {showWorkLifeMore && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setShowMoreModes((prev) => !prev)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 999,
                          border: `1px solid ${showMoreModes ? colors.accent : inputBorder}`,
                          background: 'transparent',
                          color: showMoreModes ? colors.text : colors.textMuted,
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        More
                      </button>
                    </div>
                  )}
                  {showMoreModes && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {workLifeSecondaryModes.map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => onWorkLifeSecondaryModeChange?.(mode.id)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: 999,
                            border: `1px solid ${mode.id === workLifeSecondaryMode ? colors.accent : inputBorder}`,
                            background: 'transparent',
                            color: mode.id === workLifeSecondaryMode ? colors.text : colors.textMuted,
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {isMoneyActivity && onMoneyModeChange && (
        <>
          <div style={sectionLabelStyle}>Activity</div>
          <div style={layerCardStyle}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {moneyPrimaryModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    onMoneyModeChange(mode.id);
                    setShowMoreMoneyModes(false);
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 999,
                    border: `1px solid ${mode.id === moneyMode ? colors.accent : inputBorder}`,
                    background: 'transparent',
                    color: mode.id === moneyMode ? colors.text : colors.textMuted,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
          {showMoneyTone && (
            <>
              <div style={sectionLabelStyle}>Tone</div>
              <div style={layerCardStyle}>
                <div ref={moneyToneRef} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {onMoneyPerspectiveChange && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {moneyPerspectiveModes.map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => onMoneyPerspectiveChange(mode.id)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: 999,
                            border: `1px solid ${mode.id === moneyPerspective ? colors.accent : inputBorder}`,
                            background: 'transparent',
                            color: mode.id === moneyPerspective ? colors.text : colors.textMuted,
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {onMoneyScopeChange && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {moneyScopeModes.map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => onMoneyScopeChange(mode.id)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: 999,
                            border: `1px solid ${mode.id === moneyScope ? colors.accent : inputBorder}`,
                            background: 'transparent',
                            color: mode.id === moneyScope ? colors.text : colors.textMuted,
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {onMoneyContextChange && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {moneyContextModes.map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => onMoneyContextChange(mode.id)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: 999,
                            border: `1px solid ${mode.id === moneyContext ? colors.accent : inputBorder}`,
                            background: 'transparent',
                            color: mode.id === moneyContext ? colors.text : colors.textMuted,
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {showMoneyMore && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setShowMoreMoneyModes((prev) => !prev)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 999,
                          border: `1px solid ${showMoreMoneyModes ? colors.accent : inputBorder}`,
                          background: 'transparent',
                          color: showMoreMoneyModes ? colors.text : colors.textMuted,
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        More
                      </button>
                    </div>
                  )}
                  {showMoreMoneyModes && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {moneySecondaryModes.map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => onMoneySecondaryModeChange?.(mode.id)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: 999,
                            border: `1px solid ${mode.id === moneySecondaryMode ? colors.accent : inputBorder}`,
                            background: 'transparent',
                            color: mode.id === moneySecondaryMode ? colors.text : colors.textMuted,
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {action.id === 'thinking-learning' && onThinkingModeChange && (
        <>
          <div style={sectionLabelStyle}>Activity</div>
          <div style={layerCardStyle}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {thinkingPrimaryModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    onThinkingModeChange(mode.id);
                    setShowMoreThinkingModes(false);
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 999,
                    border: `1px solid ${mode.id === thinkingMode ? colors.accent : inputBorder}`,
                    background: 'transparent',
                    color: mode.id === thinkingMode ? colors.text : colors.textMuted,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {action.id === 'relationships-wellness' && onRelationshipModeChange && (
        <>
          <div style={sectionLabelStyle}>Activity</div>
          <div style={layerCardStyle}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {relationshipPrimaryModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => onRelationshipModeChange(mode.id)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 999,
                    border: `1px solid ${mode.id === relationshipMode ? colors.accent : inputBorder}`,
                    background: 'transparent',
                    color: mode.id === relationshipMode ? colors.text : colors.textMuted,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
          {showRelationshipsTone && (
            <>
              <div style={sectionLabelStyle}>Tone</div>
              <div style={layerCardStyle}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {onRelationshipToneChange && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {relationshipToneModes.map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => onRelationshipToneChange(mode.id)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: 999,
                            border: `1px solid ${mode.id === relationshipTone ? colors.accent : inputBorder}`,
                            background: 'transparent',
                            color: mode.id === relationshipTone ? colors.text : colors.textMuted,
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {onRelationshipDepthChange && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {relationshipDepthModes.map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => onRelationshipDepthChange(mode.id)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: 999,
                            border: `1px solid ${mode.id === relationshipDepth ? colors.accent : inputBorder}`,
                            background: 'transparent',
                            color: mode.id === relationshipDepth ? colors.text : colors.textMuted,
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </>
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
        <>
          <div style={sectionLabelStyle}>Activity</div>
          <div style={layerCardStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {decodeEntryOptions.primary.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setDecodeEntry(opt.id)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 999,
                    border: `1px solid ${opt.id === decodeEntry ? colors.accent : inputBorder}`,
                    background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.7)',
                    color: opt.id === decodeEntry ? colors.text : colors.textMuted,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, opacity: 0.8 }}>
              {decodeEntryOptions.secondary.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setDecodeEntry(opt.id)}
                  style={{
                    padding: '7px 11px',
                    borderRadius: 999,
                    border: `1px solid ${opt.id === decodeEntry ? colors.accent : inputBorder}`,
                    background: 'transparent',
                    color: opt.id === decodeEntry ? colors.text : colors.textMuted,
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          </div>
        </>
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
