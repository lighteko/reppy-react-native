export interface Muscle {
  muscleId: string;
  muscleCode: string;
  createdAt: string;
}

export interface MuscleI18n {
  muscleI18nId: string;
  locale: string;
  muscleId: string;
  muscleName: string;
  createdAt: string;
}

export interface Exercise {
  exerciseId: string;
  mainMuscleId: string;
  auxMuscleId?: string;
  exerciseCode: string;
  isUnilateral: boolean;
  difficultyLevel: number;
  createdAt: string;
}

export interface ExerciseI18n {
  exerciseI18nId: string;
  locale: string;
  exerciseId: string;
  exerciseName: string;
  instruction?: string;
  createdAt: string;
}

export interface ExerciseWithDetails extends Exercise {
  exerciseName: string;
  instruction?: string;
  mainMuscleName: string;
  auxMuscleName?: string;
}

export interface ExercisePerformanceRecord {
  exerciseCode: string;
  exerciseName: string;
  sessionId: string;
  sessionDate: string;
  setRecords: {
    setOrder: number;
    actualReps?: number;
    actualWeight?: number;
    actualDuration?: number;
    actualDistance?: number;
  }[];
}
