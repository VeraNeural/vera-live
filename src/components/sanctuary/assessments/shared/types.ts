export interface AssessmentProps {
  onBack: () => void;
  onComplete?: (results: AssessmentResults) => void;
}

export interface AssessmentResults {
  attachmentSecurity: number;
  boundaryClarity: number;
  intimacyComfort: number;
  independenceNeed: number;
  conflictStyle: number;
  insights: string[];
  recommendations: string[];
  [key: string]: number | string | string[];
}

export type Category = 'attachment' | 'boundaries' | 'intimacy' | 'independence' | 'conflict';

export interface Question {
  id: string;
  text: string;
  subtext?: string;
  type?: 'scale' | 'choice' | 'slider';
  options?: { value: number; label: string; description?: string }[];
  category: Category;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}