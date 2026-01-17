// ============================================================================
// LIBRARY ROOM - LESSONS DATA
// ============================================================================

import type { LearnLesson, CategoryItem } from '../types';

// Import lesson components
import NervousSystemLesson1 from '@/components/sanctuary/learn/NervousSystemLesson1';
import NervousSystemLesson2 from '@/components/sanctuary/learn/NervousSystemLesson2';
import NervousSystemLesson3 from '@/components/sanctuary/learn/NervousSystemLesson3';
import NervousSystemLesson4 from '@/components/sanctuary/learn/NervousSystemLesson4';

import Emotionlesson1 from '@/components/sanctuary/learn/Emotionlesson1';
import Emotionlesson2 from '@/components/sanctuary/learn/Emotionlesson2';
import Emotionlesson3 from '@/components/sanctuary/learn/Emotionlesson3';
import Emotionlesson4 from '@/components/sanctuary/learn/Emotionlesson4';

import ScienceOfRestLesson1 from '@/components/sanctuary/learn/ScienceOfRestLesson1';
import ScienceOfRestLesson2 from '@/components/sanctuary/learn/ScienceOfRestLesson2';
import ScienceOfRestLesson3 from '@/components/sanctuary/learn/ScienceOfRestLesson3';
import ScienceOfRestLesson4 from '@/components/sanctuary/learn/ScienceOfRestLesson4';

import ResilienceLesson1 from '@/components/sanctuary/learn/ResilienceLesson1';
import ResilienceLesson2 from '@/components/sanctuary/learn/ResilienceLesson2';
import ResilienceLesson3 from '@/components/sanctuary/learn/ResilienceLesson3';
import ResilienceLesson4 from '@/components/sanctuary/learn/ResilienceLesson4';

export const LESSON_CATEGORIES: CategoryItem[] = [
  { 
    id: 'nervous-system', 
    label: 'Your Nervous System', 
    icon: 'nervous-system'
  },
  { 
    id: 'emotions', 
    label: 'Understanding Emotions', 
    icon: 'emotions'
  },
  { 
    id: 'rest-science', 
    label: 'The Science of Rest', 
    icon: 'rest-science'
  },
  { 
    id: 'resilience', 
    label: 'Building Resilience', 
    icon: 'resilience'
  },
];

export const LESSONS_BY_CATEGORY: Record<string, LearnLesson[]> = {
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

// Flat array of all lessons for easier iteration
export const ALL_LESSONS: LearnLesson[] = Object.values(LESSONS_BY_CATEGORY).flat();
