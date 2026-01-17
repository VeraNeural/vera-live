import type { BreathingPattern, GroundStep, OrientPrompt, Practice, PracticeId, ShakePhase } from '../types';

export const PRACTICES: Practice[] = [
  { id: 'breathe', name: 'Breathe', icon: '○', description: 'Calm your nervous system' },
  { id: 'orient', name: 'Orient', icon: '◎', description: 'Find safety in your space' },
  { id: 'shake', name: 'Shake', icon: '∿', description: 'Release stored tension' },
  { id: 'ground', name: 'Ground', icon: '▽', description: '5-4-3-2-1 senses' },
];

export const BREATHING_PATTERNS: Array<{ id: string } & BreathingPattern> = [
  {
    id: 'coherent',
    name: 'Coherent',
    description: 'Balance & calm',
    phases: [
      { name: 'Breathe in', duration: 5 },
      { name: 'Breathe out', duration: 5 },
    ],
  },
  {
    id: '478',
    name: '4-7-8',
    description: 'Deep relaxation',
    phases: [
      { name: 'Breathe in', duration: 4 },
      { name: 'Hold', duration: 7 },
      { name: 'Breathe out', duration: 8 },
    ],
  },
  {
    id: 'box',
    name: 'Box',
    description: 'Focus & calm',
    phases: [
      { name: 'Breathe in', duration: 4 },
      { name: 'Hold', duration: 4 },
      { name: 'Breathe out', duration: 4 },
      { name: 'Hold', duration: 4 },
    ],
  },
  {
    id: 'calming',
    name: 'Calming',
    description: 'Quick reset',
    phases: [
      { name: 'Breathe in', duration: 4 },
      { name: 'Breathe out', duration: 6 },
    ],
  },
];

export const ORIENT_PROMPTS: OrientPrompt[] = [
  { instruction: 'Slowly look to your left', duration: 5 },
  { instruction: 'Notice 3 things you see', duration: 6 },
  { instruction: 'Gently turn to your right', duration: 5 },
  { instruction: 'Find something with texture', duration: 6 },
  { instruction: 'Look up slowly', duration: 5 },
  { instruction: 'Notice the colors around you', duration: 6 },
  { instruction: 'Return your gaze to center', duration: 5 },
  { instruction: 'Feel your feet on the ground', duration: 6 },
  { instruction: 'Take in the whole space', duration: 5 },
  { instruction: 'You are safe here', duration: 5 },
];

export const SHAKE_PHASES: ShakePhase[] = [
  { instruction: 'Start with your hands', subtext: 'Let them tremble gently', duration: 15 },
  { instruction: 'Move to your wrists', subtext: 'Loose, easy shaking', duration: 15 },
  { instruction: 'Now your arms', subtext: 'Let them bounce freely', duration: 20 },
  { instruction: 'Add your shoulders', subtext: 'Shake out the tension', duration: 20 },
  { instruction: 'Your whole upper body', subtext: 'Everything loose and free', duration: 20 },
  { instruction: 'Now add your legs', subtext: 'Bounce, shake, release', duration: 25 },
  { instruction: 'Your whole body', subtext: 'Let everything move', duration: 30 },
  { instruction: 'Slowly wind down', subtext: 'Gentler... softer...', duration: 15 },
  { instruction: 'Coming to stillness', subtext: 'Notice how you feel', duration: 10 },
];

export const GROUND_STEPS: GroundStep[] = [
  { sense: 'SEE', instruction: 'Name 5 things you can see', count: 5, duration: 20 },
  { sense: 'TOUCH', instruction: 'Notice 4 things you can feel', count: 4, duration: 16 },
  { sense: 'HEAR', instruction: 'Listen for 3 sounds', count: 3, duration: 15 },
  { sense: 'SMELL', instruction: 'Notice 2 things you can smell', count: 2, duration: 12 },
  { sense: 'TASTE', instruction: 'Observe 1 taste in your mouth', count: 1, duration: 8 },
  { sense: 'PRESENT', instruction: 'You are here. You are safe.', count: 0, duration: 8 },
];

export const DURATION_PRESETS: Record<Extract<PracticeId, 'breathe' | 'shake'>, Array<{ label: string; seconds: number }>> = {
  breathe: [
    { label: '2 min', seconds: 120 },
    { label: '5 min', seconds: 300 },
    { label: '10 min', seconds: 600 },
  ],
  shake: [
    { label: '1 min', seconds: 60 },
    { label: '3 min', seconds: 180 },
    { label: '5 min', seconds: 300 },
  ],
};
