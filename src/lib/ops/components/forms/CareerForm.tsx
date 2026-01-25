import React from 'react';
import { OpsIcon } from '../../icons';
import { FlexibleAction } from './shared/types';

interface CareerFormProps {
  action: FlexibleAction;
  activeOptionId?: string;
  careerTone?: string;
  onCareerToneChange?: (tone: string) => void;
  onSelectDropdownOption?: (option: any) => void;
  formFields: Record<string, string>;
  onFormFieldChange: (field: string, value: string) => void;
  output?: string;
  colors: {
    accent: string;
    text: string;
    textMuted: string;
    cardBg: string;
    cardBorder: string;
  };
  isDark: boolean;
  inputBorder: string;
  inputBg: string;
  layerCardStyle: React.CSSProperties;
  sectionLabelStyle: React.CSSProperties;
}

export const CareerForm: React.FC<CareerFormProps> = ({
  action,
  activeOptionId,
  careerTone,
  onCareerToneChange,
  onSelectDropdownOption,
  formFields,
  onFormFieldChange,
  output,
  colors,
  isDark,
  inputBorder,
  inputBg,
  layerCardStyle,
  sectionLabelStyle,
}) => {
  // Computed values
  const isApplicationKit = action.id === 'career' && activeOptionId === 'application-kit';
  const showCareerTone = action.id === 'career' && (!activeOptionId || activeOptionId === 'cover-letter');

  const careerToneModes = [
    { id: 'professional', label: 'Professional' },
    { id: 'confident', label: 'Confident' },
    { id: 'direct', label: 'Direct' },
    { id: 'polished', label: 'Polished' },
  ];

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

  const applicationKitOutput = isApplicationKit
    ? getApplicationKitSections((output || '').trim())
    : { resume: '', cover: '' };

  if (action.id !== 'career') {
    return null;
  }

  return (
    <>
      {onSelectDropdownOption && !isApplicationKit && (
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
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isDark ? 'rgba(255, 180, 100, 0.1)' : 'rgba(200, 160, 100, 0.12)',
                      border: `1px solid ${isDark ? 'rgba(255, 180, 100, 0.18)' : 'rgba(200, 160, 100, 0.2)'}`,
                      flexShrink: 0,
                    }}
                  >
                    <OpsIcon type={option.icon} color={colors.accent} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: colors.text, marginBottom: 4 }}>
                      {option.label}
                    </div>
                    <div style={{ fontSize: 13, color: colors.textMuted }}>{option.description}</div>
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

      {isApplicationKit && (
        <div style={layerCardStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label
                htmlFor="career-job-description"
                style={{ display: 'block', fontSize: 13, fontWeight: 500, color: colors.textMuted, marginBottom: 6 }}
              >
                Job Description
              </label>
              <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8 }}>
                Paste the job description here
              </div>
              <textarea
                id="career-job-description"
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
              <label
                htmlFor="career-current-resume"
                style={{ display: 'block', fontSize: 13, fontWeight: 500, color: colors.textMuted, marginBottom: 6 }}
              >
                Current Resume
              </label>
              <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8 }}>
                Paste your existing resume here
              </div>
              <textarea
                id="career-current-resume"
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
              <label
                htmlFor="career-optimized-resume"
                style={{ display: 'block', fontSize: 13, fontWeight: 500, color: colors.textMuted, marginBottom: 6 }}
              >
                Optimized Resume
              </label>
              <textarea
                id="career-optimized-resume"
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
              <label
                htmlFor="career-cover-letter"
                style={{ display: 'block', fontSize: 13, fontWeight: 500, color: colors.textMuted, marginBottom: 6 }}
              >
                Cover Letter & Emails
              </label>
              <textarea
                id="career-cover-letter"
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
      )}
    </>
  );
};
