import apiClient from './api';
import {
  WorkoutSession,
  SetRecord,
  StartWorkoutRequest,
  LogSetRequest,
  FinishWorkoutRequest,
  SessionHistory,
} from '@/types';

export const workoutService = {
  async startWorkoutSession(data: StartWorkoutRequest): Promise<WorkoutSession> {
    return apiClient.post<WorkoutSession>('/workouts/sessions', data);
  },

  async getWorkoutSession(sessionId: string): Promise<WorkoutSession> {
    return apiClient.get<WorkoutSession>(`/workouts/sessions/${sessionId}`);
  },

  async logSetPerformance(data: LogSetRequest): Promise<SetRecord> {
    return apiClient.post<SetRecord>(`/workouts/sessions/${data.sessionId}/sets`, {
      setId: data.setId,
      actualReps: data.actualReps,
      actualWeight: data.actualWeight,
      actualDuration: data.actualDuration,
      actualDistance: data.actualDistance,
    });
  },

  async finishWorkoutSession(data: FinishWorkoutRequest): Promise<WorkoutSession> {
    return apiClient.put<WorkoutSession>(`/workouts/sessions/${data.sessionId}/finish`, {
      feedbackSentiment: data.feedbackSentiment,
      feedbackText: data.feedbackText,
    });
  },

  async getSessionHistory(
    userId: string,
    startDate?: string,
    endDate?: string
  ): Promise<SessionHistory[]> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return apiClient.get<SessionHistory[]>(`/users/${userId}/workouts/history`, { params });
  },

  async getSessionDetails(sessionId: string): Promise<WorkoutSession & { sets: SetRecord[] }> {
    return apiClient.get<WorkoutSession & { sets: SetRecord[] }>(
      `/workouts/sessions/${sessionId}/details`
    );
  },
};
