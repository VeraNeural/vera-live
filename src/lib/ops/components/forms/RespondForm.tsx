import React, { useState, useRef, useEffect } from 'react';
import { FlexibleAction } from './shared/types';

interface RespondFormProps {
  action: FlexibleAction;
  respondMode?: string;
  onRespondModeChange: (modeId: string) => void;
  colors: {
    text: string;
    textMuted: string;
    accent: string;
  };
  isDark: boolean;
  inputBorder: string;
  layerCardStyle: React.CSSProperties;
  sectionLabelStyle: React.CSSProperties;
}

// Hook to detect if content overflows
const useOverflowWatcher = (refs: React.RefObject<HTMLElement | null>[], deps: any[] = []) => {
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      const overflow = refs.some((ref) => {
        if (!ref.current) return false;
        return ref.current.scrollHeight > ref.current.clientHeight || ref.current.scrollWidth > ref.current.clientWidth;
      });
      setHasOverflow(overflow);
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, deps);

  return hasOverflow;
};

export const RespondForm: React.FC<RespondFormProps> = ({
  action,
  respondMode,
  onRespondModeChange,
  colors,
  isDark,
  inputBorder,
  layerCardStyle,
  sectionLabelStyle,
}) => {
  const [showMoreRespondModes, setShowMoreRespondModes] = useState(false);
  const respondRowRef = useRef<HTMLDivElement>(null);
  
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

  const showRespondMore = useOverflowWatcher([respondRowRef], [action.id]);

  useEffect(() => {
    setShowMoreRespondModes(false);
  }, [action.id]);

  return (
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
  );
};
