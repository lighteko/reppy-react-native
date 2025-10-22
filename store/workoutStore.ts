import { create } from 'zustand';
import { ActiveWorkout, SetRecord, ExercisePlan } from '@/types';
import { saveToStorage, getFromStorage, removeFromStorage, STORAGE_KEYS } from '@/utils';

interface WorkoutState {
  activeWorkout: ActiveWorkout | null;
  isLoading: boolean;

  startWorkout: (
    sessionId: string,
    routineVersionId: string,
    routineName: string,
    exercises: ExercisePlan[]
  ) => Promise<void>;
  finishWorkout: () => Promise<void>;
  logSet: (setId: string, record: SetRecord) => void;
  nextExercise: () => void;
  previousExercise: () => void;
  startRestTimer: (setId: string, duration: number) => void;
  stopRestTimer: () => void;
  tickRestTimer: () => void;
  loadPersistedWorkout: () => Promise<void>;
  getCurrentExercise: () => ExercisePlan | null;
  getSetRecord: (setId: string) => SetRecord | undefined;
  setLoading: (loading: boolean) => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  activeWorkout: null,
  isLoading: false,

  startWorkout: async (
    sessionId: string,
    routineVersionId: string,
    routineName: string,
    exercises: ExercisePlan[]
  ) => {
    const workout: ActiveWorkout = {
      sessionId,
      routineVersionId,
      routineName,
      startTime: new Date().toISOString(),
      currentExerciseIndex: 0,
      exercises,
      loggedSets: {},
      restTimer: {
        isActive: false,
        remainingTime: 0,
        totalTime: 0,
      },
    };

    await saveToStorage(STORAGE_KEYS.ACTIVE_WORKOUT, workout);
    set({ activeWorkout: workout });
  },

  finishWorkout: async () => {
    await removeFromStorage(STORAGE_KEYS.ACTIVE_WORKOUT);
    set({ activeWorkout: null });
  },

  logSet: (setId: string, record: SetRecord) => {
    const currentWorkout = get().activeWorkout;
    if (currentWorkout) {
      const updatedWorkout = {
        ...currentWorkout,
        loggedSets: {
          ...currentWorkout.loggedSets,
          [setId]: record,
        },
      };
      saveToStorage(STORAGE_KEYS.ACTIVE_WORKOUT, updatedWorkout);
      set({ activeWorkout: updatedWorkout });
    }
  },

  nextExercise: () => {
    const currentWorkout = get().activeWorkout;
    if (currentWorkout) {
      const nextIndex = Math.min(
        currentWorkout.currentExerciseIndex + 1,
        currentWorkout.exercises.length - 1
      );
      const updatedWorkout = {
        ...currentWorkout,
        currentExerciseIndex: nextIndex,
      };
      saveToStorage(STORAGE_KEYS.ACTIVE_WORKOUT, updatedWorkout);
      set({ activeWorkout: updatedWorkout });
    }
  },

  previousExercise: () => {
    const currentWorkout = get().activeWorkout;
    if (currentWorkout) {
      const prevIndex = Math.max(currentWorkout.currentExerciseIndex - 1, 0);
      const updatedWorkout = {
        ...currentWorkout,
        currentExerciseIndex: prevIndex,
      };
      saveToStorage(STORAGE_KEYS.ACTIVE_WORKOUT, updatedWorkout);
      set({ activeWorkout: updatedWorkout });
    }
  },

  startRestTimer: (setId: string, duration: number) => {
    const currentWorkout = get().activeWorkout;
    if (currentWorkout) {
      const updatedWorkout = {
        ...currentWorkout,
        restTimer: {
          isActive: true,
          setId,
          remainingTime: duration,
          totalTime: duration,
        },
      };
      set({ activeWorkout: updatedWorkout });
    }
  },

  stopRestTimer: () => {
    const currentWorkout = get().activeWorkout;
    if (currentWorkout) {
      const updatedWorkout = {
        ...currentWorkout,
        restTimer: {
          isActive: false,
          remainingTime: 0,
          totalTime: 0,
        },
      };
      set({ activeWorkout: updatedWorkout });
    }
  },

  tickRestTimer: () => {
    const currentWorkout = get().activeWorkout;
    if (currentWorkout && currentWorkout.restTimer.isActive) {
      const newRemainingTime = Math.max(currentWorkout.restTimer.remainingTime - 1, 0);
      const updatedWorkout = {
        ...currentWorkout,
        restTimer: {
          ...currentWorkout.restTimer,
          remainingTime: newRemainingTime,
          isActive: newRemainingTime > 0,
        },
      };
      set({ activeWorkout: updatedWorkout });
    }
  },

  loadPersistedWorkout: async () => {
    try {
      const workout = await getFromStorage<ActiveWorkout>(STORAGE_KEYS.ACTIVE_WORKOUT);
      if (workout) {
        set({ activeWorkout: workout });
      }
    } catch (error) {
      console.error('Error loading persisted workout:', error);
    }
  },

  getCurrentExercise: () => {
    const { activeWorkout } = get();
    if (!activeWorkout) return null;
    return activeWorkout.exercises[activeWorkout.currentExerciseIndex] || null;
  },

  getSetRecord: (setId: string) => {
    const { activeWorkout } = get();
    return activeWorkout?.loggedSets[setId];
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
