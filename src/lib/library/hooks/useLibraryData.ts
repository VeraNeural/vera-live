/**
 * useLibraryData Hook
 * 
 * Manages data fetching and state for Library content.
 * - Supabase queries for stories, lessons, assessments
 * - localStorage for completion tracking
 * - Data fetching/caching logic
 */

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { DBStory, DBLesson, DBAssessment } from '../types';

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UseLibraryDataReturn {
  // Database content
  dbStories: DBStory[];
  dbLessons: DBLesson[];
  dbAssessments: DBAssessment[];
  dbLoading: boolean;
  
  // Completion tracking
  completedLearnLessons: Set<string>;
  completedAssessments: string[];
  
  // Completion actions
  markLearnLessonComplete: (lessonId: string) => void;
  markAssessmentComplete: (assessmentId: string) => void;
}

/**
 * Custom hook for managing Library data fetching and completion state
 */
export function useLibraryData(): UseLibraryDataReturn {
  // Database content state
  const [dbStories, setDbStories] = useState<DBStory[]>([]);
  const [dbLessons, setDbLessons] = useState<DBLesson[]>([]);
  const [dbAssessments, setDbAssessments] = useState<DBAssessment[]>([]);
  const [dbLoading, setDbLoading] = useState(true);

  // Completion tracking state
  const [completedLearnLessons, setCompletedLearnLessons] = useState<Set<string>>(new Set());
  const [completedAssessments, setCompletedAssessments] = useState<string[]>([]);

  // Fetch content from Supabase
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data: storiesData } = await supabase
          .from('stories')
          .select('*')
          .order('created_at', { ascending: false });
        
        const { data: lessonsData } = await supabase
          .from('lessons')
          .select('*')
          .order('created_at', { ascending: false });
        
        const { data: assessmentsData } = await supabase
          .from('assessments')
          .select('*')
          .order('created_at', { ascending: false });

        if (process.env.NODE_ENV === 'development') {
          console.log('Lessons from DB:', lessonsData);
        }

        if (storiesData) setDbStories(storiesData);
        if (lessonsData) setDbLessons(lessonsData);
        if (assessmentsData) setDbAssessments(assessmentsData);
      } catch (error) {
        console.error('Error fetching library content:', error);
      } finally {
        setDbLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Load completed lessons from localStorage
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

  // Load completed assessments from localStorage
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

  // Mark a lesson as complete
  const markLearnLessonComplete = (lessonId: string) => {
    setCompletedLearnLessons((prev) => {
      if (prev.has(lessonId)) return prev;
      const next = new Set(prev);
      next.add(lessonId);
      try {
        localStorage.setItem(
          'vera.library.learn.completedLessons.v1',
          JSON.stringify(Array.from(next))
        );
      } catch {
        // Ignore persistence failures
      }
      return next;
    });
  };

  // Mark an assessment as complete
  const markAssessmentComplete = (assessmentId: string) => {
    setCompletedAssessments((prev) => {
      if (prev.includes(assessmentId)) return prev;
      const next = [...prev, assessmentId];
      try {
        localStorage.setItem(
          'vera.library.discover.completedAssessments.v1',
          JSON.stringify(next)
        );
      } catch {
        // Ignore persistence failures
      }
      return next;
    });
  };

  return {
    dbStories,
    dbLessons,
    dbAssessments,
    dbLoading,
    completedLearnLessons,
    completedAssessments,
    markLearnLessonComplete,
    markAssessmentComplete,
  };
}
