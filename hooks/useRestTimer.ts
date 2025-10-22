import { useEffect } from 'react';
import { useWorkoutStore } from '@/store';

export const useRestTimer = () => {
  const { activeWorkout, startRestTimer, stopRestTimer, tickRestTimer } = useWorkoutStore();

  const restTimer = activeWorkout?.restTimer;

  useEffect(() => {
    if (!restTimer?.isActive) return;

    const interval = setInterval(() => {
      tickRestTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [restTimer?.isActive, tickRestTimer]);

  const start = (setId: string, duration: number) => {
    startRestTimer(setId, duration);
  };

  const stop = () => {
    stopRestTimer();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = restTimer?.totalTime
    ? ((restTimer.totalTime - restTimer.remainingTime) / restTimer.totalTime) * 100
    : 0;

  return {
    isActive: restTimer?.isActive || false,
    remainingTime: restTimer?.remainingTime || 0,
    totalTime: restTimer?.totalTime || 0,
    formattedTime: formatTime(restTimer?.remainingTime || 0),
    progress,
    start,
    stop,
  };
};
