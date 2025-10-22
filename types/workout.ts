import { SentimentEnum } from './enums';
import { ExercisePlan } from './program';

export interface WorkoutSession {
  sessionId: string;
  userId: string;
  routineVersionId: string;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export interface SetRecord {
  recordId: string;
  sessionId: string;
  setId: string;
  actualReps?: number;
  actualWeight?: number;
  actualRestTime?: number;
  actualDuration?: number;
  actualDistance?: number;
  createdAt: string;
}

export interface Feedback {
  feedbackId: string;
  userId: string;
  sessionId: string;
  sentiment: SentimentEnum;
  feedbackText?: string;
  createdAt: string;
}

export interface ActiveWorkout {
  sessionId: string;
  routineVersionId: string;
  routineName: string;
  startTime: string;
  currentExerciseIndex: number;
  exercises: ExercisePlan[];
  loggedSets: Record<string, SetRecord>;
  restTimer: {
    isActive: boolean;
    setId?: string;
    remainingTime: number;
    totalTime: number;
  };
}

export interface LogSetRequest {
  sessionId: string;
  setId: string;
  actualReps?: number;
  actualWeight?: number;
  actualDuration?: number;
  actualDistance?: number;
}

export interface StartWorkoutRequest {
  routineId: string;
}

export interface FinishWorkoutRequest {
  sessionId: string;
  feedbackSentiment?: SentimentEnum;
  feedbackText?: string;
}

export interface SessionHistory {
  sessionId: string;
  routineName: string;
  startTime: string;
  endTime: string;
  totalSets: number;
  totalExercises: number;
}
