import apiClient from './api';
import { UserProfile, UserBio, UserPreferences } from '@/types';

export const userService = {
  async getUserProfile(userId: string): Promise<UserProfile> {
    return apiClient.get<UserProfile>(`/users/${userId}/profile`);
  },

  async updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    return apiClient.put<UserProfile>(`/users/${userId}/profile`, data);
  },

  async getUserBio(userId: string): Promise<UserBio> {
    return apiClient.get<UserBio>(`/users/${userId}/bio`);
  },

  async updateUserBio(userId: string, data: Partial<UserBio>): Promise<UserBio> {
    return apiClient.put<UserBio>(`/users/${userId}/bio`, data);
  },

  async getUserPreferences(userId: string): Promise<UserPreferences> {
    return apiClient.get<UserPreferences>(`/users/${userId}/preferences`);
  },

  async updateUserPreferences(
    userId: string,
    data: Partial<UserPreferences>
  ): Promise<UserPreferences> {
    return apiClient.put<UserPreferences>(`/users/${userId}/preferences`, data);
  },
};
