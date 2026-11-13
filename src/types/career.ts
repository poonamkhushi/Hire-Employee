export type ApplicationStage = 'submitted' | 'interview' | 'offer' | 'archived';

export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';

export type NavTab = 'applications' | 'coach' | 'offers' | 'schedule';

export type PromptCategory = 'Behavioral' | 'Product Sense' | 'System Design' | 'Executive';

export interface InterviewRoundLog {
  id: string;
  roundTitle: string;
  dateLabel: string;
  timeLabel: string;
  interviewer: string;
  durationMinutes: number;
  outcome: 'Upcoming' | 'Advanced' | 'Completed';
  notes: string;
}

export interface OfferCompensation {
  baseSalary: number;
  annualEquity: number;
  signOnBonus: number;
  targetBonusPct: number;
  ptoDays: number;
  learningStipend: number;
  deadlineLabel: string;
  isPreferred?: boolean;
  isSigned?: boolean;
}

export interface JobApplication {
  id: string;
  company: string;
  initials: string;
  brandHue: string;
  role: string;
  payBand: number;
  payLabel: string;
  location: string;
  workMode: WorkMode;
  stage: ApplicationStage;
  appliedDate: string;
  nextEventLabel: string;
  nextEventTime: string;
  notes: string;
  interviewLogs: InterviewRoundLog[];
  offer?: OfferCompensation;
}

export interface CoachPrompt {
  id: string;
  category: PromptCategory;
  question: string;
  contextHint: string;
  targetDurationSec: number;
  rubricLabels: [string, string, string, string];
}

export interface CoachTake {
  id: string;
  promptId: string;
  question: string;
  category: PromptCategory;
  recordedAt: string;
  durationSec: number;
  confidenceScore: number;
  completedChecks: [boolean, boolean, boolean, boolean];
  notes: string;
  waveformBars: number[];
  audioUrl?: string;
}
