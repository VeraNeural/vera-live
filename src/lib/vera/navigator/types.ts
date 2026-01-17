export type Intent = {
  action: string;
  target: string;
  context?: string;
  confidence: number;
};

export type Command = {
  id: string;
  phrases: string[];
  route: {
    room: string;
    view?: string;
  };
  voiceResponse: string;
};

export type NavigationResult = {
  navigateTo?: {
    room: string;
    view?: string;
  };
  executeAction?: () => void;
  voiceResponse: string;
  shouldSpeak: boolean;
};

export type VERAContext = {
  currentRoom: string;
  userMessage: string;
};
