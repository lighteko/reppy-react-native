import { ExperienceEnum } from './enums';

export interface Program {
  programId: string;
  userId: string;
  programName: string;
  experience: ExperienceEnum;
  startDate?: string;
  goalDate?: string;
  goal?: string;
  createdAt: string;
  routines: Routine[];
}

export interface Routine {
  routineId: string;
  userId: string;
  routineName: string;
  routineOrder: number;
  createdAt: string;
}

export interface RoutineVersion {
  routineVersionId: string;
  routineId: string;
  userId: string;
  isActive: boolean;
  memo?: string;
  createdAt: string;
}

export interface SetType {
  setTypeId: string;
  setTypeCode: string;
  createdAt: string;
}

export interface SetTypeI18n {
  setTypeI18nId: string;
  locale: string;
  setTypeId: string;
  setTypeName: string;
  description: string;
  createdAt: string;
}

export interface ExercisePlan {
  planId: string;
  routineVersionId: string;
  exerciseId: string;
  exerciseName: string;
  execOrder: number;
  memo?: string;
  description: string;
  createdAt: string;
  sets: ExerciseSet[];
}

export interface ExerciseSet {
  setId: string;
  planId: string;
  setTypeId: string;
  setTypeName: string;
  setOrder: number;
  reps?: number;
  weight?: number;
  restTime: number;
  duration?: number;
  distance?: number;
  createdAt: string;
}

export interface RoutineDetail {
  routineId: string;
  routineName: string;
  plans: ExercisePlan[];
}

export interface ProgramGenerationRequest {
  goal?: string;
  experienceLevel: ExperienceEnum;
  programName: string;
  startDate: string;
  goalDate?: string;
  additionalInfo?: string;
  availableEquipmentIds: string[];
}
