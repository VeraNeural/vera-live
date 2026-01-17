import React from 'react';
import { ActionItem } from '../types';
import { OpsIcon } from '../icons';

interface DynamicFormProps {
  action: ActionItem;
  simpleInput: string;
  formFields: Record<string, string>;
  onSimpleInputChange: (value: string) => void;
  onFormFieldChange: (fieldId: string, value: string) => void;
  onGenerate: () => void;
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
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  action,
  simpleInput,
  formFields,
  onSimpleInputChange,
  onFormFieldChange,
  onGenerate,
  isGenerating,
  isValid,
  colors,
  isDark,
}) => {
  return (
    <div style={{ width: '100%', maxWidth: 700, animation: 'fadeIn 0.4s ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
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
          <p style={{ fontSize: 13, color: colors.textMuted }}>{action.description}</p>
        </div>
      </div>

      {action.fields ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {action.fields.map((field) => (
            <div key={field.id}>
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
                  value={formFields[field.id] || ''}
                  onChange={(e) => onFormFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: 12,
                    border: `1px solid ${colors.cardBorder}`,
                    background: colors.cardBg,
                    color: colors.text,
                    fontSize: 15,
                  }}
                />
              )}
              {field.type === 'textarea' && (
                <textarea
                  className="input-field"
                  value={formFields[field.id] || ''}
                  onChange={(e) => onFormFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  rows={12}
                  style={{
                    width: '100%',
                    padding: '18px 20px',
                    borderRadius: 12,
                    border: `1px solid ${colors.cardBorder}`,
                    background: colors.cardBg,
                    color: colors.text,
                    fontSize: 16,
                    lineHeight: 1.6,
                    resize: 'vertical',
                    minHeight: 200,
                  }}
                />
              )}
              {field.type === 'select' && field.options && (
                <select
                  className="input-field"
                  value={formFields[field.id] || ''}
                  onChange={(e) => onFormFieldChange(field.id, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: 12,
                    border: `1px solid ${colors.cardBorder}`,
                    background: isDark ? '#1e1e28' : '#ffffff',
                    color: isDark ? '#e8e4de' : '#2a2a2a',
                    fontSize: 15,
                    cursor: 'pointer',
                    colorScheme: isDark ? 'dark' : 'light',
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
          placeholder={action.placeholder}
          rows={10}
          style={{
            width: '100%',
            padding: '18px 20px',
            borderRadius: 12,
            border: `1px solid ${colors.cardBorder}`,
            background: colors.cardBg,
            color: colors.text,
            fontSize: 16,
            lineHeight: 1.6,
            resize: 'vertical',
            minHeight: 180,
          }}
        />
      )}

      <button
        onClick={onGenerate}
        disabled={!isValid || isGenerating}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: 50,
          border: 'none',
          marginTop: 24,
          background:
            isValid && !isGenerating
              ? `linear-gradient(135deg, ${colors.accent} 0%, ${
                  isDark ? 'rgba(160, 120, 80, 0.9)' : 'rgba(180, 140, 90, 0.9)'
                } 100%)`
              : isDark
              ? 'rgba(255, 180, 100, 0.2)'
              : 'rgba(180, 150, 100, 0.3)',
          color: 'white',
          fontSize: 15,
          fontWeight: 600,
          cursor: isValid && !isGenerating ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {isGenerating ? (
          'Generating...'
        ) : (
          <>
            <span>Generate</span>
            <OpsIcon type="arrow-right" color="white" />
          </>
        )}
      </button>
    </div>
  );
};
