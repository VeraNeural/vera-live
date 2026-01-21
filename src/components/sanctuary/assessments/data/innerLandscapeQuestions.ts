import { Question } from '../shared/types';

export const INNER_LANDSCAPE_QUESTIONS: Question[] = [
  // Emotional Awareness
  {
    id: 'awareness_1',
    text: 'When you wake up, how often do you notice your emotional state?',
    subtext: 'Before checking your phone or starting your day',
    type: 'scale',
    options: [
      { value: 1, label: 'Rarely', description: 'I usually start on autopilot' },
      { value: 2, label: 'Sometimes', description: 'I notice it once I get going' },
      { value: 3, label: 'Often', description: 'I check in most mornings' },
      { value: 4, label: 'Almost always', description: 'I notice it quickly and clearly' },
    ],
    category: 'awareness',
  },

  // Emotional Depth
  {
    id: 'depth_1',
    text: 'How often do you experience complex, layered emotions?',
    subtext: 'For example: feeling happy and sad simultaneously',
    type: 'scale',
    options: [
      { value: 1, label: 'Rarely', description: 'My emotions are usually simple' },
      { value: 2, label: 'Sometimes', description: 'In significant moments' },
      { value: 3, label: 'Often', description: 'I notice layers frequently' },
      { value: 4, label: 'Regularly', description: 'Most emotions have depth' },
    ],
    category: 'depth',
  },
  {
    id: 'depth_2',
    text: 'How deeply do you allow yourself to feel positive emotions?',
    subtext: 'Joy, love, awe, gratitude',
    type: 'slider',
    category: 'depth',
    min: 1,
    max: 10,
    minLabel: 'I keep them contained',
    maxLabel: 'I let them fill me completely',
  },
  {
    id: 'depth_3',
    text: 'When you encounter beauty — in nature, art, music, or connection — you:',
    type: 'choice',
    options: [
      { value: 1, label: "Notice it intellectually but don't feel much" },
      { value: 2, label: 'Feel a mild pleasant response' },
      { value: 3, label: 'Feel genuinely moved' },
      { value: 4, label: 'Can be brought to tears or profound feeling' },
    ],
    category: 'depth',
  },
  {
    id: 'depth_4',
    text: 'How connected do you feel to the emotional experiences of others?',
    subtext: 'Their joys, sorrows, fears, and hopes',
    type: 'slider',
    category: 'depth',
    min: 1,
    max: 10,
    minLabel: 'Somewhat distant',
    maxLabel: 'Deeply connected',
  },
  {
    id: 'depth_5',
    text: 'Your emotional life feels:',
    type: 'choice',
    options: [
      { value: 1, label: 'Flat — not much variation or intensity' },
      { value: 2, label: 'Moderate — some ups and downs' },
      { value: 3, label: 'Rich — a full range of experiences' },
      { value: 4, label: 'Vivid — deeply felt and colorful' },
    ],
    category: 'depth',
  },

  // Emotional Resilience
  {
    id: 'resilience_1',
    text: 'After a significant disappointment or loss, you typically:',
    type: 'choice',
    options: [
      { value: 1, label: 'Struggle for a long time to move forward' },
      { value: 2, label: 'Eventually adapt, but it takes significant effort' },
      { value: 3, label: 'Process it and gradually find your footing' },
      { value: 4, label: 'Feel the pain fully, then integrate and grow' },
    ],
    category: 'resilience',
  },
  {
    id: 'resilience_2',
    text: 'How much do difficult emotions interfere with your daily functioning?',
    type: 'slider',
    category: 'resilience',
    min: 1,
    max: 10,
    minLabel: 'They often derail me',
    maxLabel: 'I function well even when struggling',
  },
  {
    id: 'resilience_3',
    text: 'When facing emotional pain, you tend to:',
    type: 'choice',
    options: [
      { value: 1, label: 'Avoid it as much as possible' },
      { value: 2, label: 'Acknowledge it reluctantly' },
      { value: 3, label: 'Face it when necessary' },
      { value: 4, label: 'Welcome it as part of being fully alive' },
    ],
    category: 'resilience',
  },
  {
    id: 'resilience_4',
    text: 'How confident are you in your ability to handle whatever emotions arise?',
    type: 'slider',
    category: 'resilience',
    min: 1,
    max: 10,
    minLabel: 'Not confident',
    maxLabel: 'Very confident',
  },
  {
    id: 'resilience_5',
    text: 'Looking back on difficult emotional experiences in your life:',
    type: 'scale',
    options: [
      { value: 1, label: 'They still weigh heavily on me' },
      { value: 2, label: "I've survived but carry scars" },
      { value: 3, label: "I've healed and learned from them" },
      { value: 4, label: "They've become sources of wisdom and strength" },
    ],
    category: 'resilience',
  },
];
