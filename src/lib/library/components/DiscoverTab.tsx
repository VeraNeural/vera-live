/**
 * DiscoverTab Component
 * 
 * Discover tab view with assessments list and completion tracking.
 */

'use client';

import React from 'react';
import type { DiscoverAssessment, DBAssessment } from '../types';
import { ASSESSMENTS } from '../data/assessments';
import { AssessmentIcon } from '../icons';

interface DiscoverTabProps {
  colors: {
    bg: string;
    text: string;
    textMuted: string;
    textDim: string;
    cardBg: string;
    cardBorder: string;
    accent: string;
    accentDim: string;
  };
  completedAssessments: string[];
  onAssessmentSelect: (assessmentId: string) => void;
  onStartAssessment?: (assessmentId: string) => void;
  dbAssessments?: DBAssessment[];
  onDynamicAssessmentSelect?: (assessment: DBAssessment) => void;
}

export function DiscoverTab({
  colors,
  completedAssessments,
  onAssessmentSelect,
  onStartAssessment,
  dbAssessments = [],
  onDynamicAssessmentSelect,
}: DiscoverTabProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      maxWidth: 420,
      width: '100%',
      animation: 'fadeIn 0.4s ease-out',
    }}>
      {/* Hardcoded Assessments */}
      {ASSESSMENTS.map((assessment) => {
        const isCompleted = completedAssessments.includes(assessment.id);
        return (
          <button
            key={assessment.id}
            className="card-btn"
            onClick={() => {
              onAssessmentSelect(assessment.id);
              onStartAssessment?.(assessment.id);
            }}
            style={{
              padding: '18px',
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: 14,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 12,
              marginBottom: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 180, 100, 0.10)',
                  border: '1px solid rgba(255, 180, 100, 0.18)',
                  flexShrink: 0,
                }}>
                  <AssessmentIcon type={assessment.icon} color={colors.accent} />
                </div>

                <div>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 18,
                    fontWeight: 400,
                    color: colors.text,
                    marginBottom: 2,
                  }}>
                    {assessment.title}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: colors.accentDim,
                  }}>
                    {assessment.subtitle}
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 8,
                flexShrink: 0,
              }}>
                <div style={{
                  fontSize: 11,
                  color: colors.accentDim,
                }}>
                  {assessment.duration}
                </div>

                {isCompleted && (
                  <div style={{
                    fontSize: 11,
                    color: colors.accentDim,
                    padding: '6px 10px',
                    borderRadius: 999,
                    border: '1px solid rgba(255, 180, 100, 0.25)',
                    background: 'rgba(255, 180, 100, 0.08)',
                    whiteSpace: 'nowrap',
                  }}>
                    Completed
                  </div>
                )}
              </div>
            </div>

            <div style={{
              fontSize: 13,
              color: colors.textDim,
              lineHeight: 1.4,
            }}>
              {assessment.description}
            </div>
          </button>
        );
      })}

      {/* Database Assessments */}
      {dbAssessments.map((assessment) => {
        const isCompleted = completedAssessments.includes(assessment.id);
        return (
          <button
            key={assessment.id}
            className="card-btn"
            onClick={() => onDynamicAssessmentSelect?.(assessment)}
            style={{
              padding: '18px',
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: 14,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 12,
              marginBottom: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 180, 100, 0.10)',
                  border: '1px solid rgba(255, 180, 100, 0.18)',
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: 18 }}>✨</span>
                </div>

                <div>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 18,
                    fontWeight: 400,
                    color: colors.text,
                    marginBottom: 2,
                  }}>
                    {assessment.title}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: colors.accentDim,
                  }}>
                    {assessment.subtitle}
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 8,
                flexShrink: 0,
              }}>
                <div style={{
                  fontSize: 11,
                  color: colors.accentDim,
                }}>
                  {assessment.duration}
                </div>

                {isCompleted && (
                  <div style={{
                    fontSize: 11,
                    color: colors.accentDim,
                    padding: '6px 10px',
                    borderRadius: 999,
                    border: '1px solid rgba(255, 180, 100, 0.25)',
                    background: 'rgba(255, 180, 100, 0.08)',
                    whiteSpace: 'nowrap',
                  }}>
                    Completed
                  </div>
                )}
              </div>
            </div>

            <div style={{
              fontSize: 13,
              color: colors.textDim,
              lineHeight: 1.4,
            }}>
              {assessment.description}
            </div>
          </button>
        );
      })}
    </div>
  );
}
