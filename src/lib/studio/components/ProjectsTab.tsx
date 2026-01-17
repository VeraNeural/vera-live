/**
 * ProjectsTab Component
 * 
 * Displays saved creative projects (placeholder for future implementation)
 */

'use client';

import React from 'react';
import type { StudioColors } from '../types';
import { ExpressIcon } from '../icons';

interface ProjectsTabProps {
  colors: StudioColors;
  onBrowseActivities: () => void;
}

export function ProjectsTab({ colors, onBrowseActivities }: ProjectsTabProps) {
  return (
    <div style={{
      width: '100%',
      maxWidth: 400,
      animation: 'fadeIn 0.4s ease-out',
    }}>
      <div style={{
        padding: '50px 24px',
        background: colors.cardBg,
        border: `1px dashed ${colors.cardBorder}`,
        borderRadius: 16,
        textAlign: 'center',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 16,
          opacity: 0.4,
        }}>
          <ExpressIcon size={32} color={colors.text} />
        </div>
        <p style={{
          color: colors.textDim,
          marginBottom: 20,
          fontSize: 14,
        }}>
          No projects yet
        </p>
        <p style={{
          color: colors.textDim,
          marginBottom: 24,
          fontSize: 13,
          lineHeight: 1.5,
        }}>
          Your creative works will appear here.<br />
          Start an activity to begin.
        </p>
        <button
          onClick={onBrowseActivities}
          style={{
            padding: '12px 24px',
            background: colors.accentGlow,
            border: `1px solid ${colors.accentDim}`,
            borderRadius: 50,
            color: colors.text,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Browse Activities
        </button>
      </div>
    </div>
  );
}
