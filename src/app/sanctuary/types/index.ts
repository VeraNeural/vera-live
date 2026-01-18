export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export type ThemeMode = 'light' | 'dark' | 'auto';
export type ConsentStatus = 'unknown' | 'pending' | 'granted' | 'denied';

export type Room = {
  id: string;
  name: string;
  shortName: string;
  essence: string;
  icon: React.ReactNode;
};

export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isConsentPrompt?: boolean;
  isSignupPrompt?: boolean;
  isUpgradePrompt?: boolean;
};

export type QuickPrompt = {
  text: string;
  category: 'emotional' | 'practical' | 'explore';
};
