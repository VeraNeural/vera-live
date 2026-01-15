'use client';

import { useState, useEffect } from 'react';
import { useTheme, ThemeToggle } from '@/contexts/ThemeContext';
import EmotionColorMap from './creative/EmotionColorMap';
import MandalaCreation from './creative/MandalaCreation';
import SketchYourDay from './creative/SketchYourDay';
import PaperFolding from './creative/PaperFolding';
import WorryStoneDesign from './creative/WorryStoneDesign';
import GratitudeJar from './creative/GratitudeJar';
import DesignSafeSpace from './creative/DesignSafeSpaces';
import DigitalVisionBoard from './creative/DigitalVisionBoard';
import ComfortKitBuilder from './creative/ComfortKitBuilder';
import ZentanglePatterns from './creative/ZentaglePatterns';
import BlankCanvas from './creative/BlankCanvas';
import StreamOfCreation from './creative/SteamOfCreation';

// ============================================================================
// ELEGANT SVG ICONS (no emojis, no cartoons)
// ============================================================================
interface IconProps {
  size?: number;
  color?: string;
}

function EmotionColorMapIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <circle cx="12" cy="12" r="1.5" fill={color} opacity="0.8" />
      <path d="M12 3V5" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M12 19V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M3 12H5" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M19 12H21" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

function ZentangleIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 8C5 6 7 10 9 8C11 6 13 10 15 8C17 6 19 10 21 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 12C5 10 7 14 9 12C11 10 13 14 15 12C17 10 19 14 21 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <path d="M3 16C5 14 7 18 9 16C11 14 13 18 15 16C17 14 19 18 21 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

function MandalaIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" opacity="0.3" />
      <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <circle cx="12" cy="12" r="1" fill={color} />
      <path d="M12 3V6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 18V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 12H6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 12H21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SketchIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M17 3L21 7L8 20H4V16L17 3Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 6L18 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function CraftIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L15 8H9L12 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 8L6 16H18L15 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <path d="M6 16L4 22H20L18 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
    </svg>
  );
}

function BuildIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="1.5" opacity="0.8" />
      <rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="1.5" opacity="0.8" />
      <rect x="14" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}

function ExpressIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" opacity="0.3" />
      <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <circle cx="12" cy="12" r="1.5" fill={color} />
    </svg>
  );
}

// Category icon mapping
const CATEGORY_ICONS: Record<string, React.FC<IconProps>> = {
  'art': EmotionColorMapIcon,
  'craft': CraftIcon,
  'build': BuildIcon,
  'express': ExpressIcon,
};

// Activity icon mapping
const ACTIVITY_ICONS: Record<string, React.FC<IconProps>> = {
  'emotion-colors': EmotionColorMapIcon,
  'zentangle': ZentangleIcon,
  'mandala': MandalaIcon,
  'sketch-feelings': SketchIcon,
};

// ============================================================================
// TYPES
// ============================================================================
interface CreativeStudioProps {
  onBack: () => void;
  onStartActivity?: (activityId: string) => void;
}

type Tab = 'activities' | 'projects';

type Activity = {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: 'art' | 'craft' | 'build' | 'express';
  hasExperience?: boolean; // true if we've built the actual experience
};

// ============================================================================
// CONSTANTS
// ============================================================================
const ACTIVITY_CATEGORIES = [
  { id: 'art', title: 'Art & Drawing', description: 'Express through visual creation', count: 4 },
  { id: 'craft', title: 'Mindful Crafts', description: 'Hands-on calming activities', count: 3 },
  { id: 'build', title: 'Build & Create', description: 'Construct something meaningful', count: 3 },
  { id: 'express', title: 'Free Expression', description: 'Unstructured creative space', count: 2 },
];

