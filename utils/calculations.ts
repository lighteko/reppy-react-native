export const calculateEstimated1RM = (weight: number, reps: number): number => {
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
};

export const calculateTotalVolume = (sets: Array<{ reps?: number; weight?: number }>): number => {
  return sets.reduce((total, set) => {
    if (set.reps && set.weight) {
      return total + (set.reps * set.weight);
    }
    return total;
  }, 0);
};

export const calculateWorkoutDuration = (startTime: string, endTime?: string): number => {
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime).getTime() : Date.now();
  return Math.floor((end - start) / 1000);
};

export const calculatePercentageComplete = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const calculateStreak = (dates: string[]): number => {
  if (dates.length === 0) return 0;

  const sortedDates = dates
    .map(d => new Date(d).setHours(0, 0, 0, 0))
    .sort((a, b) => b - a);

  let streak = 1;
  const today = new Date().setHours(0, 0, 0, 0);

  if (sortedDates[0] !== today) {
    return 0;
  }

  for (let i = 1; i < sortedDates.length; i++) {
    const diff = (sortedDates[i - 1] - sortedDates[i]) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};
