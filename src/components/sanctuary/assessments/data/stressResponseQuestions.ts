import { Question } from '../shared/types';

export const STRESS_RESPONSE_QUESTIONS: Question[] = [
  {
    id: 'activation_1',
    text: 'What is your baseline state most days?',
    subtext: 'Before anything stressful happens',
    options: [
      { value: 1, label: 'Already activated', description: 'Tense, alert, on edge' },
      { value: 2, label: 'Slightly elevated', description: 'A background hum of stress' },
      { value: 3, label: 'Mostly calm', description: 'Generally settled' },
      { value: 4, label: 'Relaxed', description: 'At ease, grounded' },
    ],
    category: 'activation',
  },
  {
    id: 'activation_2',
    text: 'How quickly does your body react to stress?',
    options: [
      { value: 1, label: 'Instant', description: '0 to 100 immediately' },
      { value: 2, label: 'Fast', description: 'Within seconds' },
      { value: 3, label: 'Moderate', description: 'Builds over minutes' },
      { value: 4, label: 'Gradual', description: 'Slow to activate' },
    ],
    category: 'activation',
  },
  {
    id: 'activation_3',
    text: 'When stressed, what happens in your body?',
    subtext: 'Choose the most prominent',
    options: [
      { value: 1, label: 'Racing heart & rapid breathing', description: 'Panic-like symptoms' },
      { value: 2, label: 'Muscle tension', description: 'Clenched jaw, tight shoulders' },
      { value: 3, label: 'Stomach issues', description: 'Nausea, appetite changes' },
      { value: 4, label: 'Fatigue & heaviness', description: 'Wanting to shut down' },
    ],
    category: 'activation',
  },
  {
    id: 'recovery_1',
    text: 'After stress, how long to calm down?',
    options: [
      { value: 1, label: 'Hours or days', description: 'I stay activated a long time' },
      { value: 2, label: 'An hour or more', description: 'Takes significant time' },
      { value: 3, label: '15-30 minutes', description: 'Moderate recovery' },
      { value: 4, label: 'Minutes', description: 'I settle quickly' },
    ],
    category: 'recovery',
  },
  {
    id: 'recovery_2',
    text: 'How well can you sleep after a stressful day?',
    options: [
      { value: 1, label: 'Very poorly', description: 'Mind races for hours' },
      { value: 2, label: 'With difficulty', description: 'Takes a long time' },
      { value: 3, label: 'Usually okay', description: 'Some delay but manageable' },
      { value: 4, label: 'Well', description: 'I can let go' },
    ],
    category: 'recovery',
  },
  {
    id: 'recovery_3',
    text: 'When the stressor is removed, your body:',
    options: [
      { value: 1, label: 'Stays tense', description: 'Like waiting for the next threat' },
      { value: 2, label: 'Slowly unwinds', description: 'Holds residual tension' },
      { value: 3, label: 'Gradually relaxes', description: 'Over time' },
      { value: 4, label: 'Releases quickly', description: 'Returns to baseline' },
    ],
    category: 'recovery',
  },
  {
    id: 'triggers_1',
    text: 'How well do you know your stress triggers?',
    options: [
      { value: 1, label: 'Not well', description: 'Stress seems random' },
      { value: 2, label: 'Somewhat', description: 'I know the obvious ones' },
      { value: 3, label: 'Pretty well', description: 'I can anticipate most' },
      { value: 4, label: 'Very well', description: 'I have a clear map' },
    ],
    category: 'triggers',
  },
  {
    id: 'triggers_2',
    text: 'How early do you notice stress building?',
    options: [
      { value: 1, label: 'Only when overwhelmed', description: 'Too late to intervene' },
      { value: 2, label: 'When it\'s strong', description: 'Mid-activation' },
      { value: 3, label: 'Fairly early', description: 'With some buildup' },
      { value: 4, label: 'At the first signs', description: 'Very attuned' },
    ],
    category: 'triggers',
  },
  {
    id: 'coping_1',
    text: 'How many strategies do you have for stress?',
    options: [
      { value: 1, label: 'Very few', description: 'I mostly just endure' },
      { value: 2, label: 'A couple', description: 'One or two go-tos' },
      { value: 3, label: 'Several', description: 'A decent toolkit' },
      { value: 4, label: 'Many', description: 'A full range of options' },
    ],
    category: 'coping',
  },
  {
    id: 'coping_2',
    text: 'When your usual coping methods don\'t work:',
    options: [
      { value: 1, label: 'Feel stuck', description: 'Don\'t know what else to try' },
      { value: 2, label: 'Push harder', description: 'Do more of the same' },
      { value: 3, label: 'Eventually adapt', description: 'Try something different' },
      { value: 4, label: 'Flexibly adjust', description: 'Have backup strategies' },
    ],
    category: 'coping',
  },
  {
    id: 'window_1',
    text: 'How much stress before feeling overwhelmed?',
    options: [
      { value: 1, label: 'Very little', description: 'Low threshold' },
      { value: 2, label: 'Moderate amount', description: 'Average capacity' },
      { value: 3, label: 'Quite a bit', description: 'Good tolerance' },
      { value: 4, label: 'A lot', description: 'High capacity' },
    ],
    category: 'window',
  },
  {
    id: 'window_2',
    text: 'How often do you feel emotionally dysregulated?',
    subtext: 'Overwhelmed, numb, or out of control',
    options: [
      { value: 1, label: 'Daily', description: 'It\'s my normal state' },
      { value: 2, label: 'Several times a week', description: 'Quite frequently' },
      { value: 3, label: 'Weekly or less', description: 'Occasionally' },
      { value: 4, label: 'Rarely', description: 'I usually stay regulated' },
    ],
    category: 'window',
  },
];
