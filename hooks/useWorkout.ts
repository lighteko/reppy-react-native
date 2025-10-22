import { useState } from 'react';
import { useWorkoutStore } from '@/store';
import { workoutService, programService } from '@/services';
import { LogSetRequest, FinishWorkoutRequest, SentimentEnum } from '@/types';
import { parseApiError, getUserFriendlyMessage } from '@/utils';

export const useWorkout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    activeWorkout,
    startWorkout: startWorkoutStore,
    finishWorkout: finishWorkoutStore,
    logSet: logSetStore,
    nextExercise,
    previousExercise,
    getCurrentExercise,
    getSetRecord,
  } = useWorkoutStore();

  const startWorkout = async (routineId: string) => {
    try {
      setLoading(true);
      setError(null);

      const routineDetails = await programService.getRoutineDetails(routineId);
      const session = await workoutService.startWorkoutSession({ routineId });

      await startWorkoutStore(
        session.sessionId,
        session.routineVersionId,
        routineDetails.routineName,
        routineDetails.plans
      );

      return session.sessionId;
    } catch (err: any) {
      const apiError = parseApiError(err);
      setError(getUserFriendlyMessage(apiError));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logSet = async (setId: string, actualReps?: number, actualWeight?: number) => {
    if (!activeWorkout) return false;

    try {
      setError(null);

      const logRequest: LogSetRequest = {
        sessionId: activeWorkout.sessionId,
        setId,
        actualReps,
        actualWeight,
      };

      const record = await workoutService.logSetPerformance(logRequest);
      logSetStore(setId, record);

      return true;
    } catch (err: any) {
      const apiError = parseApiError(err);
      setError(getUserFriendlyMessage(apiError));
      return false;
    }
  };

  const finishWorkout = async (sentiment?: SentimentEnum, feedbackText?: string) => {
    if (!activeWorkout) return false;

    try {
      setLoading(true);
      setError(null);

      const finishRequest: FinishWorkoutRequest = {
        sessionId: activeWorkout.sessionId,
        feedbackSentiment: sentiment,
        feedbackText,
      };

      await workoutService.finishWorkoutSession(finishRequest);
      await finishWorkoutStore();

      return true;
    } catch (err: any) {
      const apiError = parseApiError(err);
      setError(getUserFriendlyMessage(apiError));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const currentExercise = getCurrentExercise();
  const isFirstExercise = activeWorkout?.currentExerciseIndex === 0;
  const isLastExercise =
    activeWorkout?.currentExerciseIndex === (activeWorkout?.exercises.length || 0) - 1;

  return {
    activeWorkout,
    currentExercise,
    isFirstExercise,
    isLastExercise,
    startWorkout,
    logSet,
    finishWorkout,
    nextExercise,
    previousExercise,
    getSetRecord,
    loading,
    error,
  };
};
