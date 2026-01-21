export interface AssessmentProps {
  onBack: () => void;
  onComplete?: (results: AssessmentResults) => void;
}

export interface AssessmentResults {
  insights: string[];
  recommendations: string[];
  [key: string]: number | string | string[];
}

export interface Question {
  id: string;
  text: string;
  subtext?: string;
  type?: 'scale' | 'choice' | 'slider';
  options?: { value: number; label: string; description?: string }[];
  category: string;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}