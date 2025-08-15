export interface Question {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  category: string;
  weight: number;
  maxPoints: number;
  options: {
    value: string;
    label: string;
    description: string;
    points?: number;
  }[];
  maxSelections?: number;
}

export interface Answer {
  questionId: string;
  value: number;
  category: string;
}

export interface SubmissionData {
  email: string;
  consent: boolean;
  answers: Answer[];
}

export interface ScoringResult {
  score: number;
  tier: 'NOT_READY' | 'GETTING_STARTED' | 'AI_ENHANCED';
  painPoints: string[];
  recommendations: string[];
  categoryScores: Record<string, number>;
}

export interface EmailReport {
  subject: string;
  html: string;
  text: string;
}
