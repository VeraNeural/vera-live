/**
 * ActivityCard Component
 * 
 * Individual activity card display with icon, title, description, and duration
 */

'use client';

import React from 'react';
import type { Activity, StudioColors } from '../types';
import { ACTIVITY_ICONS } from '../icons';

interface ActivityCardProps {
  activity: Activity;
  colors: StudioColors;
  onActivityClick: (activityId: string) => void;
}

export function ActivityCard({ activity, colors, onActivityClick }: ActivityCardProps) {
  const IconComponent = ACTIVITY_ICONS[activity.id];
  
  return (
    <button
      key={activity.id}
      className="card-btn"
      onClick={() => onActivityClick(activity.id)}
      style={{
        padding: '18px',
        background: colors.cardBg,
        border: `1px solid ${colors.cardBorder}`,
        borderRadius: 14,
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
            {IconComponent && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: 10,
                background: colors.accentGlow,
                flexShrink: 0,
              }}>
                <IconComponent size={20} color={colors.accentDim} />
              </div>
            )}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flex: 1,
            }}>
              <h4 style={{
                fontSize: 15,
                fontWeight: 600,
                color: colors.text,
                lineHeight: 1.3,
              }}>
                {activity.title}
              </h4>
              {!activity.hasExperience && (
                <span style={{
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: colors.accentDim,
                  background: colors.accentGlow,
                  padding: '3px 8px',
                  borderRadius: 10,
                }}>
                  Soon
                </span>
              )}
            </div>
            <span style={{
              fontSize: 11,
              color: colors.accentDim,
              marginLeft: 12,
              flexShrink: 0,
            }}>
              {activity.duration}
            </span>
          </div>
        </div>
        <p style={{
          fontSize: 13,
          color: colors.textDim,
          lineHeight: 1.5,
        }}>
          {activity.description}
        </p>
      </div>
    </button>
  );
}
