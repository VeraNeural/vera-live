'use client';

import { useState, useEffect, useRef } from 'react';
import type { ComponentType } from 'react';
import { useTheme, ThemeToggle } from '@/contexts/ThemeContext';

import NervousSystemLesson1 from './learn/NervousSystemLesson1';
import NervousSystemLesson2 from './learn/NervousSystemLesson2';
import NervousSystemLesson3 from './learn/NervousSystemLesson3';
import NervousSystemLesson4 from './learn/NervousSystemLesson4';

import Emotionlesson1 from './learn/Emotionlesson1';
import Emotionlesson2 from './learn/Emotionlesson2';
import Emotionlesson3 from './learn/Emotionlesson3';
import Emotionlesson4 from './learn/Emotionlesson4';

import ScienceOfRestLesson1 from './learn/ScienceOfRestLesson1';
import ScienceOfRestLesson2 from './learn/ScienceOfRestLesson2';
import ScienceOfRestLesson3 from './learn/ScienceOfRestLesson3';
import ScienceOfRestLesson4 from './learn/ScienceOfRestLesson4';

import ResilienceLesson1 from './learn/ResilienceLesson1';
import ResilienceLesson2 from './learn/ResilienceLesson2';
import ResilienceLesson3 from './learn/ResilienceLesson3';
import ResilienceLesson4 from './learn/ResilienceLesson4';

import InnerLandscapeAssessment from './assessments/InnerLandscapeAssessment';
import RestRestorationAssessment from './assessments/RestRestorationAssessment';
import StressResponseAssessment from './assessments/StressResponseAssessment';
import ConnectionStyleAssessment from './assessments/ConnectionStyleAssessment';
import LifeRhythmAssessment from './assessments/LifeRhythmAssessment';

// ============================================================================
// TYPES
// ============================================================================
interface LibraryRoomProps {
  onBack: () => void;
  onStartStory?: (storyId: string) => void;
  onStartLesson?: (lessonId: string) => void;
  onStartAssessment?: (assessmentId: string) => void;
}

type Tab = 'stories' | 'learn' | 'discover';

type Chapter = {
  id: string;
  title: string;
  duration: string;
  audioUrl: string;
};

type Story = {
  id: string;
  title: string;
  description: string;
  category: string;
  chapters: Chapter[];
};

type LearnLessonComponent = ComponentType<{ onBack: () => void; onComplete?: () => void }>;

type LearnLesson = {
  id: string;
  title: string;
  Component: LearnLessonComponent;
};

type DiscoverAssessmentComponent = ComponentType<{
  onBack: () => void;
  onComplete?: (...args: any[]) => void;
}>;

type DiscoverAssessment = {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  description: string;
  icon: string;
  Component: DiscoverAssessmentComponent;
};

// ============================================================================
// CONSTANTS
// ============================================================================
const STORY_CATEGORIES = [
  { id: 'rest-sleep', title: 'Rest & Sleep', description: 'Gentle stories to ease you into rest', count: 4 },
  { id: 'guided-journeys', title: 'Guided Journeys', description: 'Imaginative travels for the mind', count: 3 },
  { id: 'meditative-tales', title: 'Meditative Tales', description: 'Stories that slow the world down', count: 3 },
  { id: 'rise-ready', title: 'Rise & Ready', description: 'Confidence and clarity for the day ahead', count: 4 },
];

