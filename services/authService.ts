import apiClient from './api';
import { AuthResponse, LoginRequest, SignupRequest } from '@/types';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  async signup(data: SignupRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/signup', data);
  },

  async logout(): Promise<void> {
    return apiClient.post<void>('/auth/logout');
  },

  async refreshToken(): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/refresh');
  },

  async verifyToken(): Promise<{ valid: boolean }> {
    return apiClient.get<{ valid: boolean }>('/auth/verify');
  },
};
