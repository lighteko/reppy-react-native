import { format, formatDistanceToNow, formatDuration, intervalToDuration } from 'date-fns';

export const formatRelativeTime = (dateString: string): string => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};

export const formatWorkoutDate = (dateString: string): string => {
  return format(new Date(dateString), 'MMM d, yyyy');
};

export const formatWorkoutDateTime = (dateString: string): string => {
  return format(new Date(dateString), 'MMM d, yyyy h:mm a');
};

export const calculateDuration = (startTime: string, endTime: string): string => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const duration = intervalToDuration({ start, end });

  return formatDuration(duration, {
    format: ['hours', 'minutes'],
    zero: false,
  });
};

export const formatRestTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  return remainingSeconds > 0
    ? `${minutes}m ${remainingSeconds}s`
    : `${minutes}m`;
};

export const formatSetInfo = (
  reps?: number,
  weight?: number,
  duration?: number,
  distance?: number
): string => {
  const parts: string[] = [];

  if (reps) parts.push(`${reps} reps`);
  if (weight) parts.push(`${weight} kg`);
  if (duration) parts.push(formatRestTime(duration));
  if (distance) parts.push(`${distance}m`);

  return parts.join(' × ');
};

export const formatExerciseName = (name: string): string => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatNumber = (num: number, decimals: number = 1): string => {
  return num.toFixed(decimals);
};
