// ============================================================================
// ENTRIES LIST COMPONENT
// ============================================================================
// Display list of saved journal entries

import React from 'react';
import type { JournalEntry, MoodOption } from '../types';
import { MOOD_OPTIONS as DEFAULT_MOOD_OPTIONS } from '../data/prompts';

interface EntriesListProps {
  entries: JournalEntry[];
  moodOptions?: MoodOption[];
}

export const EntriesList: React.FC<EntriesListProps> = ({ entries, moodOptions }) => {
  const resolvedMoodOptions = moodOptions ?? DEFAULT_MOOD_OPTIONS;

  if (entries.length === 0) {
    return (
      <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
        <div
          style={{
            padding: 'clamp(38px, 10vw, 65px) clamp(18px, 5vw, 38px)',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'clamp(12px, 3vw, 18px)',
            textAlign: 'center',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
          }}
        >
          <p
            style={{
              color: 'rgba(255, 250, 240, 0.5)',
              marginBottom: 'clamp(10px, 3vw, 16px)',
              fontSize: 'clamp(13px, 3.5vw, 15px)',
            }}
          >
            No journal entries yet
          </p>
          <p
            style={{
              color: 'rgba(255, 250, 240, 0.3)',
              fontSize: 'clamp(11px, 3vw, 13px)',
            }}
          >
            Start writing to see your entries here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(10px, 3vw, 16px)',
        }}
      >
        {entries.map((entry) => {
          const moodOption = entry.mood ? resolvedMoodOptions.find(m => m.id === entry.mood) : null;
          
          return (
            <article
              key={entry.id}
              style={{
                padding: 'clamp(14px, 4vw, 20px)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(200, 175, 140, 0.15)',
                borderRadius: 'clamp(10px, 2.5vw, 14px)',
              }}
            >
              <header
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 'clamp(8px, 2vw, 12px)',
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 'clamp(16px, 4vw, 20px)',
                    fontWeight: 400,
                    color: 'rgba(255, 250, 240, 0.9)',
                  }}
                >
                  {entry.title}
                </h3>
                {moodOption && (
                  <span
                    style={{
                      padding: 'clamp(3px, 0.8vw, 5px) clamp(8px, 2vw, 12px)',
                      background: `${moodOption.color}22`,
                      borderRadius: 12,
                      fontSize: 'clamp(10px, 2.5vw, 12px)',
                      color: moodOption.color,
                    }}
                  >
                    {moodOption.label}
                  </span>
                )}
              </header>
              <p
                style={{
                  color: 'rgba(255, 250, 240, 0.6)',
                  fontSize: 'clamp(12px, 3vw, 14px)',
                  lineHeight: 1.6,
                  marginBottom: 'clamp(8px, 2vw, 12px)',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {entry.content}
              </p>
              <footer
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: 'rgba(255, 250, 240, 0.35)',
                  fontSize: 'clamp(10px, 2.5vw, 12px)',
                }}
              >
                <span>{entry.wordCount} words</span>
                <time>
                  {entry.createdAt.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
              </footer>
            </article>
          );
        })}
      </div>
    </div>
  );
};