const STORIES: Story[] = [
  { 
    id: 'rest-edge-of-sleep', 
    title: 'Rest — A Story for the Edge of Sleep', 
    description: 'A gentle descent into rest. Five chapters that ease you from day to night, from thoughts to stillness, from waking to sleep.',
    category: 'rest-sleep',
    chapters: [
      { id: 'ch1', title: 'Chapter 1: The House After Dusk', duration: '1:44', audioUrl: '/audio/Rest.wav' },
      { id: 'ch2', title: 'Chapter 2: The Weight of the Evening Air', duration: '2:05', audioUrl: '/audio/Rest2.wav' },
      { id: 'ch3', title: 'Chapter 3: The Bed That Waited', duration: '1:48', audioUrl: '/audio/Rest3.wav' },
      { id: 'ch4', title: 'Chapter 4: When Thought Loses Its Edges', duration: '1:51', audioUrl: '/audio/Rest4.wav' },
      { id: 'ch5', title: 'Chapter 5: The Moment Before Sleep', duration: '1:42', audioUrl: '/audio/Rest5.wav' },
    ]
  },
  { 
    id: 'calm-forest', 
    title: 'The Calm Forest', 
    description: 'A gentle walk through peaceful woods, where sunlight filters through ancient trees and every step brings you deeper into stillness.',
    category: 'meditative-tales',
    chapters: [
      { id: 'ch1', title: 'Chapter 1: Where the Ground Changes', duration: '1:42', audioUrl: '/audio/calm-forest.wav' },
      { id: 'ch2', title: 'Chapter 2: Nothing Reacts', duration: '1:49', audioUrl: '/audio/calm-forest2.wav' },
      { id: 'ch3', title: 'Chapter 3: The Space Between Sounds', duration: '1:46', audioUrl: '/audio/calm-forest3.wav' },
      { id: 'ch4', title: 'Chapter 4: Without Waiting', duration: '1:47', audioUrl: '/audio/calm-forest4.wav' },
      { id: 'ch5', title: 'Chapter 5: Enough to Carry', duration: '1:44', audioUrl: '/audio/calm-forest5.wav' },
    ]
  },
  { 
    id: 'office-after-everyone-left', 
    title: 'The Office After Everyone Left', 
    description: 'Discover the quiet power of spaces after the day ends. Five chapters exploring stillness, freedom, and wisdom.',
    category: 'rise-ready',
    chapters: [
      { id: 'ch1', title: 'Chapter 1: When the Noise Withdraws', duration: '1:28', audioUrl: '/audio/Office.wav' },
      { id: 'ch2', title: 'Chapter 2: The Space That Expands', duration: '1:34', audioUrl: '/audio/Office2.wav' },
      { id: 'ch3', title: 'Chapter 3: Without an Audience', duration: '1:48', audioUrl: '/audio/Office3.wav' },
      { id: 'ch4', title: 'Chapter 4: What the Body Learned Here', duration: '1:42', audioUrl: '/audio/office4.wav' },
      { id: 'ch5', title: 'Chapter 5: After the Lights Go Out', duration: '1:45', audioUrl: '/audio/office5.wav' },
    ]
  },
  { 
    id: 'guided-journeys-trains', 
    title: 'Journey Through Time', 
    description: 'A series of imaginative journeys that transport your mind to places both familiar and fantastical.',
    category: 'guided-journeys',
    chapters: [
      { id: 'ch1', title: 'Journey 1 — The Train That Didn\'t Rush', duration: '1:51', audioUrl: '/audio/Train.wav' },
      { id: 'ch2', title: 'Journey 2 — The Desert at First Light', duration: '1:45', audioUrl: '/audio/Train2.wav' },
      { id: 'ch3', title: 'Journey 3 — The City Seen From Above', duration: '1:28', audioUrl: '/audio/Train3.wav' },
      { id: 'ch4', title: 'Journey 4 — The Lake Without Wind', duration: '1:19', audioUrl: '/audio/Train4.wav' },
      { id: 'ch5', title: 'Journey 5 — The Road After Midnight', duration: '1:32', audioUrl: '/audio/Train5.wav' },
    ]
  },
];

const LEARN_CATEGORIES = [
  { id: 'nervous-system', title: 'Your Nervous System', description: "Understanding your body's wisdom", count: 4 },
  { id: 'emotions', title: 'Understanding Emotions', description: 'The language of feeling', count: 4 },
  { id: 'rest-science', title: 'The Science of Rest', description: 'Why restoration matters', count: 4 },
  { id: 'resilience', title: 'Building Resilience', description: "Growing through life's challenges", count: 4 },
];

