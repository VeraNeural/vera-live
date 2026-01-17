/**
 * LearnTab Component
 * 
 * Learn tab view with lesson categories, lesson list, and completion tracking.
 */

'use client';

import React, { useState } from 'react';
import type { LearnLesson, CategoryItem, DBLesson } from '../types';
import { LESSON_CATEGORIES, LESSONS_BY_CATEGORY } from '../data/lessons';
import { LearnCategoryIcon } from '../icons';

interface LearnTabProps {
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
  completedLessons: Set<string>;
  activeLessonId: string | null;
  onLessonSelect: (lessonId: string) => void;
  onBack: () => void;
  onStartLesson?: (lessonId: string) => void;
  dbLessons?: DBLesson[];
  onDynamicLessonSelect?: (lesson: DBLesson) => void;
}

export function LearnTab({
  colors,
  completedLessons,
  activeLessonId,
  onLessonSelect,
  onBack,
  onStartLesson,
  dbLessons = [],
  onDynamicLessonSelect,
}: LearnTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const selectedCategoryMeta = selectedCategory
    ? LESSON_CATEGORIES.find(c => c.id === selectedCategory) ?? null
    : null;

  const selectedLessons = selectedCategory
    ? LESSONS_BY_CATEGORY[selectedCategory] ?? []
    : [];

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    onBack();
  };

  // Category Grid View
  if (!selectedCategory) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 12,
        maxWidth: 360,
        width: '100%',
        animation: 'fadeIn 0.4s ease-out',
      }}>
        {LESSON_CATEGORIES.map((category) => (
          <button
            key={category.id}
            className="card-btn"
            onClick={() => setSelectedCategory(category.id)}
            style={{
              padding: '18px 16px',
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: 14,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            {/* Icon */}
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 180, 100, 0.10)',
              border: '1px solid rgba(255, 180, 100, 0.18)',
              marginBottom: 12,
            }}>
              <LearnCategoryIcon type={category.icon} color={colors.accent} />
            </div>

            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 16,
              fontWeight: 400,
              color: colors.text,
              marginBottom: 6,
            }}>
              {category.title}
            </div>
            <div style={{
              fontSize: 12,
              color: colors.textDim,
              marginBottom: 8,
              lineHeight: 1.4,
            }}>
              {category.description}
            </div>
            <div style={{
              fontSize: 11,
              color: colors.accentDim,
            }}>
              {category.count} lessons
            </div>
          </button>
        ))}
      </div>
    );
  }

  // Lesson List View
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      maxWidth: 420,
      width: '100%',
      animation: 'fadeIn 0.4s ease-out',
    }}>
      <button
        onClick={handleBackToCategories}
        style={{
          alignSelf: 'flex-start',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 16px',
          background: colors.cardBg,
          border: `1px solid ${colors.cardBorder}`,
          borderRadius: 50,
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 500,
          color: colors.textMuted,
          marginBottom: 4,
        }}
      >
        ← Topics
      </button>

      <div style={{ padding: '0 2px 8px' }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 22,
          fontWeight: 400,
          color: colors.text,
          marginBottom: 4,
        }}>
          {selectedCategoryMeta?.title ?? 'Learn'}
        </div>
        {selectedCategoryMeta?.description && (
          <div style={{
            fontSize: 13,
            color: colors.textDim,
            lineHeight: 1.5,
          }}>
            {selectedCategoryMeta.description}
          </div>
        )}
      </div>

      {/* Hardcoded Lessons */}
      {selectedLessons.map((lesson, idx) => {
        const isCompleted = completedLessons.has(lesson.id);
        return (
          <button
            key={lesson.id}
            className="card-btn"
            onClick={() => {
              onLessonSelect(lesson.id);
              onStartLesson?.(lesson.id);
            }}
            style={{
              padding: '16px 16px',
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: 14,
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div>
              <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: colors.text,
                marginBottom: 4,
              }}>
                {lesson.title}
              </div>
              <div style={{
                fontSize: 12,
                color: colors.textDim,
              }}>
                Lesson {idx + 1} of {selectedLessons.length}
              </div>
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
          </button>
        );
      })}

      {/* Database Lessons for this category */}
      {dbLessons
        .filter(lesson => lesson.category === selectedCategory)
        .map((lesson) => {
          const isCompleted = completedLessons.has(lesson.id);
          return (
            <button
              key={lesson.id}
              className="card-btn"
              onClick={() => onDynamicLessonSelect?.(lesson)}
              style={{
                padding: '16px 16px',
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: 14,
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div>
                <div style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: colors.text,
                  marginBottom: 4,
                }}>
                  {lesson.title}
                </div>
                <div style={{
                  fontSize: 12,
                  color: colors.textDim,
                }}>
                  {lesson.description}
                </div>
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
            </button>
          );
        })}
    </div>
  );
}
