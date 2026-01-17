// ============================================================================
// LIBRARY ROOM - STORIES DATA
// ============================================================================

import type { Story, CategoryItem } from '../types';

export const STORY_CATEGORIES: CategoryItem[] = [
  { 
    id: 'rest-sleep', 
    label: 'Rest & Sleep', 
    icon: 'rest-sleep'
  },
  { 
    id: 'guided-journeys', 
    label: 'Guided Journeys', 
    icon: 'guided-journeys'
  },
  { 
    id: 'meditative-tales', 
    label: 'Meditative Tales', 
    icon: 'meditative-tales'
  },
  { 
    id: 'rise-ready', 
    label: 'Rise & Ready', 
    icon: 'rise-ready'
  },
];

export const STORIES: Story[] = [
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
