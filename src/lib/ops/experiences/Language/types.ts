export type Language = {
  code: string;
  name: string;
  flag: string;
};

export type Phrase = {
  original: string;
  translated: string;
  pronunciation?: string;
  audioUrl?: string;
};

export type LessonLevel = 'beginner' | 'intermediate' | 'advanced';

export type Lesson = {
  id: string;
  title: string;
  phrases: Phrase[];
  level: LessonLevel;
};

export type UserProgress = {
  lessonId: string;
  completed: boolean;
  score?: number;
};

export type LanguageRegionId =
  | 'european'
  | 'asian'
  | 'middleEasternSouthAsian'
  | 'balkan'
  | 'easternEuropean';

export type LanguageRegion = {
  id: LanguageRegionId;
  title: string;
  languages: Language[];
};

export type VocabEntry = {
  id: string;
  from: string;
  to: string;
  original: string;
  translated: string;
  pronunciation?: string;
  createdAt: string;
};
