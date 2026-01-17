// ============================================================================
// OPS ROOM TYPE DEFINITIONS
// ============================================================================

export interface OpsRoomProps {
  onBack: () => void;
}

export type Category = 
  | 'communication' 
  | 'work' 
  | 'life' 
  | 'content' 
  | 'thinking' 
  | 'health' 
  | 'money' 
  | 'learning' 
  | 'relationships' 
  | 'creativity' 
  | 'planning';

export type AIProvider = 'claude' | 'gpt4' | 'grok';

export type GenerationMode = 
  | 'single' 
  | 'specialist' 
  | 'consensus' 
  | 'review-chain' 
  | 'compare';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export type ThemeMode = 'light' | 'dark' | 'auto';

export type ActionItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  placeholder: string;
  systemPrompt: string;
  fields?: {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'select';
    placeholder?: string;
    options?: { value: string; label: string }[];
    required?: boolean;
  }[];
};