const ACTIVITIES: Activity[] = [
  // Art & Drawing
  { id: 'emotion-colors', title: 'Emotion Color Map', description: 'Paint your feelings using colors that resonate', duration: '15-30 min', category: 'art', hasExperience: true },
  { id: 'zentangle', title: 'Zentangle Patterns', description: 'Meditative drawing through repetitive patterns', duration: '20 min', category: 'art', hasExperience: true },
  { id: 'mandala', title: 'Mandala Creation', description: 'Design symmetrical patterns for focus', duration: '25 min', category: 'art', hasExperience: true },
  { id: 'sketch-feelings', title: 'Sketch Your Day', description: 'Simple drawings to process experiences', duration: '10 min', category: 'art', hasExperience: true },
  
  // Mindful Crafts
  { id: 'paper-folding', title: 'Paper Folding', description: 'Origami and paper crafts for presence', duration: '15 min', category: 'craft', hasExperience: true },
  { id: 'worry-stones', title: 'Worry Stone Design', description: 'Create a tactile comfort object', duration: '20 min', category: 'craft', hasExperience: true },
  { id: 'gratitude-jar', title: 'Gratitude Jar', description: 'Craft a container for positive moments', duration: '25 min', category: 'craft', hasExperience: true },
  
  // Build & Create
  { id: 'safe-space', title: 'Design Safe Space', description: 'Visualize and plan your ideal sanctuary', duration: '20 min', category: 'build', hasExperience: true },
  { id: 'vision-board', title: 'Digital Vision Board', description: 'Collect images that inspire calm', duration: '30 min', category: 'build', hasExperience: true },
  { id: 'comfort-kit', title: 'Comfort Kit Builder', description: 'Plan your personal wellness toolkit', duration: '15 min', category: 'build', hasExperience: true },
  
  // Free Expression
  { id: 'blank-canvas', title: 'Blank Canvas', description: 'Open space to create without guidance', duration: 'Unlimited', category: 'express', hasExperience: true },
  { id: 'stream-create', title: 'Stream of Creation', description: 'Let your hands move freely', duration: 'Unlimited', category: 'express', hasExperience: true },
];

type ThemeColors = {
  bg: string;
  accent: string;
  text: string;
  textMuted: string;
  cardBg: string;
  cardBorder: string;
  glow: string;
};

const getStudioColors = (theme: ThemeColors) => {
  return {
    bg: theme.bg,
    text: theme.text,
    textMuted: theme.textMuted,
    textDim: theme.textMuted,
    cardBg: theme.cardBg,
    cardBorder: theme.cardBorder,
    accent: theme.accent,
    accentSecondary: theme.accent,
    accentDim: theme.accent,
    accentGlow: theme.glow,
  };
};

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
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.7; }
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

  .studio-scroll::-webkit-scrollbar {
    width: 3px;
  }
  .studio-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .studio-scroll::-webkit-scrollbar-thumb {
    background: rgba(168, 85, 247, 0.2);
    border-radius: 3px;
  }
