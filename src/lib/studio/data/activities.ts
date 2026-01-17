// ============================================================================
// STUDIO ROOM ACTIVITIES DATA
// ============================================================================

import type { Activity, CategoryItem } from '../types';

/**
 * Activity categories with metadata
 */
export const ACTIVITY_CATEGORIES: CategoryItem[] = [
  { id: 'art', title: 'Art & Drawing', description: 'Express through visual creation', count: 4 },
  { id: 'craft', title: 'Mindful Crafts', description: 'Hands-on calming activities', count: 3 },
  { id: 'build', title: 'Build & Create', description: 'Construct something meaningful', count: 3 },
  { id: 'express', title: 'Free Expression', description: 'Unstructured creative space', count: 2 },
];

/**
 * All creative activities available in the Studio Room
 * Total: 12 activities across 4 categories
 */
export const ACTIVITIES: Activity[] = [
  // Art & Drawing (4 activities)
  { 
    id: 'emotion-colors', 
    title: 'Emotion Color Map', 
    description: 'Paint your feelings using colors that resonate', 
    duration: '15-30 min', 
    category: 'art', 
    hasExperience: true 
  },
  { 
    id: 'zentangle', 
    title: 'Zentangle Patterns', 
    description: 'Meditative drawing through repetitive patterns', 
    duration: '20 min', 
    category: 'art', 
    hasExperience: true 
  },
  { 
    id: 'mandala', 
    title: 'Mandala Creation', 
    description: 'Design symmetrical patterns for focus', 
    duration: '25 min', 
    category: 'art', 
    hasExperience: true 
  },
  { 
    id: 'sketch-feelings', 
    title: 'Sketch Your Day', 
    description: 'Simple drawings to process experiences', 
    duration: '10 min', 
    category: 'art', 
    hasExperience: true 
  },
  
  // Mindful Crafts (3 activities)
  { 
    id: 'paper-folding', 
    title: 'Paper Folding', 
    description: 'Origami and paper crafts for presence', 
    duration: '15 min', 
    category: 'craft', 
    hasExperience: true 
  },
  { 
    id: 'worry-stones', 
    title: 'Worry Stone Design', 
    description: 'Create a tactile comfort object', 
    duration: '20 min', 
    category: 'craft', 
    hasExperience: true 
  },
  { 
    id: 'gratitude-jar', 
    title: 'Gratitude Jar', 
    description: 'Craft a container for positive moments', 
    duration: '25 min', 
    category: 'craft', 
    hasExperience: true 
  },
  
  // Build & Create (3 activities)
  { 
    id: 'safe-space', 
    title: 'Design Safe Space', 
    description: 'Visualize and plan your ideal sanctuary', 
    duration: '20 min', 
    category: 'build', 
    hasExperience: true 
  },
  { 
    id: 'vision-board', 
    title: 'Digital Vision Board', 
    description: 'Collect images that inspire calm', 
    duration: '30 min', 
    category: 'build', 
    hasExperience: true 
  },
  { 
    id: 'comfort-kit', 
    title: 'Comfort Kit Builder', 
    description: 'Plan your personal wellness toolkit', 
    duration: '15 min', 
    category: 'build', 
    hasExperience: true 
  },
  
  // Free Expression (2 activities)
  { 
    id: 'blank-canvas', 
    title: 'Blank Canvas', 
    description: 'Open space to create without guidance', 
    duration: 'Unlimited', 
    category: 'express', 
    hasExperience: true 
  },
  { 
    id: 'stream-create', 
    title: 'Stream of Creation', 
    description: 'Let your hands move freely', 
    duration: 'Unlimited', 
    category: 'express', 
    hasExperience: true 
  },
];
