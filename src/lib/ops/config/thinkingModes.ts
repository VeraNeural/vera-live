// Internal Thinking Modes config (not Activities, not Categories, not rendered)
// Mirrors legacy thinking definitions from src/lib/ops/actions/index.ts

export type ThinkingModeField = {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
};

export type ThinkingMode = {
  id: string;
  title: string;
  description: string;
  icon: string;
  placeholder: string;
  systemPrompt: string;
  fields?: ThinkingModeField[];
};

export const THINKING_MODES: ThinkingMode[] = [
  {
    id: 'pros-cons',
    title: 'Pros & Cons',
    description: 'Structured decision matrix',
    icon: 'pros-cons',
    placeholder: 'What decision? Options?',
    systemPrompt:
      'Create a structured pros/cons analysis. For each option: 1) List 4-6 pros, 2) List 4-6 cons, 3) Rate importance, 4) Provide summary recommendation.',
  },
  {
    id: 'devil-advocate',
    title: "Devil's Advocate",
    description: 'Argue against your idea',
    icon: 'devil',
    placeholder: "What's your idea or plan?",
    systemPrompt:
      "Play devil's advocate. Provide: 1) Strongest arguments against, 2) Potential blind spots, 3) What could go wrong, 4) Questions I haven't considered.",
  },
  {
    id: 'reframe',
    title: 'Reframe This',
    description: 'See it from new angles',
    icon: 'reframe',
    placeholder: 'What situation to reframe?',
    systemPrompt:
      'Help me see this from different perspectives. Provide: 1) Optimistic reframe, 2) Growth opportunity, 3) How a mentor might view this, 4) Long-term perspective, 5) What this might be teaching me.',
  },
  {
    id: 'persona',
    title: 'What Would X Do?',
    description: 'Think like someone else',
    icon: 'persona',
    placeholder: 'Situation? Who to think like?',
    systemPrompt:
      'Analyze this as if I were the person specified. How would they think? What would they prioritize? What action would they take?',
    fields: [
      {
        id: 'situation',
        label: 'Situation',
        type: 'textarea',
        placeholder: "What you're facing...",
        required: true,
      },
      {
        id: 'persona',
        label: 'Who to think like?',
        type: 'text',
        placeholder: 'Elon Musk, your future self, a stoic philosopher...',
        required: true,
      },
    ],
  },
];
