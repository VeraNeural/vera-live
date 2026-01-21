import React from 'react';
import { FlexibleAction } from './shared/types';

interface CreateFormProps {
  action: FlexibleAction;
  createActivities?: Array<{ id: string; title: string; dropdownOptions?: Array<{ id: string; label: string }> }>;
  createActivityId?: string;
  onCreateActivityChange?: (activityId: string) => void;
  createOptionId?: string;
  onCreateOptionChange?: (optionId: string) => void;
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

export const CreateForm: React.FC<CreateFormProps> = ({
  action,
  createActivities,
  createActivityId,
  onCreateActivityChange,
  createOptionId,
  onCreateOptionChange,
  colors,
  isDark,
  inputBorder,
  layerCardStyle,
  sectionLabelStyle,
}) => {
  // Computed values
  const showCreateTone =
    action.id === 'create' && (createActivityId === 'write-email' || createActivityId === 'social-post');

  // Handle action.id === 'create' with dynamic activities
  if (action.id === 'create' && onCreateActivityChange) {
    return (
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
    );
  }

  // Handle action.id === 'write-email' or 'social-post' with static tone options
  if ((action.id === 'write-email' || action.id === 'social-post') && onCreateOptionChange) {
    return (
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
    );
  }

  return null;
};
