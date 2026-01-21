import React, { useState, useEffect } from 'react';
import { FlexibleAction } from './shared/types';

interface DecodeMessageFormProps {
  action: FlexibleAction;
  onDecodeEntryChange?: (entry: string) => void;
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

export const DecodeMessageForm: React.FC<DecodeMessageFormProps> = ({
  action,
  onDecodeEntryChange,
  colors,
  isDark,
  inputBorder,
  layerCardStyle,
  sectionLabelStyle,
}) => {
  const [decodeEntry, setDecodeEntry] = useState('text');

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

  useEffect(() => {
    if (onDecodeEntryChange) {
      onDecodeEntryChange(decodeEntry);
    }
  }, [decodeEntry, onDecodeEntryChange]);

  const handleEntryChange = (id: string) => {
    setDecodeEntry(id);
  };

  return (
    <>
      <div style={sectionLabelStyle}>Activity</div>
      <div style={layerCardStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {decodeEntryOptions.primary.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleEntryChange(opt.id)}
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
                onClick={() => handleEntryChange(opt.id)}
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
  );
};

export const getDecodePlaceholder = (action: FlexibleAction, decodeEntry: string): string => {
  if (action.id !== 'decode-message') return action.placeholder;

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

  const allOptions = [...decodeEntryOptions.primary, ...decodeEntryOptions.secondary];
  const match = allOptions.find((opt) => opt.id === decodeEntry);
  return match?.placeholder || action.placeholder;
};
