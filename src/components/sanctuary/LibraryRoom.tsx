/**
 * LibraryRoom Component
 * 
 * Orchestrates the Library experience with Stories, Learn, and Discover tabs.
 * All logic extracted into modular components and hooks.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useTheme, ThemeToggle } from '@/contexts/ThemeContext';
import type { Tab, DBLesson, DBAssessment } from '@/lib/library/types';
import { getLibraryColors } from '@/lib/library/theme';
import { LESSONS_BY_CATEGORY } from '@/lib/library/data/lessons';
import { ASSESSMENTS } from '@/lib/library/data/assessments';
import { StoryTab } from '@/lib/library/components/StoryTab';
import { LearnTab } from '@/lib/library/components/LearnTab';
import { DiscoverTab } from '@/lib/library/components/DiscoverTab';
import { useLibraryData } from '@/lib/library/hooks/useLibraryData';
import DynamicLessonViewer from './DynamicLessonViewer';
import DynamicAssessmentViewer from './DynamicAssessmentViewer';

// ============================================================================
// TYPES
// ============================================================================
interface LibraryRoomProps {
  onBack: () => void;
  onStartStory?: (storyId: string) => void;
  onStartLesson?: (lessonId: string) => void;
  onStartAssessment?: (assessmentId: string) => void;
}

// ============================================================================
// STYLES
// ============================================================================
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:wght@400;500;600&display=swap');
  
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }
  
  html, body {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  .card-btn {
    transition: transform 0.2s ease, background 0.2s ease;
  }
  .card-btn:active {
    transform: scale(0.97);
  }

  .tab-btn {
    transition: all 0.2s ease;
  }
  .tab-btn:active {
    transform: scale(0.96);
  }

  .chapters-scroll::-webkit-scrollbar {
    width: 3px;
  }
  .chapters-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .chapters-scroll::-webkit-scrollbar-thumb {
    background: rgba(255, 180, 100, 0.2);
    border-radius: 3px;
  }
`;

// ============================================================================
// COMPONENT
// ============================================================================
export default function LibraryRoom({ 
  onBack, 
  onStartStory, 
  onStartLesson, 
  onStartAssessment 
}: LibraryRoomProps) {
  const { colors } = useTheme();
  const COLORS = getLibraryColors(colors);

  // Use the extracted data hook
  const {
    dbStories,
    dbLessons,
    dbAssessments,
    dbLoading,
    completedLearnLessons,
    completedAssessments,
    markLearnLessonComplete,
    markAssessmentComplete,
  } = useLibraryData();

  // Dynamic content viewers
  const [activeDynamicLesson, setActiveDynamicLesson] = useState<DBLesson | null>(null);
  const [activeDynamicAssessment, setActiveDynamicAssessment] = useState<DBAssessment | null>(null);

  // UI State
  const [activeTab, setActiveTab] = useState<Tab>('stories');
  const [isLoaded, setIsLoaded] = useState(false);

  // Learn State
  const [activeLearnLessonId, setActiveLearnLessonId] = useState<string | null>(null);

  // Discover State
  const [activeAssessment, setActiveAssessment] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  // Reset tab-specific state when switching tabs
  useEffect(() => {
    if (activeTab !== 'learn') {
      setActiveLearnLessonId(null);
    }
    if (activeTab !== 'discover') {
      setActiveAssessment(null);
    }
  }, [activeTab]);

  // Find active lesson component
  const activeLearnLesson = (() => {
    if (!activeLearnLessonId) return null;
    for (const lessons of Object.values(LESSONS_BY_CATEGORY)) {
      const found = lessons.find((l) => l.id === activeLearnLessonId);
      if (found) return found;
    }
    return null;
  })();

  // Find active assessment component
  const activeDiscoverAssessment = activeAssessment
    ? ASSESSMENTS.find((a) => a.id === activeAssessment) ?? null
    : null;

  // Check if we're in a sub-view
  const isInSubView = Boolean(
    activeLearnLessonId ||
      activeAssessment ||
      activeDynamicLesson ||
      activeDynamicAssessment
  );

  return (
    <>
      <style jsx global>{GLOBAL_STYLES}</style>

      <div style={{
        position: 'fixed',
        inset: 0,
        background: COLORS.bg,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        
        {/* Ambient Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            bottom: '-10%',
            left: '-20%',
            width: '80%',
            height: '60%',
            background: `radial-gradient(ellipse at center, ${COLORS.warmGlow} 0%, transparent 60%)`,
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '60%',
            height: '50%',
            background: `radial-gradient(ellipse at center, ${COLORS.warmGlow} 0%, transparent 60%)`,
            borderRadius: '50%',
          }} />
        </div>

        {/* Header */}
        <header style={{
          padding: '16px',
          paddingTop: 'max(16px, env(safe-area-inset-top))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 50,
        }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 18px',
              background: COLORS.cardBg,
              border: `1px solid ${COLORS.cardBorder}`,
              borderRadius: 50,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              color: COLORS.textMuted,
            }}
          >
             Sanctuary
          </button>
          
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: COLORS.textDim,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Library
          </span>

          <ThemeToggle />
        </header>

        {/* Scrollable Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            paddingBottom: 'max(40px, env(safe-area-inset-bottom))',
            minHeight: '100%',
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}>
            
            {/* Title - only show on main views */}
            {!isInSubView && (
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h1 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 32,
                  fontWeight: 300,
                  color: COLORS.text,
                  marginBottom: 8,
                }}>
                  The Library
                </h1>
                <p style={{
                  fontSize: 14,
                  color: COLORS.textDim,
                }}>
                  Stories to calm, lessons to grow
                </p>
              </div>
            )}

            {/* Tabs - only show on main views */}
            {!isInSubView && (
              <div style={{
                display: 'flex',
                gap: 8,
                marginBottom: 24,
              }}>
                {(['stories', 'learn', 'discover'] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    className="tab-btn"
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: 50,
                      border: `1px solid ${activeTab === tab ? COLORS.accentDim : 'rgba(255, 255, 255, 0.1)'}`,
                      background: activeTab === tab ? 'rgba(255, 180, 100, 0.12)' : 'transparent',
                      color: activeTab === tab ? COLORS.text : COLORS.textMuted,
                      fontSize: 14,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}

            {/* Stories Tab */}
            {activeTab === 'stories' && !isInSubView && (
              <StoryTab colors={COLORS} dbStories={dbStories} />
            )}

            {/* Learn Tab */}
            {activeTab === 'learn' && !activeLearnLessonId && !activeDynamicLesson && (
              <LearnTab
                colors={COLORS}
                completedLessons={completedLearnLessons}
                activeLessonId={activeLearnLessonId}
                onLessonSelect={setActiveLearnLessonId}
                onBack={() => setActiveLearnLessonId(null)}
                onStartLesson={onStartLesson}
                dbLessons={dbLessons}
                onDynamicLessonSelect={setActiveDynamicLesson}
              />
            )}

            {/* Active Lesson Component */}
            {activeTab === 'learn' && activeLearnLesson && (
              <activeLearnLesson.Component
                onBack={() => setActiveLearnLessonId(null)}
                onComplete={() => markLearnLessonComplete(activeLearnLesson.id)}
              />
            )}

            {/* Dynamic Lesson Viewer */}
            {activeDynamicLesson && (
              <DynamicLessonViewer
                lesson={activeDynamicLesson as any}
                onBack={() => setActiveDynamicLesson(null)}
                onComplete={() => {
                  markLearnLessonComplete(activeDynamicLesson.id);
                  setActiveDynamicLesson(null);
                }}
                colors={{
                  bg: COLORS.bg,
                  text: COLORS.text,
                  textMuted: COLORS.textMuted,
                  cardBg: COLORS.cardBg,
                  cardBorder: COLORS.cardBorder,
                  accent: COLORS.accent,
                }}
                isDark={true}
              />
            )}

            {/* Discover Tab */}
            {activeTab === 'discover' && !activeAssessment && !activeDynamicAssessment && (
              <DiscoverTab
                colors={COLORS}
                completedAssessments={completedAssessments}
                onAssessmentSelect={setActiveAssessment}
                onStartAssessment={onStartAssessment}
                dbAssessments={dbAssessments}
                onDynamicAssessmentSelect={setActiveDynamicAssessment}
              />
            )}

            {/* Active Assessment Component */}
            {activeTab === 'discover' && activeDiscoverAssessment && (
              <activeDiscoverAssessment.Component
                onBack={() => setActiveAssessment(null)}
                onComplete={() => markAssessmentComplete(activeDiscoverAssessment.id)}
              />
            )}

            {/* Dynamic Assessment Viewer */}
            {activeDynamicAssessment && (
              <DynamicAssessmentViewer
                assessment={activeDynamicAssessment}
                onBack={() => setActiveDynamicAssessment(null)}
                onComplete={() => {
                  markAssessmentComplete(activeDynamicAssessment.id);
                  setActiveDynamicAssessment(null);
                }}
                colors={{
                  bg: COLORS.bg,
                  text: COLORS.text,
                  textMuted: COLORS.textMuted,
                  cardBg: COLORS.cardBg,
                  cardBorder: COLORS.cardBorder,
                  accent: COLORS.accent,
                }}
                isDark={true}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
