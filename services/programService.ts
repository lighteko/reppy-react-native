import apiClient from './api';
import { Program, RoutineDetail, ProgramGenerationRequest } from '@/types';

export const programService = {
  async generateProgram(data: ProgramGenerationRequest): Promise<{ jobId: string }> {
    return apiClient.post<{ jobId: string }>('/programs/generate', data);
  },

  async checkGenerationStatus(jobId: string): Promise<{ status: string; program?: Program }> {
    return apiClient.get<{ status: string; program?: Program }>(`/programs/generate/${jobId}`);
  },

  async getActiveProgram(userId: string): Promise<Program | null> {
    return apiClient.get<Program | null>(`/users/${userId}/programs/active`);
  },

  async getProgramDetails(programId: string): Promise<Program> {
    return apiClient.get<Program>(`/programs/${programId}`);
  },

  async getRoutineDetails(routineId: string): Promise<RoutineDetail> {
    return apiClient.get<RoutineDetail>(`/routines/${routineId}`);
  },

  async getRoutinesByProgram(programId: string): Promise<RoutineDetail[]> {
    return apiClient.get<RoutineDetail[]>(`/programs/${programId}/routines`);
  },
};
