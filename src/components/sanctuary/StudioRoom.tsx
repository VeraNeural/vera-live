'use client';

import { useState, useEffect } from 'react';
import { useTheme, ThemeToggle } from '@/contexts/ThemeContext';

// Import types
import type { Tab, CreativeStudioProps } from '@/lib/studio/types';

// Import theme and styling
import { getStudioColors, GLOBAL_STYLES } from '@/lib/studio/theme';

// Import data
import { ACTIVITY_CATEGORIES, ACTIVITIES } from '@/lib/studio/data/activities';

// Import components
import { CategoryGrid } from '@/lib/studio/components/CategoryGrid';
import { ActivityCard } from '@/lib/studio/components/ActivityCard';
import { ProjectsTab } from '@/lib/studio/components/ProjectsTab';

// Import activity experiences
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

// Written Release experiences
import { BrainDump } from '@/lib/studio/experiences/written/BrainDump';
import { UnsentLetter } from '@/lib/studio/experiences/written/UnsentLetter';
import { StreamOfConsciousness } from '@/lib/studio/experiences/written/StreamOfConsciousness';
import { BurnList } from '@/lib/studio/experiences/written/BurnList';

export default function CreativeStudio({ onBack, onStartActivity }: CreativeStudioProps) {
  const { colors } = useTheme();
  const COLORS = getStudioColors(colors);

  const [activeTab, setActiveTab] = useState<Tab>('activities');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeExperience, setActiveExperience] = useState<string | null>(null);
  const [comingSoonActivityId, setComingSoonActivityId] = useState<string | null>(null);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);
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
    const activity = ACTIVITIES.find(a => a.id === activityId);
    
    if (activity?.hasExperience) {
      setActiveExperience(activityId);
    } else {
      if (onStartActivity) {
        onStartActivity(activityId);
      } else {
        setComingSoonActivityId(activityId);
      }
    }
  };

  const handleComplete = (data?: any) => {
    console.log('Activity completed:', data);
    const activity = activeExperience ? ACTIVITIES.find(a => a.id === activeExperience) : null;
    setCompletionMessage(activity?.title ? `Completed: ${activity.title}` : 'Completed');
    setActiveExperience(null);
    window.setTimeout(() => setCompletionMessage(null), 2200);
  };

  const handleCloseComingSoon = () => {
    setComingSoonActivityId(null);
  };

  const activitiesInCategory = ACTIVITIES.filter(a => a.category === selectedCategory);

  if (comingSoonActivityId) {
    const activity = ACTIVITIES.find(a => a.id === comingSoonActivityId);
    return (
      <>
        <style jsx global>{GLOBAL_STYLES}</style>
        <div style={{ position: 'fixed', inset: 0, background: COLORS.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <header style={{
            padding: '16px',
            paddingTop: 'max(16px, env(safe-area-inset-top))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 50,
          }}>
            <button onClick={handleCloseComingSoon} style={{
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
            }}>
              ← Back
            </button>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: COLORS.textDim,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Coming soon
            </span>
            <ThemeToggle />
          </header>

          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}>
            <div style={{
              width: '100%',
              maxWidth: 420,
              background: COLORS.cardBg,
              border: `1px solid ${COLORS.cardBorder}`,
              borderRadius: 16,
              padding: 20,
              textAlign: 'center',
            }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 26,
                fontWeight: 300,
                color: COLORS.text,
                marginBottom: 10,
              }}>
                {activity?.title ?? 'This activity'}
              </h2>
              <p style={{ fontSize: 14, color: COLORS.textDim, lineHeight: 1.6, marginBottom: 16 }}>
                {activity?.description ?? 'This experience is not available yet.'}
              </p>
              <div style={{
                display: 'inline-flex',
                gap: 8,
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: 999,
                background: COLORS.accentGlow,
                color: COLORS.accentDim,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Coming soon
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Experience routing
  if (activeExperience === 'emotion-colors') return <EmotionColorMap onBack={() => setActiveExperience(null)} onComplete={handleComplete} />;
  if (activeExperience === 'zentangle') return <ZentanglePatterns onBack={() => setActiveExperience(null)} onComplete={handleComplete} />;
  if (activeExperience === 'mandala') return <MandalaCreation onBack={() => setActiveExperience(null)} onComplete={handleComplete} />;
  if (activeExperience === 'sketch-feelings') return <SketchYourDay onBack={() => setActiveExperience(null)} onComplete={handleComplete} />;
  if (activeExperience === 'paper-folding') return <PaperFolding onBack={() => setActiveExperience(null)} onComplete={handleComplete} />;
  if (activeExperience === 'worry-stones') return <WorryStoneDesign onBack={() => setActiveExperience(null)} onComplete={handleComplete} />;
  if (activeExperience === 'gratitude-jar') return <GratitudeJar onBack={() => setActiveExperience(null)} onComplete={handleComplete} />;
  if (activeExperience === 'safe-space') return <DesignSafeSpace onBack={() => setActiveExperience(null)} onComplete={handleComplete} />;
  if (activeExperience === 'vision-board') return <DigitalVisionBoard onBack={() => setActiveExperience(null)} onComplete={handleComplete} />;
  if (activeExperience === 'comfort-kit') return <ComfortKitBuilder onBack={() => setActiveExperience(null)} onComplete={handleComplete} />;
  if (activeExperience === 'blank-canvas') return <BlankCanvas onBack={() => setActiveExperience(null)} onComplete={handleComplete} />;
  if (activeExperience === 'stream-create') return <StreamOfCreation onBack={() => setActiveExperience(null)} onComplete={handleComplete} />;

  if (activeExperience === 'brain-dump') return <BrainDump onBack={() => setActiveExperience(null)} onComplete={handleComplete} />;
  if (activeExperience === 'unsent-letter') return <UnsentLetter onBack={() => setActiveExperience(null)} onComplete={handleComplete} />;
  if (activeExperience === 'stream-of-consciousness') return <StreamOfConsciousness onBack={() => setActiveExperience(null)} onComplete={handleComplete} />;
  if (activeExperience === 'burn-list') return <BurnList onBack={() => setActiveExperience(null)} onComplete={handleComplete} />;

  return (
    <>
      <style jsx global>{GLOBAL_STYLES}</style>

      <div style={{ position: 'fixed', inset: 0, background: COLORS.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {completionMessage && (
          <div style={{
            position: 'fixed',
            top: 'calc(env(safe-area-inset-top) + 72px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 999,
            padding: '10px 14px',
            borderRadius: 999,
            background: COLORS.cardBg,
            border: `1px solid ${COLORS.cardBorder}`,
            color: COLORS.text,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.02em',
            boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
            maxWidth: 340,
            textAlign: 'center',
          }}>
            {completionMessage}
          </div>
        )}
        
        {/* Ambient background */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: '-20%', left: '-10%', width: '40%', height: '50%',
            background: `radial-gradient(ellipse at center, ${COLORS.accentGlow} 0%, transparent 60%)`,
            borderRadius: '50%', animation: 'pulse 12s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', bottom: '-10%', right: '-15%', width: '50%', height: '40%',
            background: `radial-gradient(ellipse at center, ${COLORS.accentGlow} 0%, transparent 60%)`,
            borderRadius: '50%', animation: 'pulse 10s ease-in-out infinite 2s',
          }} />
        </div>

        {/* Header */}
        <header style={{
          padding: '16px', paddingTop: 'max(16px, env(safe-area-inset-top))',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 50,
        }}>
          <button onClick={onBack} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px',
            background: COLORS.cardBg, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 50,
            cursor: 'pointer', fontSize: 14, fontWeight: 500, color: COLORS.textMuted,
          }}>
            ← Sanctuary
          </button>
          
          <span style={{
            fontSize: 11, fontWeight: 600, color: COLORS.textDim,
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            Creative Studio
          </span>

          <ThemeToggle />
        </header>

        {/* Scrollable content */}
        <div className="studio-scroll" style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          paddingBottom: 'max(40px, env(safe-area-inset-bottom))',
        }}>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '20px 16px', opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.6s ease-out',
          }}>
            
            {/* Hero CTA */}
            {!selectedCategory && activeTab === 'activities' && (
              <button onClick={() => handleActivityClick('emotion-colors')} style={{
                padding: '16px 36px',
                background: `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentSecondary} 100%)`,
                border: 'none', borderRadius: 50, color: '#fff', fontSize: 15, fontWeight: 600,
                cursor: 'pointer', marginBottom: 28, boxShadow: `0 8px 28px rgba(168, 85, 247, 0.35)`,
              }}>
                Start Creating
              </button>
            )}

            {/* Tabs */}
            {!selectedCategory && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                {(['activities', 'projects'] as Tab[]).map((tab) => (
                  <button key={tab} className="tab-btn" onClick={() => setActiveTab(tab)} style={{
                    padding: '10px 20px', borderRadius: 50,
                    border: `1px solid ${activeTab === tab ? COLORS.accentDim : COLORS.cardBorder}`,
                    background: activeTab === tab ? COLORS.accentGlow : 'transparent',
                    color: activeTab === tab ? COLORS.text : COLORS.textMuted,
                    fontSize: 14, cursor: 'pointer', textTransform: 'capitalize',
                  }}>
                    {tab === 'projects' ? 'My Projects' : tab}
                  </button>
                ))}
              </div>
            )}

            {/* Activities Tab - Categories */}
            {activeTab === 'activities' && !selectedCategory && (
              <CategoryGrid
                categories={ACTIVITY_CATEGORIES}
                colors={COLORS}
                onCategoryClick={handleCategoryClick}
              />
            )}

            {/* Activities Tab - Activity List */}
            {activeTab === 'activities' && selectedCategory && (
              <div style={{ width: '100%', maxWidth: 400, animation: 'fadeIn 0.4s ease-out' }}>
                <button onClick={handleBackToCategories} style={{
                  background: 'none', border: 'none', color: COLORS.accentDim,
                  fontSize: 13, cursor: 'pointer', marginBottom: 16,
                }}>
                  ← Back to categories
                </button>

                <h2 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 22, fontWeight: 300, color: COLORS.text,
                  marginBottom: 20, textAlign: 'center',
                }}>
                  {ACTIVITY_CATEGORIES.find(c => c.id === selectedCategory)?.title}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {activitiesInCategory.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      colors={COLORS}
                      onActivityClick={handleActivityClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <ProjectsTab
                colors={COLORS}
                onBrowseActivities={() => setActiveTab('activities')}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
