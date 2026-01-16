// ============================================================================
// SUPABASE DATA HOOKS FOR LIBRARY
// ============================================================================
// Add this to a new file: src/hooks/useLibraryData.ts
// Or add directly to LibraryRoom.tsx

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ============================================================================
// TYPES (match your database schema)
// ============================================================================
export type DBStory = {
  id: string;
  title: string;
  description: string;
  category: string;
  chapters: {
    id: string;
    title: string;
    duration: string;
    text: string; // For TTS or display
  }[];
  icon?: string;
  created_at?: string;
};

export type DBLesson = {
  id: string;
  title: string;
  category: string;
  description: string;
  content: {
    type: 'title' | 'text' | 'visual' | 'insight' | 'practice' | 'summary';
    title?: string;
    subtitle?: string;
    content?: string;
    highlight?: string;
    points?: string[];
    visual?: string;
  }[];
  icon?: string;
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
    options: { value: number; label: string; description?: string }[];
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

// ============================================================================
// HOOKS
// ============================================================================

export function useStories() {
  const [stories, setStories] = useState<DBStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const { data, error } = await supabase
          .from('stories')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setStories(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stories');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return { stories, loading, error };
}

export function useLessons() {
  const [lessons, setLessons] = useState<DBLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const { data, error } = await supabase
          .from('lessons')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setLessons(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch lessons');
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  return { lessons, loading, error };
}

export function useAssessments() {
  const [assessments, setAssessments] = useState<DBAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const { data, error } = await supabase
          .from('assessments')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAssessments(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch assessments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  return { assessments, loading, error };
}

// ============================================================================
// CATEGORY HELPERS
// ============================================================================

export function getStoriesByCategory(stories: DBStory[]) {
  const categories: Record<string, DBStory[]> = {};
  
  stories.forEach(story => {
    if (!categories[story.category]) {
      categories[story.category] = [];
    }
    categories[story.category].push(story);
  });

  return categories;
}

export function getLessonsByCategory(lessons: DBLesson[]) {
  const categories: Record<string, DBLesson[]> = {};
  
  lessons.forEach(lesson => {
    if (!categories[lesson.category]) {
      categories[lesson.category] = [];
    }
    categories[lesson.category].push(lesson);
  });

  return categories;
}

// ============================================================================
// CATEGORY METADATA (for display)
// ============================================================================

export const STORY_CATEGORY_META: Record<string, { title: string; description: string; icon: string }> = {
  'rest-sleep': { 
    title: 'Rest & Sleep', 
    description: 'Gentle stories to ease you into rest',
    icon: 'rest-sleep'
  },
  'guided-journeys': { 
    title: 'Guided Journeys', 
    description: 'Imaginative travels for the mind',
    icon: 'guided-journeys'
  },
  'meditative-tales': { 
    title: 'Meditative Tales', 
    description: 'Stories that slow the world down',
    icon: 'meditative-tales'
  },
  'rise-ready': { 
    title: 'Rise & Ready', 
    description: 'Confidence and clarity for the day ahead',
    icon: 'rise-ready'
  },
};

export const LESSON_CATEGORY_META: Record<string, { title: string; description: string; icon: string }> = {
  'nervous-system': { 
    title: 'Your Nervous System', 
    description: "Understanding your body's wisdom",
    icon: 'nervous-system'
  },
  'emotions': { 
    title: 'Understanding Emotions', 
    description: 'The language of feeling',
    icon: 'emotions'
  },
  'rest-science': { 
    title: 'The Science of Rest', 
    description: 'Why restoration matters',
    icon: 'rest-science'
  },
  'resilience': { 
    title: 'Building Resilience', 
    description: "Growing through life's challenges",
    icon: 'resilience'
  },
};