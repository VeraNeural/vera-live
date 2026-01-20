// Types extracted from OpsRoom.tsx

export const SPACES = ['space1', 'space2', 'space3'] as const; // Define SPACES constant

export type Space = (typeof SPACES)[number];

export type SavedOutput = {
  id: string;
  space: Space;
  timestamp: string;
  activityId: string;
  text: string;
};

export type FocusMode = 'think' | 'decide' | 'do' | 'create' | 'reflect';
export type AccessTier = 'anonymous' | 'free' | 'forge' | 'sanctuary';