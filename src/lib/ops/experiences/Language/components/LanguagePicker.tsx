'use client';

import React from 'react';
import type { Language, LanguageRegion } from '../types';

type Colors = {
  text: string;
  textMuted: string;
  accent: string;
  cardBg: string;
  cardBorder: string;
};

type Props = {
  regions: LanguageRegion[];
  selected?: Language | null;
  onSelect: (language: Language) => void;
  colors: Colors;
  isDark: boolean;
};

export default function LanguagePicker({ regions, selected, onSelect, colors, isDark }: Props) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 28,
            fontWeight: 300,
            color: colors.text,
            marginBottom: 6,
          }}
        >
          What language do you want to learn?
        </div>
        <div style={{ fontSize: 13, color: colors.textMuted }}>
          Pick a language — then choose a lesson or translate.
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {regions.map((region) => (
          <div key={region.id}>
            <div
              style={{
                fontSize: 12,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: colors.textMuted,
                margin: '8px 2px 10px',
              }}
            >
              {region.title}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: 10,
              }}
            >
              {region.languages.map((lang) => {
                const isSelected = selected?.code === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => onSelect(lang)}
                    className="card-btn"
                    style={{
                      padding: '14px 14px',
                      background: colors.cardBg,
                      border: `1px solid ${isSelected ? colors.accent : colors.cardBorder}`,
                      borderRadius: 14,
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      boxShadow: isSelected
                        ? isDark
                          ? `0 0 0 1px ${colors.accent}40, 0 12px 30px rgba(0,0,0,0.22)`
                          : `0 0 0 1px ${colors.accent}35, 0 12px 30px rgba(0,0,0,0.10)`
                        : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                        border: `1px solid ${colors.cardBorder}`,
                        fontSize: 18,
                      }}
                    >
                      {lang.flag}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{lang.name}</div>
                      <div style={{ fontSize: 12, color: colors.textMuted }}>{lang.code}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