const LEARN_LESSONS_BY_CATEGORY: Record<string, LearnLesson[]> = {
  'nervous-system': [
    { id: 'nervous-system-1', title: 'Lesson 1', Component: NervousSystemLesson1 },
    { id: 'nervous-system-2', title: 'Lesson 2', Component: NervousSystemLesson2 },
    { id: 'nervous-system-3', title: 'Lesson 3', Component: NervousSystemLesson3 },
    { id: 'nervous-system-4', title: 'Lesson 4', Component: NervousSystemLesson4 },
  ],
  emotions: [
    { id: 'emotions-1', title: 'Lesson 1', Component: Emotionlesson1 },
    { id: 'emotions-2', title: 'Lesson 2', Component: Emotionlesson2 },
    { id: 'emotions-3', title: 'Lesson 3', Component: Emotionlesson3 },
    { id: 'emotions-4', title: 'Lesson 4', Component: Emotionlesson4 },
  ],
  'rest-science': [
    { id: 'rest-science-1', title: 'Lesson 1', Component: ScienceOfRestLesson1 },
    { id: 'rest-science-2', title: 'Lesson 2', Component: ScienceOfRestLesson2 },
    { id: 'rest-science-3', title: 'Lesson 3', Component: ScienceOfRestLesson3 },
    { id: 'rest-science-4', title: 'Lesson 4', Component: ScienceOfRestLesson4 },
  ],
  resilience: [
    { id: 'resilience-1', title: 'Lesson 1', Component: ResilienceLesson1 },
    { id: 'resilience-2', title: 'Lesson 2', Component: ResilienceLesson2 },
    { id: 'resilience-3', title: 'Lesson 3', Component: ResilienceLesson3 },
    { id: 'resilience-4', title: 'Lesson 4', Component: ResilienceLesson4 },
  ],
};

