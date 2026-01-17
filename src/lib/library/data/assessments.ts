// ============================================================================
// LIBRARY ROOM - ASSESSMENTS DATA
// ============================================================================

import type { DiscoverAssessment } from '../types';

// Import assessment components
import InnerLandscapeAssessment from '@/components/sanctuary/assessments/InnerLandscapeAssessment';
import RestRestorationAssessment from '@/components/sanctuary/assessments/RestRestorationAssessment';
import StressResponseAssessment from '@/components/sanctuary/assessments/StressResponseAssessment';
import ConnectionStyleAssessment from '@/components/sanctuary/assessments/ConnectionStyleAssessment';
import LifeRhythmAssessment from '@/components/sanctuary/assessments/LifeRhythmAssessment';

export const ASSESSMENTS: DiscoverAssessment[] = [
  {
    id: 'inner-landscape',
    title: 'Inner Landscape',
    subtitle: 'Emotional Patterns',
    duration: '15 min',
    description: 'Explore your emotional world and discover your unique patterns',
    icon: 'inner-landscape',
    Component: InnerLandscapeAssessment,
  },
  {
    id: 'rest-restoration',
    title: 'Rest & Restoration',
    subtitle: 'How You Recharge',
    duration: '12 min',
    description: 'Discover your ideal rest practices and restoration needs',
    icon: 'rest-restoration',
    Component: RestRestorationAssessment,
  },
  {
    id: 'stress-response',
    title: 'Stress Response',
    subtitle: "Your Body's Patterns",
    duration: '15 min',
    description: 'Understand how your nervous system responds to pressure',
    icon: 'stress-response',
    Component: StressResponseAssessment,
  },
  {
    id: 'connection-style',
    title: 'Connection Style',
    subtitle: 'Relationships & Boundaries',
    duration: '12 min',
    description: 'Explore how you connect and what you need from others',
    icon: 'connection-style',
    Component: ConnectionStyleAssessment,
  },
  {
    id: 'life-rhythm',
    title: 'Life Rhythm',
    subtitle: 'Energy & Natural Cycles',
    duration: '10 min',
    description: 'Discover your natural energy patterns and optimal rhythms',
    icon: 'life-rhythm',
    Component: LifeRhythmAssessment,
  },
];
