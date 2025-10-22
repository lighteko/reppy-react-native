import { create } from 'zustand';
import { Program, Routine } from '@/types';

interface ProgramState {
  program: Program | null;
  isLoading: boolean;
  lastCompletedRoutineOrder: number | null;

  setProgram: (program: Program) => void;
  clearProgram: () => void;
  updateRoutine: (routineId: string, updates: Partial<Routine>) => void;
  setLastCompletedRoutine: (routineOrder: number) => void;
  getNextRoutine: () => Routine | null;
  setLoading: (loading: boolean) => void;
}

export const useProgramStore = create<ProgramState>((set, get) => ({
  program: null,
  isLoading: false,
  lastCompletedRoutineOrder: null,

  setProgram: (program: Program) => {
    set({ program });
  },

  clearProgram: () => {
    set({ program: null, lastCompletedRoutineOrder: null });
  },

  updateRoutine: (routineId: string, updates: Partial<Routine>) => {
    const currentProgram = get().program;
    if (currentProgram) {
      const updatedRoutines = currentProgram.routines.map((routine) =>
        routine.routineId === routineId ? { ...routine, ...updates } : routine
      );
      set({
        program: {
          ...currentProgram,
          routines: updatedRoutines,
        },
      });
    }
  },

  setLastCompletedRoutine: (routineOrder: number) => {
    set({ lastCompletedRoutineOrder: routineOrder });
  },

  getNextRoutine: () => {
    const { program, lastCompletedRoutineOrder } = get();
    if (!program || !program.routines.length) return null;

    const sortedRoutines = [...program.routines].sort(
      (a, b) => a.routineOrder - b.routineOrder
    );

    if (lastCompletedRoutineOrder === null) {
      return sortedRoutines[0];
    }

    const nextRoutineIndex = sortedRoutines.findIndex(
      (r) => r.routineOrder > lastCompletedRoutineOrder
    );

    if (nextRoutineIndex === -1) {
      return sortedRoutines[0];
    }

    return sortedRoutines[nextRoutineIndex];
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
