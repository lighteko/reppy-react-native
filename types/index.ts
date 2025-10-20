// User Types
export interface UserProfile {
  userId: string;
  username: string;
  goal: string | null;
  experienceLevel: string | null;
  unitSystem: 'CM_KG' | 'IN_LB';
  locale: string;
  availableEquipment: Equipment[];
}

export interface Equipment {
  equipmentId: string;
  equipmentCode: string;
  equipmentName: string;
  equipmentType?: string;
}

export interface UserPreferences {
  unitSystem: 'CM_KG' | 'IN_LB';
  locale: string;
}

// Program Types
export interface Program {
  programId: string;
  programName: string;
  goal: string | null;
  routines: Routine[];
}

export interface Routine {
  routineId: string;
  routineName: string;
  routineOrder: number;
}

// Routine Detail Types
export interface RoutineDetail {
  routineId: string;
  routineName: string;
  plans: ExercisePlan[];
}

export interface ExercisePlan {
  planId: string;
  exerciseName: string;
  execOrder: number;
  sets: PlannedSet[];
}

export interface PlannedSet {
  setId: string;
  setOrder: number;
  setTypeName: string;
  reps: number | null;
  weight: number | null;
  restTime: number;
  duration: number | null;
  distance: number | null;
}

// Workout Session Types
export interface WorkoutSession {
  sessionId: string;
  routineId: string;
  startTime: string;
  endTime?: string;
  currentExerciseIndex: number;
  exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
  planId: string;
  exerciseName: string;
  execOrder: number;
  sets: WorkoutSet[];
}

export interface WorkoutSet {
  setId: string;
  setOrder: number;
  setTypeName: string;
  plannedReps: number | null;
  plannedWeight: number | null;
  actualReps?: number | null;
  actualWeight?: number | null;
  restTime: number;
  duration?: number | null;
  distance?: number | null;
  isCompleted: boolean;
}

export interface LogSetPayload {
  setId: string;
  actualReps?: number | null;
  actualWeight?: number | null;
  duration?: number | null;
  distance?: number | null;
}

// Chat Types
export interface ChatMessage {
  messageId: string;
  senderType: 'USER' | 'REPPY';
  content: string;
  createdAt: string;
  suggestedQuestions?: string[];
}

export interface SendMessagePayload {
  content: string;
  context?: Record<string, any>;
}

// Stats Types
export interface SessionHistory {
  sessionId: string;
  startTime: string;
  endTime: string;
  routineName?: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  username: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Onboarding Types
export interface OnboardingData {
  goal?: string;
  experienceLevel?: string;
  weight?: number;
  height?: number;
  age?: number;
  availableEquipment?: string[];
}

