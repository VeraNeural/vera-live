'use client';

import { useState, useEffect, useRef } from 'react';

interface LibraryRoomProps {
  onBack: () => void;
  onStartStory?: (storyId: string) => void;
  onStartLesson?: (lessonId: string) => void;
  onStartAssessment?: (assessmentId: string) => void;
}

type Assessment = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  questions: number;
};

const STORY_CATEGORIES = [
  { id: 'rest-sleep', title: 'Rest & Sleep', description: 'Gentle stories to ease you into rest', count: 4 },
  { id: 'guided-journeys', title: 'Guided Journeys', description: 'Imaginative travels for the mind', count: 3 },
  { id: 'meditative-tales', title: 'Meditative Tales', description: 'Stories that slow the world down', count: 3 },
  { id: 'rise-ready', title: 'Rise & Ready', description: 'Confidence and clarity for the day ahead', count: 4 },
];

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

const STORIES: Story[] = [
  { 
    id: 'rest-edge-of-sleep', 
    title: 'Rest — A Story for the Edge of Sleep', 
    description: 'A gentle descent into rest. Five chapters that ease you from day to night, from thoughts to stillness, from waking to sleep. Let each chapter carry you deeper.',
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
    description: 'A gentle walk through peaceful woods, where sunlight filters through ancient trees and every step brings you deeper into stillness. Journey through five chapters of deepening peace.',
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
    description: 'Discover the quiet power of spaces after the day ends. Five chapters exploring the stillness, freedom, and wisdom waiting in moments when the world steps away.',
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
    description: 'A series of imaginative journeys that transport your mind to places both familiar and fantastical. Five chapters of guided travel and discovery.',
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
  { id: 'emotions', title: 'Understanding Emotions', description: 'The language of feeling', count: 3 },
  { id: 'rest-science', title: 'The Science of Rest', description: 'Why restoration matters', count: 3 },
  { id: 'resilience', title: 'Building Resilience', description: "Growing through life's challenges", count: 4 },
];

const ASSESSMENTS: Assessment[] = [
  { 
    id: 'inner-landscape', 
    title: 'Inner Landscape', 
    subtitle: 'Emotional Patterns',
    description: 'A gentle exploration of your emotional world',
    duration: '15 min',
    questions: 28
  },
  { 
    id: 'rest-restoration', 
    title: 'Rest & Restoration', 
    subtitle: 'How You Recharge',
    description: 'Discover your ideal practices for recovery',
    duration: '12 min',
    questions: 24
  },
  { 
    id: 'stress-response', 
    title: 'Stress Response', 
    subtitle: "Your Body's Patterns",
    description: 'Understanding how you navigate pressure',
    duration: '15 min',
    questions: 30
  },
  { 
    id: 'connection-style', 
    title: 'Connection Style', 
    subtitle: 'Relationships & Boundaries',
    description: 'How you relate and what you need from others',
    duration: '12 min',
    questions: 22
  },
  { 
    id: 'life-rhythm', 
    title: 'Life Rhythm', 
    subtitle: 'Energy & Natural Cycles',
    description: 'Mapping your daily and seasonal flow',
    duration: '10 min',
    questions: 20
  },
];

export default function LibraryRoom({ onBack, onStartStory, onStartLesson, onStartAssessment }: LibraryRoomProps) {
  const [activeTab, setActiveTab] = useState<'stories' | 'learn' | 'discover'>('stories');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [embers] = useState(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 5 + (i * 7) % 15,
      delay: (i * 0.4) % 4,
      duration: 2 + (i % 3),
    }))
  );

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setAudioProgress(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setAudioDuration(audio.duration);
    };

    const handleEnded = () => {
      // Auto-play next chapter if available
      if (selectedStory && currentChapterIndex < selectedStory.chapters.length - 1) {
        handleNextChapter();
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCategoryClick = (categoryId: string, type: 'story' | 'lesson') => {
    if (type === 'story') {
      setIsTransitioning(true);
      setTimeout(() => {
        setSelectedCategory(categoryId);
        setIsTransitioning(false);
      }, 300);
    } else if (type === 'lesson' && onStartLesson) {
      onStartLesson(categoryId);
    }
  };

  const handleStoryClick = (story: Story) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedStory(story);
      setCurrentChapterIndex(0);
      setIsTransitioning(false);
    }, 300);
  };

  const handleBackToCategories = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedCategory(null);
      setSelectedStory(null);
      setCurrentChapterIndex(0);
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
      setIsTransitioning(false);
    }, 300);
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

  const handleNextChapter = () => {
    if (!selectedStory || currentChapterIndex >= selectedStory.chapters.length - 1) return;
    handleChapterSelect(currentChapterIndex + 1);
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex <= 0) return;
    handleChapterSelect(currentChapterIndex - 1);
  };

  const handleRewind = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
  };

  const handleForward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 15);
  };

  const handleAssessmentClick = (assessmentId: string) => {
    if (onStartAssessment) {
      onStartAssessment(assessmentId);
    }
  };

  const storiesInCategory = STORIES.filter(s => s.category === selectedCategory);

  return (
    <>
      <style jsx>{`
        .library-room {
          min-height: 100vh;
          min-height: 100dvh;
          background: linear-gradient(180deg, #12100e 0%, #1a1612 30%, #211c16 60%, #1a1612 100%);
          position: relative;
          overflow-x: hidden;
          overflow-y: auto;
        }

        .ambient-layer {
          position: fixed;
          inset: 0;
          pointer-events: none;
        }

        .warm-glow {
          background: 
            radial-gradient(ellipse 50% 60% at 12% 85%, rgba(255, 140, 50, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse 40% 50% at 15% 90%, rgba(255, 100, 30, 0.15) 0%, transparent 40%),
            radial-gradient(ellipse 30% 30% at 10% 80%, rgba(255, 80, 20, 0.1) 0%, transparent 35%);
          animation: fireGlow 3s ease-in-out infinite;
        }

        @keyframes fireGlow {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }

        .ceiling-shadow {
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, transparent 15%);
        }

        .room-elements {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: ${isLoaded ? 0.35 : 0};
          transition: opacity 1s ease;
        }

        .floor {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 35%;
          background: linear-gradient(180deg, rgba(35, 28, 20, 0.9) 0%, rgba(30, 24, 18, 0.95) 50%, rgba(25, 20, 15, 1) 100%);
          transform: perspective(800px) rotateX(50deg);
          transform-origin: bottom center;
        }

        .floor-boards {
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(90deg, transparent 0px, transparent 80px, rgba(0, 0, 0, 0.1) 80px, rgba(0, 0, 0, 0.1) 82px);
        }

        .rug {
          position: absolute;
          bottom: 5%;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 25%;
          background: radial-gradient(ellipse at center, rgba(120, 60, 40, 0.3) 0%, rgba(100, 50, 35, 0.2) 40%, rgba(80, 40, 30, 0.1) 70%, transparent 100%);
          border-radius: 50%;
        }

        .rug-pattern {
          position: absolute;
          top: 20%;
          left: 15%;
          right: 15%;
          bottom: 20%;
          border: 1px solid rgba(150, 80, 50, 0.2);
          border-radius: 50%;
        }

        .bookshelf {
          position: absolute;
          background: linear-gradient(180deg, rgba(60, 45, 30, 0.95) 0%, rgba(50, 38, 25, 0.9) 50%, rgba(45, 32, 20, 0.85) 100%);
          box-shadow: inset 0 3px 15px rgba(0, 0, 0, 0.4), 5px 0 20px rgba(0, 0, 0, 0.3);
        }

        .bookshelf-left {
          left: 0;
          top: 5%;
          width: 8%;
          height: 65%;
          border-radius: 0 6px 6px 0;
        }

        .bookshelf-right {
          right: 0;
          top: 8%;
          width: 6%;
          height: 55%;
          border-radius: 6px 0 0 6px;
          box-shadow: inset 0 3px 15px rgba(0, 0, 0, 0.4), -5px 0 20px rgba(0, 0, 0, 0.3);
        }

        .shelf {
          position: absolute;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(180deg, rgba(80, 60, 40, 1) 0%, rgba(60, 45, 30, 1) 100%);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
        }

        .books-row {
          position: absolute;
          bottom: 4px;
          left: 4px;
          right: 4px;
          display: flex;
          align-items: flex-end;
          gap: 2px;
        }

        .book {
          border-radius: 1px 1px 0 0;
          box-shadow: inset -2px 0 4px rgba(0, 0, 0, 0.2);
        }

        .window-container {
          position: absolute;
          top: 8%;
          right: 12%;
          width: 14%;
          max-width: 140px;
          height: 32%;
        }

        .window {
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, rgba(15, 20, 35, 0.95) 0%, rgba(20, 30, 50, 0.9) 50%, rgba(15, 25, 40, 0.95) 100%);
          border: 4px solid rgba(60, 45, 30, 0.9);
          border-radius: 4px 4px 0 0;
          position: relative;
          box-shadow: inset 0 0 40px rgba(80, 100, 150, 0.1), 0 8px 30px rgba(0, 0, 0, 0.4);
        }

        .window-frame-v {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 100%;
          background: rgba(60, 45, 30, 0.9);
        }

        .window-frame-h {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          width: 100%;
          height: 4px;
          background: rgba(60, 45, 30, 0.9);
        }

        .window-sill {
          position: absolute;
          bottom: -10px;
          left: -6px;
          right: -6px;
          height: 10px;
          background: linear-gradient(180deg, rgba(70, 55, 35, 1) 0%, rgba(55, 42, 28, 1) 100%);
          border-radius: 0 0 4px 4px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .moon {
          position: absolute;
          top: 18%;
          right: 22%;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(240, 240, 255, 0.95) 0%, rgba(200, 205, 220, 0.9) 50%, rgba(180, 185, 200, 0.85) 100%);
          box-shadow: 0 0 20px rgba(200, 210, 255, 0.4);
        }

        .fireplace-container {
          position: absolute;
          bottom: 12%;
          left: 4%;
          width: 120px;
          height: 110px;
        }

        .fireplace {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 90px;
          background: linear-gradient(180deg, rgba(50, 38, 25, 1) 0%, rgba(40, 30, 20, 1) 50%, rgba(35, 26, 18, 1) 100%);
          border-radius: 6px 6px 0 0;
          box-shadow: inset 0 -12px 25px rgba(0, 0, 0, 0.5), 0 5px 20px rgba(0, 0, 0, 0.4);
        }

        .fireplace-mantle {
          position: absolute;
          top: -10px;
          left: -12px;
          right: -12px;
          height: 12px;
          background: linear-gradient(180deg, rgba(70, 55, 35, 1) 0%, rgba(55, 42, 28, 1) 100%);
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .fireplace-opening {
          position: absolute;
          bottom: 6px;
          left: 50%;
          transform: translateX(-50%);
          width: 65%;
          height: 60px;
          background: radial-gradient(ellipse at bottom, rgba(20, 15, 10, 1) 0%, rgba(10, 8, 5, 1) 60%, rgba(5, 4, 3, 1) 100%);
          border-radius: 45% 45% 0 0;
          overflow: hidden;
          box-shadow: inset 0 0 25px rgba(0, 0, 0, 0.8);
        }

        .fire-container {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 50px;
        }

        .log {
          position: absolute;
          bottom: 0;
          height: 10px;
          background: linear-gradient(90deg, rgba(60, 40, 25, 1) 0%, rgba(50, 35, 22, 1) 50%, rgba(45, 30, 20, 1) 100%);
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .log-1 { left: 5px; width: 45px; transform: rotate(-8deg); }
        .log-2 { right: 5px; width: 40px; transform: rotate(10deg); }
        .log-3 { left: 12px; bottom: 6px; width: 35px; height: 8px; }

        .flame {
          position: absolute;
          bottom: 12px;
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          animation: flameFlicker 0.4s ease-in-out infinite alternate;
        }

        .flame-main {
          left: 50%;
          transform: translateX(-50%);
          width: 22px;
          height: 40px;
          background: radial-gradient(ellipse at bottom, rgba(255, 255, 220, 1) 0%, rgba(255, 220, 120, 0.95) 15%, rgba(255, 180, 80, 0.85) 30%, rgba(255, 130, 50, 0.7) 50%, rgba(255, 80, 20, 0.4) 70%, transparent 100%);
          filter: blur(1px);
        }

        .flame-left {
          left: 25%;
          width: 16px;
          height: 30px;
          background: radial-gradient(ellipse at bottom, rgba(255, 230, 150, 0.95) 0%, rgba(255, 170, 70, 0.8) 40%, rgba(255, 100, 30, 0.4) 70%, transparent 100%);
          animation-delay: 0.15s;
          transform: translateX(-50%);
        }

        .flame-right {
          right: 25%;
          width: 18px;
          height: 34px;
          background: radial-gradient(ellipse at bottom, rgba(255, 240, 170, 0.95) 0%, rgba(255, 180, 80, 0.8) 40%, rgba(255, 110, 40, 0.4) 70%, transparent 100%);
          animation-delay: 0.3s;
          transform: translateX(50%);
        }

        @keyframes flameFlicker {
          0% { transform: translateX(-50%) scaleY(1) scaleX(1) rotate(-1deg); opacity: 1; }
          100% { transform: translateX(-50%) scaleY(1.06) scaleX(0.97) rotate(1deg); opacity: 0.95; }
        }

        .fire-glow {
          position: absolute;
          bottom: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 140px;
          height: 100px;
          background: radial-gradient(ellipse, rgba(255, 150, 50, 0.25) 0%, rgba(255, 120, 30, 0.15) 30%, rgba(255, 100, 20, 0.08) 50%, transparent 70%);
          animation: glowPulse 2s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.8; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.06); }
        }

        .ember {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(255, 150, 50, 0.9);
          box-shadow: 0 0 5px rgba(255, 150, 50, 0.6);
          animation: emberFloat linear infinite;
        }

        @keyframes emberFloat {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-60px) scale(0.3); opacity: 0; }
        }

        .chair-container {
          position: absolute;
          bottom: 14%;
          right: 22%;
          width: 90px;
          height: 100px;
        }

        .chair-back {
          position: absolute;
          bottom: 38px;
          left: 8px;
          width: 74px;
          height: 62px;
          background: linear-gradient(135deg, rgba(100, 70, 45, 0.95) 0%, rgba(85, 60, 40, 0.9) 50%, rgba(75, 52, 35, 0.85) 100%);
          border-radius: 10px 10px 0 0;
          box-shadow: inset 0 6px 15px rgba(130, 100, 70, 0.3), inset 0 -4px 12px rgba(0, 0, 0, 0.2);
        }

        .chair-seat {
          position: absolute;
          bottom: 25px;
          left: 4px;
          width: 82px;
          height: 20px;
          background: linear-gradient(180deg, rgba(110, 80, 55, 1) 0%, rgba(95, 68, 45, 1) 100%);
          border-radius: 6px;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
        }

        .chair-arm {
          position: absolute;
          bottom: 30px;
          width: 14px;
          height: 45px;
          background: linear-gradient(180deg, rgba(95, 68, 45, 1) 0%, rgba(80, 55, 38, 1) 100%);
          border-radius: 6px;
        }

        .chair-arm-left { left: 0; }
        .chair-arm-right { right: 0; }

        .chair-leg {
          position: absolute;
          bottom: 0;
          width: 6px;
          height: 25px;
          background: linear-gradient(180deg, rgba(70, 50, 35, 1) 0%, rgba(55, 40, 28, 1) 100%);
          border-radius: 2px;
        }

        .chair-leg-1 { left: 10px; }
        .chair-leg-2 { right: 10px; }

        .side-table {
          position: absolute;
          bottom: 14%;
          right: 12%;
        }

        .table-top {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, rgba(80, 60, 40, 1) 0%, rgba(65, 48, 32, 1) 100%);
          border-radius: 50%;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .table-leg {
          width: 6px;
          height: 32px;
          background: linear-gradient(180deg, rgba(65, 48, 32, 1) 0%, rgba(50, 38, 25, 1) 100%);
          margin: 0 auto;
          border-radius: 2px;
        }

        .table-base {
          width: 24px;
          height: 5px;
          background: linear-gradient(180deg, rgba(55, 42, 28, 1) 0%, rgba(45, 35, 24, 1) 100%);
          margin: 0 auto;
          border-radius: 3px;
        }

        .table-lamp {
          position: absolute;
          top: -45px;
          left: 50%;
          transform: translateX(-50%);
        }

        .lamp-shade {
          width: 26px;
          height: 20px;
          background: linear-gradient(180deg, rgba(255, 250, 240, 0.95) 0%, rgba(245, 238, 225, 0.9) 100%);
          border-radius: 3px 3px 10px 10px;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15), inset 0 -12px 20px rgba(255, 200, 120, 0.2);
        }

        .lamp-stem {
          width: 4px;
          height: 14px;
          background: rgba(130, 100, 70, 1);
          margin: 0 auto;
        }

        .lamp-base {
          width: 14px;
          height: 4px;
          background: rgba(110, 80, 55, 1);
          margin: 0 auto;
          border-radius: 2px;
        }

        .back-button {
          position: fixed;
          top: calc(env(safe-area-inset-top, 0px) + 16px);
          left: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          border-radius: 50px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          cursor: pointer;
          z-index: 100;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          font-family: inherit;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.12);
          transform: translateX(-2px);
        }

        .content {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: calc(env(safe-area-inset-top, 0px) + 70px) 20px 40px;
          opacity: ${isLoaded ? 1 : 0};
          transform: translateY(${isLoaded ? '0' : '20px'});
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeOutDown {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(20px);
          }
        }

        .header {
          text-align: center;
          margin-bottom: 28px;
        }

        .title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 2rem;
          font-weight: 300;
          color: #f5e6d3;
          margin-bottom: 8px;
          letter-spacing: 0.02em;
        }

        .subtitle {
          font-size: 0.88rem;
          color: rgba(245, 230, 211, 0.5);
        }

        .tabs {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 28px;
        }

        .tab {
          padding: 10px 22px;
          border-radius: 50px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: transparent;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.82rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .tab:hover {
          border-color: rgba(255, 180, 100, 0.35);
          color: rgba(255, 255, 255, 0.85);
        }

        .tab.active {
          background: rgba(255, 180, 100, 0.12);
          border-color: rgba(255, 180, 100, 0.4);
          color: #f5e6d3;
        }

        .content-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          max-width: 380px;
          width: 100%;
          animation: ${isTransitioning ? 'fadeOutDown' : 'fadeInUp'} 0.4s ease-in-out;
        }

        .category-card {
          background: rgba(50, 38, 28, 0.55);
          border: 1px solid rgba(255, 200, 150, 0.08);
          border-radius: 12px;
          padding: 16px 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }

        .category-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 180, 100, 0.3);
          background: rgba(70, 52, 38, 0.6);
          box-shadow: 0 8px 30px rgba(255, 150, 50, 0.08);
        }

        .category-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 0.95rem;
          font-weight: 400;
          color: #f5e6d3;
          margin-bottom: 4px;
        }

        .category-description {
          font-size: 0.68rem;
          color: rgba(245, 230, 211, 0.45);
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .category-count {
          font-size: 0.65rem;
          color: rgba(255, 180, 100, 0.55);
          letter-spacing: 0.02em;
        }

        .assessments-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 380px;
          width: 100%;
          animation: ${isTransitioning ? 'fadeOutDown' : 'fadeInUp'} 0.4s ease-in-out;
        }

        .assessment-card {
          background: rgba(50, 38, 28, 0.55);
          border: 1px solid rgba(255, 200, 150, 0.08);
          border-radius: 12px;
          padding: 16px 18px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }

        .assessment-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 180, 100, 0.3);
          background: rgba(70, 52, 38, 0.6);
          box-shadow: 0 8px 30px rgba(255, 150, 50, 0.08);
        }

        .assessment-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2px;
        }

        .assessment-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.05rem;
          font-weight: 400;
          color: #f5e6d3;
        }

        .assessment-duration {
          font-size: 0.65rem;
          color: rgba(255, 180, 100, 0.55);
        }

        .assessment-subtitle {
          font-size: 0.7rem;
          color: rgba(255, 180, 100, 0.5);
          margin-bottom: 6px;
        }

        .assessment-description {
          font-size: 0.75rem;
          color: rgba(245, 230, 211, 0.45);
          line-height: 1.4;
        }

        /* ============ STORY LIST ============ */
        .story-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 380px;
          width: 100%;
          animation: ${isTransitioning ? 'fadeOutDown' : 'fadeInUp'} 0.4s ease-in-out;
        }

        .story-card {
          background: rgba(50, 38, 28, 0.55);
          border: 1px solid rgba(255, 200, 150, 0.08);
          border-radius: 12px;
          padding: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }

        .story-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 180, 100, 0.3);
          background: rgba(70, 52, 38, 0.6);
          box-shadow: 0 8px 30px rgba(255, 150, 50, 0.08);
        }

        .story-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 6px;
        }

        .story-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.05rem;
          font-weight: 400;
          color: #f5e6d3;
        }

        .story-duration {
          font-size: 0.65rem;
          color: rgba(255, 180, 100, 0.55);
        }

        .story-description {
          font-size: 0.75rem;
          color: rgba(245, 230, 211, 0.45);
          line-height: 1.5;
        }

        .back-to-categories {
          background: none;
          border: none;
          color: rgba(255, 180, 100, 0.6);
          font-size: 0.8rem;
          cursor: pointer;
          margin-bottom: 20px;
          font-family: inherit;
          transition: color 0.3s ease;
        }

        .back-to-categories:hover {
          color: rgba(255, 180, 100, 0.9);
        }

        .category-header {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.3rem;
          font-weight: 300;
          color: #f5e6d3;
          margin-bottom: 20px;
          text-align: center;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: rgba(245, 230, 211, 0.4);
          font-size: 0.85rem;
        }

        /* ============ STORY DETAIL ============ */
        .story-detail {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 400px;
          width: 100%;
          text-align: center;
          animation: ${isTransitioning ? 'fadeOutDown' : 'fadeInUp'} 0.4s ease-in-out;
        }

        .story-detail-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.8rem;
          font-weight: 300;
          color: #f5e6d3;
          margin-bottom: 8px;
        }

        .story-detail-duration {
          font-size: 0.8rem;
          color: rgba(255, 180, 100, 0.6);
          margin-bottom: 20px;
        }

        .story-detail-description {
          font-size: 0.9rem;
          color: rgba(245, 230, 211, 0.55);
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .play-button {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(255, 180, 100, 0.15);
          border: 1px solid rgba(255, 180, 100, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .play-button:hover {
          background: rgba(255, 180, 100, 0.25);
          border-color: rgba(255, 180, 100, 0.5);
          transform: scale(1.05);
        }

        .play-icon {
          width: 0;
          height: 0;
          border-top: 14px solid transparent;
          border-bottom: 14px solid transparent;
          border-left: 22px solid rgba(255, 180, 100, 0.8);
          margin-left: 4px;
        }

        .play-hint {
          font-size: 0.75rem;
          color: rgba(245, 230, 211, 0.35);
        }

        /* ============ AUDIO PLAYER ============ */
        .audio-player {
          width: 100%;
          max-width: 320px;
          margin-top: 24px;
        }

        .progress-bar-container {
          width: 100%;
          height: 4px;
          background: rgba(255, 180, 100, 0.15);
          border-radius: 2px;
          margin-bottom: 10px;
          cursor: pointer;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: rgba(255, 180, 100, 0.6);
          border-radius: 2px;
          transition: width 0.1s linear;
        }

        .time-display {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: rgba(245, 230, 211, 0.4);
        }

        /* ============ CHAPTERS ============ */
        .chapters-list {
          width: 100%;
          margin-bottom: 32px;
        }

        .chapters-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.1rem;
          font-weight: 300;
          color: rgba(255, 180, 100, 0.8);
          margin-bottom: 12px;
        }

        .chapter-buttons {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 200px;
          overflow-y: auto;
          padding-right: 8px;
        }

        .chapter-button {
          padding: 10px 12px;
          background: rgba(255, 180, 100, 0.08);
          border: 1px solid rgba(255, 180, 100, 0.15);
          border-radius: 6px;
          color: rgba(245, 230, 211, 0.6);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: left;
        }

        .chapter-button:hover {
          background: rgba(255, 180, 100, 0.12);
          border-color: rgba(255, 180, 100, 0.25);
          color: rgba(245, 230, 211, 0.8);
        }

        .chapter-button.active {
          background: rgba(255, 180, 100, 0.2);
          border-color: rgba(255, 180, 100, 0.4);
          color: rgba(255, 180, 100, 0.9);
        }

        .chapter-label {
          flex: 1;
          text-align: left;
        }

        .chapter-duration {
          font-size: 0.75rem;
          color: rgba(255, 180, 100, 0.5);
          margin-left: 8px;
        }

        .current-chapter-info {
          margin-bottom: 24px;
          text-align: center;
        }

        .current-chapter-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.4rem;
          font-weight: 300;
          color: rgba(255, 180, 100, 0.9);
          margin-bottom: 6px;
        }

        .current-chapter-duration {
          font-size: 0.85rem;
          color: rgba(255, 180, 100, 0.6);
        }

        /* ============ PLAYBACK CONTROLS ============ */
        .playback-controls {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin: 24px 0;
          align-items: center;
        }

        .control-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          background: rgba(255, 180, 100, 0.1);
          border: 1px solid rgba(255, 180, 100, 0.25);
          border-radius: 8px;
          padding: 8px 12px;
          color: rgba(255, 180, 100, 0.7);
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s ease;
        }

        .control-button:hover:not(:disabled) {
          background: rgba(255, 180, 100, 0.15);
          border-color: rgba(255, 180, 100, 0.4);
          color: rgba(255, 180, 100, 0.9);
        }

        .control-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .control-button.stop-button {
          background: rgba(220, 100, 80, 0.1);
          border-color: rgba(220, 100, 80, 0.25);
          color: rgba(220, 100, 80, 0.7);
        }

        .control-button.stop-button:hover:not(:disabled) {
          background: rgba(220, 100, 80, 0.15);
          border-color: rgba(220, 100, 80, 0.4);
          color: rgba(220, 100, 80, 0.9);
        }

        .control-icon {
          font-size: 1.2rem;
        }

        .control-label {
          font-size: 0.65rem;
        }

        /* ============ CHAPTER NAVIGATION ============ */
        .chapter-navigation {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-top: 24px;
          width: 100%;
          flex-wrap: wrap;
        }

        .nav-button {
          padding: 8px 16px;
          background: rgba(255, 180, 100, 0.12);
          border: 1px solid rgba(255, 180, 100, 0.25);
          border-radius: 6px;
          color: rgba(255, 180, 100, 0.8);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .nav-button:hover:not(:disabled) {
          background: rgba(255, 180, 100, 0.2);
          border-color: rgba(255, 180, 100, 0.4);
          color: rgba(255, 180, 100, 0.95);
        }

        .nav-button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .chapter-counter {
          font-size: 0.8rem;
          color: rgba(255, 180, 100, 0.6);
          white-space: nowrap;
        }

        .play-button.playing {
          background: rgba(255, 180, 100, 0.25);
        }

        .pause-icon {
          display: flex;
          gap: 6px;
        }

        .pause-bar {
          width: 6px;
          height: 24px;
          background: rgba(255, 180, 100, 0.8);
          border-radius: 2px;
        }

        @media (max-width: 768px) {
          .room-elements { opacity: ${isLoaded ? 0.25 : 0}; }
          .content-grid, .assessments-grid { max-width: 340px; }
          .bookshelf-left { width: 6%; }
          .bookshelf-right { display: none; }
          .window-container { width: 16%; right: 8%; }
          .chair-container { right: 18%; transform: scale(0.85); }
          .side-table { right: 8%; transform: scale(0.85); }
          .fireplace-container { width: 100px; left: 3%; }
        }

        @media (max-width: 480px) {
          .room-elements { opacity: ${isLoaded ? 0.2 : 0}; }
          .content { padding: calc(env(safe-area-inset-top, 0px) + 60px) 16px 30px; }
          .header { margin-bottom: 20px; }
          .title { font-size: 1.5rem; }
          .subtitle { font-size: 0.8rem; }
          .tabs { margin-bottom: 20px; gap: 5px; }
          .tab { padding: 8px 14px; font-size: 0.75rem; }
          .content-grid, .assessments-grid { max-width: 280px; gap: 8px; }
          .content-grid { grid-template-columns: 1fr; }
          .category-card { padding: 14px; }
          .category-title { font-size: 0.9rem; }
          .assessment-card { padding: 14px 16px; }
          .assessment-title { font-size: 0.95rem; }
          .bookshelf-left { width: 5%; opacity: 0.5; }
          .window-container { width: 18%; right: 5%; top: 5%; height: 26%; }
          .fireplace-container { width: 80px; left: 2%; bottom: 10%; transform: scale(0.8); }
          .chair-container { right: 15%; bottom: 10%; transform: scale(0.7); }
          .side-table { right: 5%; bottom: 10%; transform: scale(0.7); }
          .vera-orb { width: 45px; height: 45px; }
          .vera-presence { bottom: 20px; right: 20px; }
        }
      `}</style>

      <div className="library-room">
        <div className="ambient-layer warm-glow" />
        <div className="ambient-layer ceiling-shadow" />

        <div className="room-elements">
          <div className="floor"><div className="floor-boards" /></div>
          <div className="rug"><div className="rug-pattern" /></div>

          <div className="bookshelf bookshelf-left">
            <div className="shelf" style={{ top: '15%' }}>
              <div className="books-row">
                <div className="book" style={{ width: '8px', height: '24px', background: '#8b4513' }} />
                <div className="book" style={{ width: '10px', height: '28px', background: '#2f4f4f' }} />
                <div className="book" style={{ width: '7px', height: '22px', background: '#800020' }} />
              </div>
            </div>
            <div className="shelf" style={{ top: '40%' }}>
              <div className="books-row">
                <div className="book" style={{ width: '9px', height: '26px', background: '#483d8b' }} />
                <div className="book" style={{ width: '7px', height: '22px', background: '#6b4423' }} />
                <div className="book" style={{ width: '10px', height: '28px', background: '#3d3d3d' }} />
              </div>
            </div>
            <div className="shelf" style={{ top: '65%' }}>
              <div className="books-row">
                <div className="book" style={{ width: '8px', height: '24px', background: '#5c4033' }} />
                <div className="book" style={{ width: '9px', height: '26px', background: '#704214' }} />
              </div>
            </div>
          </div>

          <div className="bookshelf bookshelf-right">
            <div className="shelf" style={{ top: '20%' }}>
              <div className="books-row">
                <div className="book" style={{ width: '7px', height: '22px', background: '#704214' }} />
                <div className="book" style={{ width: '8px', height: '24px', background: '#2f4f4f' }} />
              </div>
            </div>
            <div className="shelf" style={{ top: '50%' }}>
              <div className="books-row">
                <div className="book" style={{ width: '8px', height: '24px', background: '#5c4033' }} />
                <div className="book" style={{ width: '7px', height: '22px', background: '#8b4513' }} />
              </div>
            </div>
          </div>

          <div className="window-container">
            <div className="window">
              <div className="window-frame-v" />
              <div className="window-frame-h" />
              <div className="moon" />
            </div>
            <div className="window-sill" />
          </div>

          <div className="fireplace-container">
            <div className="fire-glow" />
            <div className="fireplace">
              <div className="fireplace-mantle" />
              <div className="fireplace-opening">
                <div className="fire-container">
                  <div className="log log-1" />
                  <div className="log log-2" />
                  <div className="log log-3" />
                  <div className="flame flame-main" />
                  <div className="flame flame-left" />
                  <div className="flame flame-right" />
                </div>
              </div>
            </div>
            {embers.map((ember) => (
              <div
                key={ember.id}
                className="ember"
                style={{
                  left: `${ember.x}%`,
                  bottom: '35%',
                  animationDuration: `${ember.duration}s`,
                  animationDelay: `${ember.delay}s`,
                }}
              />
            ))}
          </div>

          <div className="chair-container">
            <div className="chair-back" />
            <div className="chair-seat" />
            <div className="chair-arm chair-arm-left" />
            <div className="chair-arm chair-arm-right" />
            <div className="chair-leg chair-leg-1" />
            <div className="chair-leg chair-leg-2" />
          </div>

          <div className="side-table">
            <div className="table-lamp">
              <div className="lamp-shade" />
              <div className="lamp-stem" />
              <div className="lamp-base" />
            </div>
            <div className="table-top" />
            <div className="table-leg" />
            <div className="table-base" />
          </div>
        </div>

        <button className="back-button" onClick={onBack}>
          <span>←</span>
          <span>Back</span>
        </button>

        <div className="content">
          <div className="header">
            <h1 className="title">The Library</h1>
            <p className="subtitle">Stories to calm, lessons to grow, yourself to discover</p>
          </div>

          <div className="tabs">
            <button className={`tab ${activeTab === 'stories' ? 'active' : ''}`} onClick={() => setActiveTab('stories')}>Stories</button>
            <button className={`tab ${activeTab === 'learn' ? 'active' : ''}`} onClick={() => setActiveTab('learn')}>Learn</button>
            <button className={`tab ${activeTab === 'discover' ? 'active' : ''}`} onClick={() => setActiveTab('discover')}>Discover</button>
          </div>

          {activeTab === 'stories' && !selectedCategory && !selectedStory && (
            <div className="content-grid">
              {STORY_CATEGORIES.map((category) => (
                <div key={category.id} className="category-card" onClick={() => handleCategoryClick(category.id, 'story')}>
                  <h3 className="category-title">{category.title}</h3>
                  <p className="category-description">{category.description}</p>
                  <span className="category-count">{category.count} stories</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'stories' && selectedCategory && !selectedStory && (
            <>
              <button className="back-to-categories" onClick={handleBackToCategories}>
                ← Back to categories
              </button>
              <h2 className="category-header">
                {STORY_CATEGORIES.find(c => c.id === selectedCategory)?.title}
              </h2>
              {storiesInCategory.length > 0 ? (
                <div className="story-list">
                  {storiesInCategory.map((story) => (
                    <div key={story.id} className="story-card" onClick={() => handleStoryClick(story)}>
                      <div className="story-header">
                        <h3 className="story-title">{story.title}</h3>
                        <span className="story-duration">{story.chapters.length} chapters</span>
                      </div>
                      <p className="story-description">{story.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  Stories coming soon
                </div>
              )}
            </>
          )}

          {activeTab === 'stories' && selectedStory && (
            <>
              <button className="back-to-categories" onClick={handleBackToCategories}>
                ← Back to stories
              </button>
              <div className="story-detail">
                <h1 className="story-detail-title">{selectedStory.title}</h1>
                <p className="story-detail-description">{selectedStory.description}</p>
                
                {/* Chapter Selector */}
                <div className="chapters-list">
                  <h3 className="chapters-title">Select a chapter:</h3>
                  <div className="chapter-buttons">
                    {selectedStory.chapters.map((chapter, index) => (
                      <button 
                        key={chapter.id}
                        className={`chapter-button ${currentChapterIndex === index ? 'active' : ''}`}
                        onClick={() => handleChapterSelect(index)}
                      >
                        <span className="chapter-label">{chapter.title}</span>
                        <span className="chapter-duration">{chapter.duration}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current Chapter Info */}
                {selectedStory.chapters[currentChapterIndex] && (
                  <>
                    <div className="current-chapter-info">
                      <h2 className="current-chapter-title">{selectedStory.chapters[currentChapterIndex].title}</h2>
                      <span className="current-chapter-duration">{selectedStory.chapters[currentChapterIndex].duration}</span>
                    </div>
                    
                    {/* Play/Pause Button */}
                    <button className={`play-button ${isPlaying ? 'playing' : ''}`} onClick={togglePlayPause}>
                      {isPlaying ? (
                        <div className="pause-icon">
                          <div className="pause-bar" />
                          <div className="pause-bar" />
                        </div>
                      ) : (
                        <div className="play-icon" />
                      )}
                    </button>
                    <span className="play-hint">{isPlaying ? 'Tap to pause' : 'Tap to begin'}</span>

                    {/* Audio Element */}
                    <audio ref={audioRef} src={selectedStory.chapters[currentChapterIndex].audioUrl} preload="metadata" />
                    
                    {/* Progress Bar */}
                    <div className="audio-player">
                      <div className="progress-bar-container">
                        <div 
                          className="progress-bar" 
                          style={{ width: `${audioDuration ? (audioProgress / audioDuration) * 100 : 0}%` }} 
                        />
                      </div>
                      <div className="time-display">
                        <span>{formatTime(audioProgress)}</span>
                        <span>{formatTime(audioDuration)}</span>
                      </div>
                    </div>

                    {/* Playback Controls: Rewind, Stop, Forward */}
                    <div className="playback-controls">
                      <button className="control-button" onClick={handleRewind} title="Rewind 15 seconds">
                        <span className="control-icon">⏪</span>
                        <span className="control-label">-15s</span>
                      </button>
                      <button className="control-button stop-button" onClick={() => { setIsPlaying(false); if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; } }} title="Stop">
                        <span className="control-icon">⏹</span>
                        <span className="control-label">Stop</span>
                      </button>
                      <button className="control-button" onClick={handleForward} title="Forward 15 seconds">
                        <span className="control-icon">⏩</span>
                        <span className="control-label">+15s</span>
                      </button>
                    </div>

                    {/* Chapter Navigation */}
                    <div className="chapter-navigation">
                      <button 
                        className="nav-button prev" 
                        onClick={handlePrevChapter} 
                        disabled={currentChapterIndex === 0}
                        title="Previous chapter"
                      >
                        ← Previous Chapter
                      </button>
                      <span className="chapter-counter">
                        Chapter {currentChapterIndex + 1} of {selectedStory.chapters.length}
                      </span>
                      <button 
                        className="nav-button next" 
                        onClick={handleNextChapter}
                        disabled={currentChapterIndex === selectedStory.chapters.length - 1}
                        title="Next chapter"
                      >
                        Next Chapter →
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {activeTab === 'learn' && (
            <div className="content-grid">
              {LEARN_CATEGORIES.map((category) => (
                <div key={category.id} className="category-card" onClick={() => handleCategoryClick(category.id, 'lesson')}>
                  <h3 className="category-title">{category.title}</h3>
                  <p className="category-description">{category.description}</p>
                  <span className="category-count">{category.count} lessons</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'discover' && (
            <div className="assessments-grid">
              {ASSESSMENTS.map((assessment) => (
                <div key={assessment.id} className="assessment-card" onClick={() => handleAssessmentClick(assessment.id)}>
                  <div className="assessment-header">
                    <h3 className="assessment-title">{assessment.title}</h3>
                    <span className="assessment-duration">{assessment.duration}</span>
                  </div>
                  <span className="assessment-subtitle">{assessment.subtitle}</span>
                  <p className="assessment-description">{assessment.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}