`;

// ============================================================================
// COMPONENT
// ============================================================================
export default function CreativeStudio({ onBack, onStartActivity }: CreativeStudioProps) {
  const { colors } = useTheme();
  const COLORS = getStudioColors(colors);

  const [activeTab, setActiveTab] = useState<Tab>('activities');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeActivity, setActiveActivity] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handleActivityClick = (activityId: string) => {
    if (activityId === 'emotion-colors') {
      setActiveActivity('emotion-colors');
      return;
    }

    const activity = ACTIVITIES.find(a => a.id === activityId);
    
    // If activity has a built experience, show it
    if (activity?.hasExperience) {
      setActiveActivity(activityId);
    } else {
      // Otherwise, call the external handler (for future activities)
      onStartActivity?.(activityId);
    }
  };

  const handleActivityComplete = (data?: any) => {
    console.log('Activity completed:', data);
    setActiveActivity(null);
    // Could save to projects here
  };

  const activitiesInCategory = ACTIVITIES.filter(a => a.category === selectedCategory);

  // ============================================================================
  // RENDER ACTIVE ACTIVITY EXPERIENCE
  // ============================================================================
  if (activeActivity === 'emotion-colors') {
    return (
      <EmotionColorMap
        onBack={() => setActiveActivity(null)}
        onComplete={(data) => {
          console.log('Completed:', data);
          setActiveActivity(null);
        }}
      />
    );
  }

  if (activeActivity === 'zentangle') {
    return <ZentanglePatterns onBack={() => setActiveActivity(null)} onComplete={handleActivityComplete} />;
  }

  if (activeActivity === 'mandala') {
    return <MandalaCreation onBack={() => setActiveActivity(null)} onComplete={handleActivityComplete} />;
  }

  if (activeActivity === 'sketch-feelings') {
    return <SketchYourDay onBack={() => setActiveActivity(null)} onComplete={handleActivityComplete} />;
  }

  if (activeActivity === 'paper-folding') {
    return <PaperFolding onBack={() => setActiveActivity(null)} onComplete={handleActivityComplete} />;
  }

  // NOTE: Activity id is plural in ACTIVITIES: 'worry-stones'
  if (activeActivity === 'worry-stones') {
    return <WorryStoneDesign onBack={() => setActiveActivity(null)} onComplete={handleActivityComplete} />;
  }

  if (activeActivity === 'gratitude-jar') {
    return <GratitudeJar onBack={() => setActiveActivity(null)} onComplete={handleActivityComplete} />;
  }

  if (activeActivity === 'safe-space') {
    return <DesignSafeSpace onBack={() => setActiveActivity(null)} onComplete={handleActivityComplete} />;
  }

  if (activeActivity === 'vision-board') {
    return <DigitalVisionBoard onBack={() => setActiveActivity(null)} onComplete={handleActivityComplete} />;
  }

  if (activeActivity === 'comfort-kit') {
    return <ComfortKitBuilder onBack={() => setActiveActivity(null)} onComplete={handleActivityComplete} />;
  }

  if (activeActivity === 'blank-canvas') {
    return <BlankCanvas onBack={() => setActiveActivity(null)} onComplete={handleActivityComplete} />;
  }

  // NOTE: Activity id in ACTIVITIES is 'stream-create'
  if (activeActivity === 'stream-create') {
    return <StreamOfCreation onBack={() => setActiveActivity(null)} onComplete={handleActivityComplete} />;
  }

  // ============================================================================
  // RENDER
  // ============================================================================
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
        
        {/* ================================================================ */}
        {/* AMBIENT BACKGROUND */}
        {/* ================================================================ */}
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}>
          {/* Creative glow - top left */}
          <div style={{
            position: 'absolute',
            top: '-15%',
            left: '-10%',
            width: '60%',
            height: '50%',
            background: `radial-gradient(ellipse at center, ${COLORS.accentGlow} 0%, transparent 60%)`,
            borderRadius: '50%',
            animation: 'pulse 8s ease-in-out infinite',
          }} />

          {/* Secondary glow - bottom right */}
          <div style={{
            position: 'absolute',
            bottom: '-10%',
            right: '-15%',
            width: '50%',
            height: '40%',
            background: `radial-gradient(ellipse at center, ${COLORS.accentGlow} 0%, transparent 60%)`,
            borderRadius: '50%',
            animation: 'pulse 10s ease-in-out infinite 2s',
          }} />
        </div>

        {/* ================================================================ */}
        {/* HEADER */}
        {/* ================================================================ */}
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
            ← Sanctuary
          </button>
          
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: COLORS.textDim,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Creative Studio
          </span>

          <ThemeToggle />
        </header>

        {/* ================================================================ */}
        {/* SCROLLABLE CONTENT */}
        {/* ================================================================ */}
        <div 
          className="studio-scroll"
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
          }}
        >
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
            
            {/* Title */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 32,
                fontWeight: 300,
                color: COLORS.text,
                marginBottom: 8,
              }}>
                Creative Studio
              </h1>
              <p style={{
                fontSize: 14,
                color: COLORS.textDim,
              }}>
                Express, create, and find calm
              </p>
            </div>

            {/* Main CTA - only show on main view */}
            {!selectedCategory && activeTab === 'activities' && (
              <button
                onClick={() => handleActivityClick('emotion-colors')}
                style={{
                  padding: '16px 36px',
                  background: `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentSecondary} 100%)`,
                  border: 'none',
                  borderRadius: 50,
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginBottom: 28,
                  boxShadow: `0 8px 28px rgba(168, 85, 247, 0.35)`,
                }}
              >
                Start Creating
              </button>
            )}

            {/* Tabs - only show when not in a category */}
            {!selectedCategory && (
              <div style={{
                display: 'flex',
                gap: 8,
                marginBottom: 24,
              }}>
                {(['activities', 'projects'] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    className="tab-btn"
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: 50,
                      border: `1px solid ${activeTab === tab ? COLORS.accentDim : COLORS.cardBorder}`,
                      background: activeTab === tab ? COLORS.accentGlow : 'transparent',
                      color: activeTab === tab ? COLORS.text : COLORS.textMuted,
                      fontSize: 14,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {tab === 'projects' ? 'My Projects' : tab}
                  </button>
                ))}
              </div>
            )}

            {/* ============================================================ */}
            {/* ACTIVITIES TAB - Categories */}
            {/* ============================================================ */}
            {activeTab === 'activities' && !selectedCategory && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 12,
                maxWidth: 360,
                width: '100%',
                animation: 'fadeIn 0.4s ease-out',
              }}>
                {ACTIVITY_CATEGORIES.map((category) => {
                  const IconComponent = CATEGORY_ICONS[category.id] || ExpressIcon;
                  return (
                    <button
                      key={category.id}
                      className="card-btn"
                      onClick={() => handleCategoryClick(category.id)}
                      style={{
                        padding: '22px 16px',
                        background: COLORS.cardBg,
                        border: `1px solid ${COLORS.cardBorder}`,
                        borderRadius: 16,
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: 10,
                      }}>
                        <IconComponent size={28} color={COLORS.accentDim} />
                      </div>
                      <h3 style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: COLORS.text,
                        marginBottom: 6,
                      }}>
                        {category.title}
                      </h3>
                      <p style={{
                        fontSize: 12,
                        color: COLORS.textDim,
                        marginBottom: 10,
                        lineHeight: 1.4,
                      }}>
                        {category.description}
                      </p>
                      <span style={{
                        fontSize: 11,
                        color: COLORS.accentDim,
                      }}>
                        {category.count} activities
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ============================================================ */}
            {/* ACTIVITIES TAB - Activity List */}
            {/* ============================================================ */}
            {activeTab === 'activities' && selectedCategory && (
              <div style={{
                width: '100%',
                maxWidth: 400,
                animation: 'fadeIn 0.4s ease-out',
              }}>
                <button
                  onClick={handleBackToCategories}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: COLORS.accentDim,
                    fontSize: 13,
                    cursor: 'pointer',
                    marginBottom: 16,
                  }}
                >
                  ← Back to categories
                </button>

                <h2 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 22,
                  fontWeight: 300,
                  color: COLORS.text,
                  marginBottom: 20,
                  textAlign: 'center',
                }}>
                  {ACTIVITY_CATEGORIES.find(c => c.id === selectedCategory)?.title}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {activitiesInCategory.map((activity) => {
                    const IconComponent = ACTIVITY_ICONS[activity.id];
                    return (
                      <button
                        key={activity.id}
                        className="card-btn"
                        onClick={() => handleActivityClick(activity.id)}
                        style={{
                          padding: '18px',
                          background: COLORS.cardBg,
                          border: `1px solid ${COLORS.cardBorder}`,
                          borderRadius: 14,
                          cursor: 'pointer',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 14,
                          opacity: activity.hasExperience ? 1 : 0.7,
                        }}
                      >
                        {/* Icon */}
                        {IconComponent && (
                          <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: COLORS.accentGlow,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            <IconComponent size={20} color={COLORS.accentDim} />
                          </div>
                        )}
                        
                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: 6,
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <h3 style={{
                                fontSize: 15,
                                fontWeight: 600,
                                color: COLORS.text,
                              }}>
                                {activity.title}
                              </h3>
                              {!activity.hasExperience && (
                                <span style={{
                                  fontSize: 9,
                                  fontWeight: 600,
                                  letterSpacing: '0.05em',
                                  textTransform: 'uppercase',
                                  color: COLORS.accentDim,
                                  background: COLORS.accentGlow,
                                  padding: '3px 8px',
                                  borderRadius: 10,
                                }}>
                                  Soon
                                </span>
                              )}
                            </div>
                            <span style={{
                              fontSize: 11,
                              color: COLORS.accentDim,
                              marginLeft: 12,
                              flexShrink: 0,
                            }}>
                              {activity.duration}
                            </span>
                          </div>
                          <p style={{
                            fontSize: 13,
                            color: COLORS.textDim,
                            lineHeight: 1.5,
                          }}>
                            {activity.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* PROJECTS TAB */}
            {/* ============================================================ */}
            {activeTab === 'projects' && (
              <div style={{
                width: '100%',
                maxWidth: 400,
                animation: 'fadeIn 0.4s ease-out',
              }}>
                <div style={{
                  padding: '50px 24px',
                  background: COLORS.cardBg,
                  border: `1px dashed ${COLORS.cardBorder}`,
                  borderRadius: 16,
                  textAlign: 'center',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 16,
                    opacity: 0.4,
                  }}>
                    <ExpressIcon size={32} color={COLORS.text} />
                  </div>
                  <p style={{
                    color: COLORS.textDim,
                    marginBottom: 20,
                    fontSize: 14,
                  }}>
                    No projects yet
                  </p>
                  <p style={{
                    color: COLORS.textDim,
                    marginBottom: 24,
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}>
                    Your creative works will appear here.<br />
                    Start an activity to begin.
                  </p>
                  <button
                    onClick={() => setActiveTab('activities')}
                    style={{
                      padding: '12px 24px',
                      background: COLORS.accentGlow,
                      border: `1px solid ${COLORS.accentDim}`,
                      borderRadius: 50,
                      color: COLORS.text,
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Browse Activities
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}