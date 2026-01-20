import { type Space } from '../constants/opsRoom.constants';

export type SavedOutput = {
  id: string;
  space: Space;
  timestamp: string;
  activityId: string;
  text: string;
};

export type FocusMode = 'think' | 'decide' | 'do' | 'create' | 'reflect';
export type AccessTier = 'anonymous' | 'free' | 'forge' | 'sanctuary';
