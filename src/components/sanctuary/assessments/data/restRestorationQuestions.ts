import { Question } from '../shared/types';

export const REST_RESTORATION_QUESTIONS: Question[] = [
  // Physical Rest (4 questions)
  {
    id: 'physical_1',
    text: 'How does your body typically feel at the end of a normal day?',
    type: 'scale',
    options: [
      { value: 1, label: 'Exhausted', description: 'Completely drained physically' },
      { value: 2, label: 'Tired', description: 'Noticeably fatigued' },
      { value: 3, label: 'Moderately tired', description: 'Ready to wind down' },
      { value: 4, label: 'Still energized', description: 'Could keep going' },
    ],
    category: 'physical',
  },
  {
    id: 'physical_2',
    text: 'How would you rate the quality of your sleep most nights?',
    type: 'slider',
    category: 'physical',
    min: 1,
    max: 10,
    minLabel: 'Poor — restless, broken',
    maxLabel: 'Excellent — deep, restorative',
  },
  {
    id: 'physical_3',
    text: 'How often do you wake up feeling truly rested?',
    type: 'scale',
    options: [
      { value: 1, label: 'Rarely', description: 'Almost never feel rested' },
      { value: 2, label: 'Sometimes', description: 'Maybe once a week' },
      { value: 3, label: 'Often', description: 'Most mornings' },
      { value: 4, label: 'Usually', description: 'I generally wake refreshed' },
    ],
    category: 'physical',
  },
  {
    id: 'physical_4',
    text: 'How much does physical tension affect your daily life?',
    subtext: 'Shoulders, jaw, back',
    type: 'slider',
    category: 'physical',
    min: 1,
    max: 10,
    minLabel: 'Constantly tense',
    maxLabel: 'Rarely notice tension',
  },

  // Mental Rest (4 questions)
  {
    id: 'mental_1',
    text: 'How often does your mind feel "full" or overwhelmed?',
    type: 'scale',
    options: [
      { value: 1, label: 'Constantly', description: 'My mind never stops' },
      { value: 2, label: 'Frequently', description: 'Most of the time' },
      { value: 3, label: 'Sometimes', description: 'During busy periods' },
      { value: 4, label: 'Rarely', description: 'I can usually find mental quiet' },
    ],
    category: 'mental',
  },
  {
    id: 'mental_2',
    text: 'How difficult is it for you to "switch off" from responsibilities?',
    type: 'slider',
    category: 'mental',
    min: 1,
    max: 10,
    minLabel: 'Very difficult',
    maxLabel: 'I can disconnect easily',
  },
  {
    id: 'mental_3',
    text: 'When you have free time, your mind typically:',
    type: 'choice',
    options: [
      { value: 1, label: 'Races with to-do lists and worries' },
      { value: 2, label: 'Drifts to problems and planning' },
      { value: 3, label: 'Gradually settles after a while' },
      { value: 4, label: 'Relaxes into the present moment' },
    ],
    category: 'mental',
  },
  {
    id: 'mental_4',
    text: 'How often do you experience mental fatigue or "brain fog"?',
    type: 'scale',
    options: [
      { value: 1, label: 'Daily', description: 'It\'s a constant companion' },
      { value: 2, label: 'Several times a week', description: 'More often than I\'d like' },
      { value: 3, label: 'Occasionally', description: 'After intense periods' },
      { value: 4, label: 'Rarely', description: 'My mind usually feels clear' },
    ],
    category: 'mental',
  },

  // Emotional Rest (4 questions)
  {
    id: 'emotional_1',
    text: 'How much of your day involves managing others\' emotions?',
    type: 'slider',
    category: 'emotional',
    min: 1,
    max: 10,
    minLabel: 'Almost all of it',
    maxLabel: 'Very little',
  },
  {
    id: 'emotional_2',
    text: 'How often can you be completely yourself, without performing?',
    type: 'scale',
    options: [
      { value: 1, label: 'Rarely', description: 'I\'m always "on"' },
      { value: 2, label: 'Sometimes', description: 'With certain people' },
      { value: 3, label: 'Often', description: 'In most situations' },
      { value: 4, label: 'Usually', description: 'I feel authentic most of the time' },
    ],
    category: 'emotional',
  },
  {
    id: 'emotional_3',
    text: 'How drained do you feel after social or emotional interactions?',
    type: 'choice',
    options: [
      { value: 1, label: 'Completely depleted — need major recovery' },
      { value: 2, label: 'Noticeably tired — need quiet time after' },
      { value: 3, label: 'Mildly tired — brief rest helps' },
      { value: 4, label: 'Energized or neutral — depends on the interaction' },
    ],
    category: 'emotional',
  },
  {
    id: 'emotional_4',
    text: 'Do you have spaces where you can truly let your guard down?',
    type: 'scale',
    options: [
      { value: 1, label: 'Not really', description: 'I\'m always somewhat guarded' },
      { value: 2, label: 'One or two', description: 'Limited safe spaces' },
      { value: 3, label: 'Several', description: 'A good support network' },
      { value: 4, label: 'Many', description: 'I feel safe in most close relationships' },
    ],
    category: 'emotional',
  },

  // Social Rest (3 questions)
  {
    id: 'social_1',
    text: 'After a day of social interaction, you typically need:',
    type: 'choice',
    options: [
      { value: 4, label: 'Extended alone time — hours or even a full day' },
      { value: 3, label: 'Significant quiet — an evening to yourself' },
      { value: 2, label: 'Some space — an hour or two' },
      { value: 1, label: 'Not much — I recharge around others' },
    ],
    category: 'social',
  },
  {
    id: 'social_2',
    text: 'How often do you feel "peopled out" or socially depleted?',
    type: 'scale',
    options: [
      { value: 4, label: 'Very often', description: 'Most days' },
      { value: 3, label: 'Frequently', description: 'Several times a week' },
      { value: 2, label: 'Sometimes', description: 'After big social events' },
      { value: 1, label: 'Rarely', description: 'Social time energizes me' },
    ],
    category: 'social',
  },
  {
    id: 'social_3',
    text: 'Your ideal weekend involves:',
    type: 'choice',
    options: [
      { value: 4, label: 'Mostly solitude with minimal obligations' },
      { value: 3, label: 'Quiet time with one or two close people' },
      { value: 2, label: 'A mix of social plans and downtime' },
      { value: 1, label: 'Lots of activities and connection with others' },
    ],
    category: 'social',
  },

  // Sensory Rest (3 questions)
  {
    id: 'sensory_1',
    text: 'How overwhelmed do you feel by sensory input?',
    subtext: 'Noise, screens, lights, crowds',
    type: 'slider',
    category: 'sensory',
    min: 1,
    max: 10,
    minLabel: 'Very overwhelmed',
    maxLabel: 'Rarely bothered',
  },
  {
    id: 'sensory_2',
    text: 'How much of your day involves screens?',
    type: 'scale',
    options: [
      { value: 1, label: 'Almost all of it', description: '10+ hours' },
      { value: 2, label: 'Most of it', description: '6-10 hours' },
      { value: 3, label: 'A moderate amount', description: '3-6 hours' },
      { value: 4, label: 'Limited', description: 'Under 3 hours' },
    ],
    category: 'sensory',
  },
  {
    id: 'sensory_3',
    text: 'How often do you intentionally reduce sensory input?',
    subtext: 'Silence, darkness, nature',
    type: 'scale',
    options: [
      { value: 1, label: 'Rarely', description: 'Almost never' },
      { value: 2, label: 'Sometimes', description: 'When I remember' },
      { value: 3, label: 'Regularly', description: 'Part of my routine' },
      { value: 4, label: 'Daily', description: 'I prioritize sensory rest' },
    ],
    category: 'sensory',
  },

  // Creative Rest (3 questions)
  {
    id: 'creative_1',
    text: 'How often do you experience a sense of wonder or awe?',
    type: 'scale',
    options: [
      { value: 1, label: 'Rarely', description: 'Life feels routine' },
      { value: 2, label: 'Sometimes', description: 'Occasionally something moves me' },
      { value: 3, label: 'Often', description: 'I notice beauty regularly' },
      { value: 4, label: 'Frequently', description: 'Wonder is part of my life' },
    ],
    category: 'creative',
  },
  {
    id: 'creative_2',
    text: 'How much time do you spend with things that inspire you?',
    subtext: 'Nature, art, music, ideas',
    type: 'slider',
    category: 'creative',
    min: 1,
    max: 10,
    minLabel: 'Very little',
    maxLabel: 'Abundant time',
  },
  {
    id: 'creative_3',
    text: 'Your creative energy and inspiration currently feels:',
    type: 'choice',
    options: [
      { value: 1, label: 'Depleted — I feel creatively dry' },
      { value: 2, label: 'Low — sparks are rare' },
      { value: 3, label: 'Moderate — comes and goes' },
      { value: 4, label: 'Alive — I feel inspired regularly' },
    ],
    category: 'creative',
  },
];
