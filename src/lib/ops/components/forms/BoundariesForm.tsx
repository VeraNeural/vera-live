import React, { useState, useRef, useEffect } from 'react';
import { FlexibleAction } from './shared/types';

interface BoundariesFormProps {
  action: FlexibleAction;
  boundaryMode?: string;
  onBoundaryModeChange: (modeId: string) => void;
  boundaryTone?: string;
  onBoundaryToneChange?: (toneId: string) => void;
  boundaryDelivery?: string;
  onBoundaryDeliveryChange?: (deliveryId: string) => void;
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
        const el = ref.current;
        return el.scrollWidth > el.clientWidth + 1;
      });
      setHasOverflow(overflow);
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

  return hasOverflow;
};

export const BoundariesForm: React.FC<BoundariesFormProps> = ({
  action,
  boundaryMode,
  onBoundaryModeChange,
  boundaryTone,
  onBoundaryToneChange,
  boundaryDelivery,
  onBoundaryDeliveryChange,
  colors,
  isDark,
  inputBorder,
  layerCardStyle,
  sectionLabelStyle,
}) => {
  const [showMoreBoundaryModes, setShowMoreBoundaryModes] = useState(false);
  const boundaryToneRef = useRef<HTMLDivElement>(null);
  
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

  const showBoundaryMore = useOverflowWatcher([boundaryToneRef], [action.id]);

  useEffect(() => {
    setShowMoreBoundaryModes(false);
    onBoundaryModeChange('boundary-script');
    onBoundaryToneChange?.('gentle');
    onBoundaryDeliveryChange?.('');
  }, [action.id]);

  return (
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
  );
};
