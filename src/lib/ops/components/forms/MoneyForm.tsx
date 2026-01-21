import React, { useState, useEffect, useRef } from 'react';
import { FlexibleAction } from './shared/types';

interface MoneyActivity {
  id: string;
  label?: string;
  title: string;
}

interface MoneyFormProps {
  action: FlexibleAction;
  moneyMode?: string;
  onMoneyModeChange: (mode: string) => void;
  moneyActivities?: MoneyActivity[];
  moneyPerspective?: string;
  onMoneyPerspectiveChange?: (perspective: string) => void;
  moneyScope?: string;
  onMoneyScopeChange?: (scope: string) => void;
  moneyContext?: string;
  onMoneyContextChange?: (context: string) => void;
  moneySecondaryMode?: string;
  onMoneySecondaryModeChange?: (mode: string) => void;
  activeOptionId?: string;
  colors: {
    accent: string;
    text: string;
    textMuted: string;
  };
  isDark: boolean;
  inputBorder: string;
  layerCardStyle: React.CSSProperties;
  sectionLabelStyle: React.CSSProperties;
}

export const MoneyForm: React.FC<MoneyFormProps> = ({
  action,
  moneyMode,
  onMoneyModeChange,
  moneyActivities,
  moneyPerspective,
  onMoneyPerspectiveChange,
  moneyScope,
  onMoneyScopeChange,
  moneyContext,
  onMoneyContextChange,
  moneySecondaryMode,
  onMoneySecondaryModeChange,
  activeOptionId,
  colors,
  isDark,
  inputBorder,
  layerCardStyle,
  sectionLabelStyle,
}) => {
  const [showMoreMoneyModes, setShowMoreMoneyModes] = useState(false);
  const moneyToneRef = useRef<HTMLDivElement>(null);

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

  const showMoneyTone = moneyMode === 'money-conversations' && (!activeOptionId || activeOptionId === 'salary-negotiation');

  const useOverflowWatcher = (refs: React.RefObject<HTMLElement | null>[], deps: React.DependencyList) => {
    const [isOverflow, setIsOverflow] = useState(false);

    useEffect(() => {
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

  const showMoneyMore = useOverflowWatcher([moneyToneRef], [action.id]);

  // Initialize on mount
  useEffect(() => {
    setShowMoreMoneyModes(false);
    if (!moneyMode) {
      onMoneyModeChange('budget-check');
    }
    onMoneyPerspectiveChange?.('conservative');
    onMoneyScopeChange?.('');
    onMoneyContextChange?.('');
    onMoneySecondaryModeChange?.('');
  }, [action.id]);

  const handleModeChange = (modeId: string) => {
    onMoneyModeChange(modeId);
    setShowMoreMoneyModes(false);
  };

  return (
    <>
      <div style={sectionLabelStyle}>Activity</div>
      <div style={layerCardStyle}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {moneyPrimaryModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
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
  );
};
