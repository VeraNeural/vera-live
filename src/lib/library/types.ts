// ============================================================================
// LIBRARY ROOM TYPE DEFINITIONS
// ============================================================================

import type { ComponentType } from 'react';

export interface LibraryRoomProps {
  onBack: () => void;
  onStartStory?: (storyId: string) => void;
  onStartLesson?: (lessonId: string) => void;
  onStartAssessment?: (assessmentId: string) => void;
}

export type Tab = 'stories' | 'learn' | 'discover';

export type Chapter = {
  id: string;
  title: string;
  duration: string;
  audioUrl: string;
};

export type Story = {
  id: string;
  title: string;
  description: string;
  category: string;
  chapters: Chapter[];
};

export type LearnLessonComponent = ComponentType<{
  onBack: () => void;
  onComplete?: () => void;
}>;

export type LearnLesson = {
  id: string;
  title: string;
  Component: LearnLessonComponent;
};

export type DiscoverAssessmentComponent = ComponentType<{
  onBack: () => void;
  onComplete?: (...args: any[]) => void;
}>;

export type DiscoverAssessment = {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  description: string;
  icon: string;
  Component: DiscoverAssessmentComponent;
};

// Database types for Supabase content
export type DBStory = {
  id: string;
  title: string;
  description: string;
  category: string;
  chapters: {
    id: string;
    title: string;
    duration: string;
    text: string;
  }[];
  created_at?: string;
};

export type DBLesson = {
  id: string;
  title: string;
  category: string;
  description: string;
  content: {
    type: string;
    title?: string;
    subtitle?: string;
    content?: string;
    highlight?: string;
    points?: string[];
    visual?: string;
  }[];
  created_at?: string;
};

export type DBAssessment = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  icon: string;
  questions: {
    id: string;
    text: string;
    subtext?: string;
    options: {
      value: number;
      label: string;
      description?: string;
    }[];
    category?: string;
  }[];
  result_types: {
    id: string;
    name: string;
    description: string;
    signs?: string[];
    strengths?: string[];
    shadow?: string;
    tools?: string[];
    color: string;
  }[];
  created_at?: string;
};

export type CategoryItem = {
  id: string;
  label: string;
  icon: string;
};

// ============================================================================
// PERSONALIZATION TYPES
// ============================================================================

export type UserPattern = {
  type: 'stress-response' | 'rest-preference' | 'learning-style' | 'emotional-pattern' | 'connection-style';
  value: string;
  confidence: number; // 0-1
  source: 'assessment' | 'chat-history' | 'lesson-completion' | 'inferred';
  detectedAt?: string;
};

export type LearningProgress = {
  lessonId: string;
  completed: boolean;
  completedAt?: string;
  timeSpent?: number; // minutes
  notes?: string;
  score?: number; // 0-100
};

export type PersonalizedSuggestion = {
  type: 'story' | 'lesson' | 'assessment';
  id: string;
  title: string;
  reason: string; // Why this is suggested for the user
  priority: 'high' | 'medium' | 'low';
  matchScore: number; // 0-1, how well it matches user patterns
};

export type GeneratedLesson = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  content: {
    type: string;
    title?: string;
    subtitle?: string;
    content?: string;
    highlight?: string;
    points?: string[];
    visual?: string;
  }[];
  forPattern: UserPattern;
  generatedAt: string;
  duration?: string;
};

export type GeneratedStory = {
  id: string;
  title: string;
  description: string;
  category: string;
  chapters: {
    id: string;
    title: string;
    duration: string;
    text: string;
    audioUrl?: string;
  }[];
  theme: string;
  forPattern: UserPattern;
  generatedAt: string;
};
