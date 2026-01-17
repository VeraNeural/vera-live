// ============================================================================
// MOOD SELECTOR COMPONENT
// ============================================================================
// Mood picker with 6 mood options

import React from 'react';
import type { Mood } from '../types';
import { MOOD_OPTIONS } from '../data/prompts';

export interface MoodSelectorProps {
  selectedMood: Mood | null;
  onMoodSelect: (mood: Mood) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onMoodSelect,
}) => {
  return (
    <div style={{ marginTop: 'clamp(14px, 4vw, 22px)' }}>
      <p
        style={{
          fontSize: 'clamp(11px, 3vw, 13px)',
          color: 'rgba(255, 250, 240, 0.45)',
          marginBottom: 'clamp(9px, 2.5vw, 13px)',
        }}
      >
        How are you feeling?
      </p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'clamp(7px, 2vw, 11px)',
        }}
        role="radiogroup"
        aria-label="Select your mood"
      >
        {MOOD_OPTIONS.map((mood) => (
          <button
            key={mood.id}
            className="mood-btn"
            onClick={() => onMoodSelect(mood.id)}
            role="radio"
            aria-checked={selectedMood === mood.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(5px, 1.4vw, 7px)',
              padding: 'clamp(7px, 2vw, 11px) clamp(12px, 3vw, 16px)',
              background: selectedMood === mood.id ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${selectedMood === mood.id ? mood.color : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: 25,
              color: selectedMood === mood.id ? '#fff' : 'rgba(255, 255, 255, 0.6)',
              fontSize: 'clamp(11px, 2.8vw, 13px)',
            }}
          >
            <span
              style={{
                width: 'clamp(5px, 1.4vw, 7px)',
                height: 'clamp(5px, 1.4vw, 7px)',
                borderRadius: '50%',
                background: mood.color,
                boxShadow: selectedMood === mood.id ? `0 0 8px ${mood.color}` : 'none',
              }}
            />
            {mood.label}
          </button>
        ))}
      </div>
    </div>
  );
};
