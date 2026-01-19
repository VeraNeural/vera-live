import type { Platform, Post } from '../types';

export type AdapterInput = {
  platform: Platform;
  post: Post;
  metadata?: {
    hashtags?: string[];
    links?: string[];
    mediaRefs?: string[];
  };
};

export type AdapterResult = {
  success: boolean;
  externalId?: string;
  error?: string;
};

export interface PlatformAdapter {
  postToPlatform(input: AdapterInput): Promise<AdapterResult>;
}
