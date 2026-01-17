export type Platform = 'instagram' | 'twitter' | 'tiktok' | 'linkedin';

// Expanded themes per requirements (superset of the original list)
export type ContentTheme =
  | 'sleep'
  | 'anxiety'
  | 'productivity'
  | 'all-in-one'
  | 'navigation'
  | 'ops'
  | 'language'
  | 'cost-savings'
  | 'feature-demo'
  | 'testimonial'
  | 'behind-the-scenes';

export type Performance = {
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  signups: number;
};

export type PostStatus = 'draft' | 'ready' | 'scheduled' | 'posted';

export type Post = {
  id: string;
  platform: Platform;
  theme: ContentTheme;

  // Short punchy opener used in previews; not always shown verbatim on each platform.
  hook: string;

  // Main body (e.g., thread body, TikTok script body, LinkedIn post body)
  content: string;

  // Caption is the platform-ready formatted text (may include hook/value/cta/hashtags).
  caption: string;

  hashtags: string[];
  imagePrompt?: string;
  imageUrl?: string;

  cta: string;

  status: PostStatus;
  scheduledFor: Date;
  postedAt?: Date;

  performance?: Performance;
};

export type DailyPlan = {
  date: Date;
  posts: Post[];
  theme: ContentTheme;
};

export type VERAVoice = {
  tone: 'warm' | 'direct' | 'playful' | 'vulnerable';
  style: 'first-person';
};

export type ChatNudge = {
  kind: 'signup_soft' | 'signup_hard';
  text: string;
};