const DISCOVER_ASSESSMENTS: DiscoverAssessment[] = [
  {
    id: 'inner-landscape',
    title: 'Inner Landscape',
    subtitle: 'Emotional Patterns',
    duration: '15 min',
    description: 'Explore your emotional world and discover your unique patterns',
    icon: '🌿',
    Component: InnerLandscapeAssessment,
  },
  {
    id: 'rest-restoration',
    title: 'Rest & Restoration',
    subtitle: 'How You Recharge',
    duration: '12 min',
    description: 'Discover your ideal rest practices and restoration needs',
    icon: '🌙',
    Component: RestRestorationAssessment,
  },
  {
    id: 'stress-response',
    title: 'Stress Response',
    subtitle: "Your Body's Patterns",
    duration: '15 min',
    description: 'Understand how your nervous system responds to pressure',
    icon: '⚡',
    Component: StressResponseAssessment,
  },
  {
    id: 'connection-style',
    title: 'Connection Style',
    subtitle: 'Relationships & Boundaries',
    duration: '12 min',
    description: 'Explore how you connect and what you need from others',
    icon: '💫',
    Component: ConnectionStyleAssessment,
  },
  {
    id: 'life-rhythm',
    title: 'Life Rhythm',
    subtitle: 'Energy & Natural Cycles',
    duration: '10 min',
    description: 'Discover your natural energy patterns and optimal rhythms',
    icon: '🌀',
    Component: LifeRhythmAssessment,
  },
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

const getLibraryColors = (theme: ThemeColors) => {
  return {
    bg: theme.bg,
    text: theme.text,
    textMuted: theme.textMuted,
    textDim: theme.textMuted,
    cardBg: theme.cardBg,
    cardBorder: theme.cardBorder,
    accent: theme.accent,
    accentDim: theme.accent,
    warmGlow: theme.glow,
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
export default function LibraryRoom({ onBack, onStartStory, onStartLesson, onStartAssessment }: LibraryRoomProps) {
  const { colors } = useTheme();
  const COLORS = getLibraryColors(colors);

  // UI State
  const [activeTab, setActiveTab] = useState<Tab>('stories');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Learn State
  const [selectedLearnCategory, setSelectedLearnCategory] = useState<string | null>(null);
  const [activeLearnLessonId, setActiveLearnLessonId] = useState<string | null>(null);
  const [completedLearnLessons, setCompletedLearnLessons] = useState<Set<string>>(new Set());

  // Discover State
  const [activeAssessment, setActiveAssessment] = useState<string | null>(null);
  const [completedAssessments, setCompletedAssessments] = useState<string[]>([]);

  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('vera.library.learn.completedLessons.v1');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const ids = parsed.filter((v) => typeof v === 'string');
        setCompletedLearnLessons(new Set(ids));
      }
    } catch {
      // Ignore localStorage/JSON failures
    }
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('vera.library.discover.completedAssessments.v1');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const ids = parsed.filter((v) => typeof v === 'string');
        setCompletedAssessments(Array.from(new Set(ids)));
      }
    } catch {
      // Ignore localStorage/JSON failures
    }
  }, []);

  useEffect(() => {
    if (activeTab !== 'learn') {
      setSelectedLearnCategory(null);
      setActiveLearnLessonId(null);
    }

    if (activeTab !== 'discover') {
      setActiveAssessment(null);
    }
  }, [activeTab]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setAudioProgress(audio.currentTime);
    const handleLoadedMetadata = () => setAudioDuration(audio.duration);
    const handleEnded = () => {
      if (selectedStory && currentChapterIndex < selectedStory.chapters.length - 1) {
        setCurrentChapterIndex(prev => prev + 1);
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
          }
        }, 300);
      } else {
        setIsPlaying(false);
        setAudioProgress(0);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [selectedStory, currentChapterIndex]);

  // ============================================================================
  // HANDLERS
  // ============================================================================
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setAudioProgress(0);
  };

  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
    }
  };

  const handleForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 15);
    }
  };

  const handleChapterSelect = (index: number) => {
    setCurrentChapterIndex(index);
    setAudioProgress(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleStoryClick = (story: Story) => {
    setSelectedStory(story);
    setCurrentChapterIndex(0);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedStory(null);
    setCurrentChapterIndex(0);
    handleStop();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const storiesInCategory = STORIES.filter(s => s.category === selectedCategory);
  const currentChapter = selectedStory?.chapters[currentChapterIndex];

  const selectedLearnMeta = selectedLearnCategory
    ? LEARN_CATEGORIES.find((c) => c.id === selectedLearnCategory) ?? null
    : null;

  const selectedLearnLessons = selectedLearnCategory
    ? LEARN_LESSONS_BY_CATEGORY[selectedLearnCategory] ?? []
    : [];

  const activeLearnLesson = (() => {
    if (!activeLearnLessonId) return null;
    for (const lessons of Object.values(LEARN_LESSONS_BY_CATEGORY)) {
      const found = lessons.find((l) => l.id === activeLearnLessonId);
      if (found) return found;
    }
    return null;
  })();

  const activeDiscoverAssessment = activeAssessment
    ? DISCOVER_ASSESSMENTS.find((a) => a.id === activeAssessment) ?? null
    : null;

  const markLearnLessonComplete = (lessonId: string) => {
    setCompletedLearnLessons((prev) => {
      if (prev.has(lessonId)) return prev;
      const next = new Set(prev);
      next.add(lessonId);
      try {
        localStorage.setItem('vera.library.learn.completedLessons.v1', JSON.stringify(Array.from(next)));
      } catch {
        // Ignore persistence failures
      }
      return next;
    });
  };

  const markAssessmentComplete = (assessmentId: string) => {
    setCompletedAssessments((prev) => {
      if (prev.includes(assessmentId)) return prev;
      const next = [...prev, assessmentId];
      try {
        localStorage.setItem('vera.library.discover.completedAssessments.v1', JSON.stringify(next));
      } catch {
        // Ignore persistence failures
      }
      return next;
    });
  };

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
          {/* Warm fireplace glow - bottom left */}
          <div style={{
            position: 'absolute',
            bottom: '-10%',
            left: '-20%',
            width: '80%',
            height: '60%',
            background: `radial-gradient(ellipse at center, ${COLORS.warmGlow} 0%, transparent 60%)`,
            borderRadius: '50%',
          }} />

          {/* Subtle top glow */}
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
            Library
          </span>

          <ThemeToggle />
        </header>

        {/* ================================================================ */}
        {/* SCROLLABLE CONTENT */}
        {/* ================================================================ */}
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
            {!selectedStory && !selectedLearnCategory && !activeAssessment && (
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
            {!selectedCategory && !selectedStory && !selectedLearnCategory && !activeAssessment && (
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

            {/* ============================================================ */}
            {/* STORIES TAB - Categories */}
            {/* ============================================================ */}
            {activeTab === 'stories' && !selectedCategory && !selectedStory && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 12,
                maxWidth: 360,
                width: '100%',
                animation: 'fadeIn 0.4s ease-out',
              }}>
                {STORY_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    className="card-btn"
                    onClick={() => handleCategoryClick(category.id)}
                    style={{
                      padding: '18px 16px',
                      background: COLORS.cardBg,
                      border: `1px solid ${COLORS.cardBorder}`,
                      borderRadius: 14,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 16,
                      fontWeight: 400,
                      color: COLORS.text,
                      marginBottom: 6,
                    }}>
                      {category.title}
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: COLORS.textDim,
                      marginBottom: 8,
                      lineHeight: 1.4,
                    }}>
                      {category.description}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: COLORS.accentDim,
                    }}>
                      {category.count} stories
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* ============================================================ */}
            {/* STORIES TAB - Story List */}
            {/* ============================================================ */}
            {activeTab === 'stories' && selectedCategory && !selectedStory && (
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
                  {STORY_CATEGORIES.find(c => c.id === selectedCategory)?.title}
                </h2>

                {storiesInCategory.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {storiesInCategory.map((story) => (
                      <button
                        key={story.id}
                        className="card-btn"
                        onClick={() => handleStoryClick(story)}
                        style={{
                          padding: '18px',
                          background: COLORS.cardBg,
                          border: `1px solid ${COLORS.cardBorder}`,
                          borderRadius: 14,
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: 8,
                        }}>
                          <div style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: 17,
                            fontWeight: 400,
                            color: COLORS.text,
                            flex: 1,
                          }}>
                            {story.title}
                          </div>
                          <div style={{
                            fontSize: 11,
                            color: COLORS.accentDim,
                            marginLeft: 12,
                          }}>
                            {story.chapters.length} chapters
                          </div>
                        </div>
                        <div style={{
                          fontSize: 13,
                          color: COLORS.textDim,
                          lineHeight: 1.5,
                        }}>
                          {story.description}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: 40,
                    color: COLORS.textDim,
                  }}>
                    Stories coming soon
                  </div>
                )}
              </div>
            )}

            {/* ============================================================ */}
            {/* STORY PLAYER */}
            {/* ============================================================ */}
            {selectedStory && currentChapter && (
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
                    marginBottom: 20,
                  }}
                >
                  ← Back to stories
                </button>

                {/* Story Title */}
                <h1 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 24,
                  fontWeight: 300,
                  color: COLORS.text,
                  textAlign: 'center',
                  marginBottom: 24,
                }}>
                  {selectedStory.title}
                </h1>

                {/* Chapter Selector */}
                <div style={{ marginBottom: 28 }}>
                  <h3 style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: COLORS.accentDim,
                    marginBottom: 12,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    Chapters
                  </h3>
                  <div 
                    className="chapters-scroll"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      maxHeight: 180,
                      overflowY: 'auto',
                    }}
                  >
                    {selectedStory.chapters.map((chapter, index) => (
                      <button
                        key={chapter.id}
                        onClick={() => handleChapterSelect(index)}
                        style={{
                          padding: '12px 14px',
                          background: currentChapterIndex === index 
                            ? 'rgba(255, 180, 100, 0.15)' 
                            : 'rgba(255, 255, 255, 0.04)',
                          border: `1px solid ${currentChapterIndex === index 
                            ? 'rgba(255, 180, 100, 0.3)' 
                            : 'rgba(255, 255, 255, 0.08)'}`,
                          borderRadius: 8,
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          textAlign: 'left',
                        }}
                      >
                        <span style={{
                          fontSize: 14,
                          color: currentChapterIndex === index ? COLORS.accent : COLORS.textMuted,
                          flex: 1,
                        }}>
                          {chapter.title}
                        </span>
                        <span style={{
                          fontSize: 12,
                          color: COLORS.textDim,
                          marginLeft: 8,
                        }}>
                          {chapter.duration}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current Chapter */}
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <h2 style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 20,
                    fontWeight: 300,
                    color: COLORS.accent,
                    marginBottom: 4,
                  }}>
                    {currentChapter.title}
                  </h2>
                  <span style={{ fontSize: 13, color: COLORS.textDim }}>
                    {currentChapter.duration}
                  </span>
                </div>

                {/* Play/Pause Button */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                  <button
                    onClick={togglePlayPause}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      background: isPlaying 
                        ? 'rgba(255, 180, 100, 0.2)' 
                        : 'rgba(255, 180, 100, 0.12)',
                      border: `1px solid ${isPlaying 
                        ? 'rgba(255, 180, 100, 0.4)' 
                        : 'rgba(255, 180, 100, 0.25)'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isPlaying ? (
                      <div style={{ display: 'flex', gap: 5 }}>
                        <div style={{ width: 5, height: 22, background: COLORS.accent, borderRadius: 2 }} />
                        <div style={{ width: 5, height: 22, background: COLORS.accent, borderRadius: 2 }} />
                      </div>
                    ) : (
                      <div style={{
                        width: 0,
                        height: 0,
                        borderTop: '12px solid transparent',
                        borderBottom: '12px solid transparent',
                        borderLeft: `20px solid ${COLORS.accent}`,
                        marginLeft: 4,
                      }} />
                    )}
                  </button>
                </div>

                {/* Audio Element */}
                <audio 
                  ref={audioRef} 
                  src={currentChapter.audioUrl} 
                  preload="metadata" 
                />

                {/* Progress Bar */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{
                    width: '100%',
                    height: 4,
                    background: 'rgba(255, 180, 100, 0.15)',
                    borderRadius: 2,
                    marginBottom: 8,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${audioDuration ? (audioProgress / audioDuration) * 100 : 0}%`,
                      background: COLORS.accent,
                      borderRadius: 2,
                      transition: 'width 0.1s linear',
                    }} />
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    color: COLORS.textDim,
                  }}>
                    <span>{formatTime(audioProgress)}</span>
                    <span>{formatTime(audioDuration)}</span>
                  </div>
                </div>

                {/* Playback Controls */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 12,
                  marginBottom: 24,
                }}>
                  <button
                    onClick={handleRewind}
                    style={{
                      padding: '10px 16px',
                      background: 'rgba(255, 180, 100, 0.08)',
                      border: `1px solid rgba(255, 180, 100, 0.2)`,
                      borderRadius: 8,
                      color: COLORS.accentDim,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    -15s
                  </button>
                  <button
                    onClick={handleStop}
                    style={{
                      padding: '10px 16px',
                      background: 'rgba(200, 100, 80, 0.08)',
                      border: `1px solid rgba(200, 100, 80, 0.2)`,
                      borderRadius: 8,
                      color: 'rgba(220, 120, 100, 0.7)',
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    Stop
                  </button>
                  <button
                    onClick={handleForward}
                    style={{
                      padding: '10px 16px',
                      background: 'rgba(255, 180, 100, 0.08)',
                      border: `1px solid rgba(255, 180, 100, 0.2)`,
                      borderRadius: 8,
                      color: COLORS.accentDim,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    +15s
                  </button>
                </div>

                {/* Chapter Navigation */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                }}>
                  <button
                    onClick={() => handleChapterSelect(currentChapterIndex - 1)}
                    disabled={currentChapterIndex === 0}
                    style={{
                      padding: '10px 16px',
                      background: 'rgba(255, 180, 100, 0.1)',
                      border: `1px solid rgba(255, 180, 100, 0.2)`,
                      borderRadius: 8,
                      color: COLORS.accentDim,
                      fontSize: 13,
                      cursor: currentChapterIndex === 0 ? 'not-allowed' : 'pointer',
                      opacity: currentChapterIndex === 0 ? 0.4 : 1,
                    }}
                  >
                    ← Prev
                  </button>
                  <span style={{ fontSize: 12, color: COLORS.textDim }}>
                    {currentChapterIndex + 1} / {selectedStory.chapters.length}
                  </span>
                  <button
                    onClick={() => handleChapterSelect(currentChapterIndex + 1)}
                    disabled={currentChapterIndex === selectedStory.chapters.length - 1}
                    style={{
                      padding: '10px 16px',
                      background: 'rgba(255, 180, 100, 0.1)',
                      border: `1px solid rgba(255, 180, 100, 0.2)`,
                      borderRadius: 8,
                      color: COLORS.accentDim,
                      fontSize: 13,
                      cursor: currentChapterIndex === selectedStory.chapters.length - 1 ? 'not-allowed' : 'pointer',
                      opacity: currentChapterIndex === selectedStory.chapters.length - 1 ? 0.4 : 1,
                    }}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* LEARN TAB */}
            {/* ============================================================ */}
            {activeTab === 'learn' && !selectedCategory && !selectedStory && !selectedLearnCategory && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 12,
                maxWidth: 360,
                width: '100%',
                animation: 'fadeIn 0.4s ease-out',
              }}>
                {LEARN_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    className="card-btn"
                    onClick={() => setSelectedLearnCategory(category.id)}
                    style={{
                      padding: '18px 16px',
                      background: COLORS.cardBg,
                      border: `1px solid ${COLORS.cardBorder}`,
                      borderRadius: 14,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 16,
                      fontWeight: 400,
                      color: COLORS.text,
                      marginBottom: 6,
                    }}>
                      {category.title}
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: COLORS.textDim,
                      marginBottom: 8,
                      lineHeight: 1.4,
                    }}>
                      {category.description}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: COLORS.accentDim,
                    }}>
                      {category.count} lessons
                    </div>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'learn' && !selectedCategory && !selectedStory && selectedLearnCategory && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                maxWidth: 420,
                width: '100%',
                animation: 'fadeIn 0.4s ease-out',
              }}>
                <button
                  onClick={() => {
                    setSelectedLearnCategory(null);
                    setActiveLearnLessonId(null);
                  }}
                  style={{
                    alignSelf: 'flex-start',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '10px 16px',
                    background: COLORS.cardBg,
                    border: `1px solid ${COLORS.cardBorder}`,
                    borderRadius: 50,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 500,
                    color: COLORS.textMuted,
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
                    color: COLORS.text,
                    marginBottom: 4,
                  }}>
                    {selectedLearnMeta?.title ?? 'Learn'}
                  </div>
                  {selectedLearnMeta?.description && (
                    <div style={{
                      fontSize: 13,
                      color: COLORS.textDim,
                      lineHeight: 1.5,
                    }}>
                      {selectedLearnMeta.description}
                    </div>
                  )}
                </div>

                {selectedLearnLessons.map((lesson, idx) => {
                  const isCompleted = completedLearnLessons.has(lesson.id);
                  return (
                    <button
                      key={lesson.id}
                      className="card-btn"
                      onClick={() => {
                        setActiveLearnLessonId(lesson.id);
                        onStartLesson?.(lesson.id);
                      }}
                      style={{
                        padding: '16px 16px',
                        background: COLORS.cardBg,
                        border: `1px solid ${COLORS.cardBorder}`,
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
                          color: COLORS.text,
                          marginBottom: 4,
                        }}>
                          {lesson.title}
                        </div>
                        <div style={{
                          fontSize: 12,
                          color: COLORS.textDim,
                        }}>
                          Lesson {idx + 1} of {selectedLearnLessons.length}
                        </div>
                      </div>

                      {isCompleted && (
                        <div style={{
                          fontSize: 11,
                          color: COLORS.accentDim,
                          padding: '6px 10px',
                          borderRadius: 999,
                          border: `1px solid rgba(255, 180, 100, 0.25)`,
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
            )}

            {activeTab === 'learn' && activeLearnLesson && (
              <activeLearnLesson.Component
                onBack={() => setActiveLearnLessonId(null)}
                onComplete={() => markLearnLessonComplete(activeLearnLesson.id)}
              />
            )}

            {/* ============================================================ */}
            {/* DISCOVER TAB - Assessments */}
            {/* ============================================================ */}
            {activeTab === 'discover' && !selectedCategory && !selectedStory && !activeAssessment && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                maxWidth: 420,
                width: '100%',
                animation: 'fadeIn 0.4s ease-out',
              }}>
                {DISCOVER_ASSESSMENTS.map((assessment) => {
                  const isCompleted = completedAssessments.includes(assessment.id);
                  return (
                    <button
                      key={assessment.id}
                      className="card-btn"
                      onClick={() => {
                        setActiveAssessment(assessment.id);
                        onStartAssessment?.(assessment.id);
                      }}
                      style={{
                        padding: '18px',
                        background: COLORS.cardBg,
                        border: `1px solid ${COLORS.cardBorder}`,
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
                            fontSize: 18,
                            lineHeight: '38px',
                            flexShrink: 0,
                          }}>
                            {assessment.icon}
                          </div>

                          <div>
                            <div style={{
                              fontFamily: "'Cormorant Garamond', Georgia, serif",
                              fontSize: 18,
                              fontWeight: 400,
                              color: COLORS.text,
                              marginBottom: 2,
                            }}>
                              {assessment.title}
                            </div>
                            <div style={{
                              fontSize: 12,
                              color: COLORS.accentDim,
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
                            color: COLORS.accentDim,
                          }}>
                            {assessment.duration}
                          </div>

                          {isCompleted && (
                            <div style={{
                              fontSize: 11,
                              color: COLORS.accentDim,
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
                        color: COLORS.textDim,
                        lineHeight: 1.4,
                      }}>
                        {assessment.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {activeTab === 'discover' && activeDiscoverAssessment && (
              <activeDiscoverAssessment.Component
                onBack={() => setActiveAssessment(null)}
                onComplete={() => markAssessmentComplete(activeDiscoverAssessment.id)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}