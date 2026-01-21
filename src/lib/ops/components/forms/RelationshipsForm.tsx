import React, { useEffect } from 'react';
import { FlexibleAction } from './shared/types';

interface RelationshipsFormProps {
  action: FlexibleAction;
  relationshipMode?: string;
  onRelationshipModeChange: (mode: string) => void;
  relationshipTone?: string;
  onRelationshipToneChange?: (tone: string) => void;
  relationshipDepth?: string;
  onRelationshipDepthChange?: (depth: string) => void;
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

export const RelationshipsForm: React.FC<RelationshipsFormProps> = ({
  action,
  relationshipMode,
  onRelationshipModeChange,
  relationshipTone,
  onRelationshipToneChange,
  relationshipDepth,
  onRelationshipDepthChange,
  colors,
  isDark,
  inputBorder,
  layerCardStyle,
  sectionLabelStyle,
}) => {
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

  const showRelationshipsTone = relationshipMode === 'relationship-help';

  // Initialize on mount
  useEffect(() => {
    onRelationshipModeChange('perspective-shift');
    onRelationshipToneChange?.('gentle');
    onRelationshipDepthChange?.('short');
  }, [action.id]);

  return (
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
  );
};
