import apiClient from './api';
import { EquipmentListItem, UserEquipment } from '@/types';

export const equipmentService = {
  async getEquipmentList(locale?: string): Promise<EquipmentListItem[]> {
    const params = locale ? { locale } : {};
    return apiClient.get<EquipmentListItem[]>('/equipment', { params });
  },

  async getUserEquipment(userId: string): Promise<UserEquipment[]> {
    return apiClient.get<UserEquipment[]>(`/users/${userId}/equipment`);
  },

  async updateUserEquipment(userId: string, equipmentIds: string[]): Promise<UserEquipment[]> {
    return apiClient.put<UserEquipment[]>(`/users/${userId}/equipment`, { equipmentIds });
  },

  async addUserEquipment(userId: string, equipmentId: string): Promise<UserEquipment> {
    return apiClient.post<UserEquipment>(`/users/${userId}/equipment`, { equipmentId });
  },

  async removeUserEquipment(userId: string, equipmentId: string): Promise<void> {
    return apiClient.delete<void>(`/users/${userId}/equipment/${equipmentId}`);
  },
};
