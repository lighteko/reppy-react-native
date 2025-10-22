import { create } from 'zustand';
import { UserProfile, UserEquipment, UnitSystemEnum } from '@/types';
import { saveToStorage, getFromStorage, removeFromStorage, STORAGE_KEYS } from '@/utils';

interface UserState {
  isAuthenticated: boolean;
  authToken: string | null;
  profile: UserProfile | null;
  isLoading: boolean;

  setAuth: (token: string, userId: string) => Promise<void>;
  clearAuth: () => Promise<void>;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updatePreferences: (unitSystem?: UnitSystemEnum, locale?: string, notifReminder?: boolean) => void;
  setEquipment: (equipment: UserEquipment[]) => void;
  addEquipment: (equipment: UserEquipment) => void;
  removeEquipment: (equipmentId: string) => void;
  loadPersistedAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  isAuthenticated: false,
  authToken: null,
  profile: null,
  isLoading: true,

  setAuth: async (token: string, userId: string) => {
    await saveToStorage(STORAGE_KEYS.AUTH_TOKEN, token);
    await saveToStorage(STORAGE_KEYS.USER_ID, userId);
    set({ isAuthenticated: true, authToken: token });
  },

  clearAuth: async () => {
    await removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);
    await removeFromStorage(STORAGE_KEYS.USER_ID);
    set({ isAuthenticated: false, authToken: null, profile: null });
  },

  setProfile: (profile: UserProfile) => {
    set({ profile });
  },

  updateProfile: (updates: Partial<UserProfile>) => {
    const currentProfile = get().profile;
    if (currentProfile) {
      set({ profile: { ...currentProfile, ...updates } });
    }
  },

  updatePreferences: (unitSystem?: UnitSystemEnum, locale?: string, notifReminder?: boolean) => {
    const currentProfile = get().profile;
    if (currentProfile) {
      set({
        profile: {
          ...currentProfile,
          ...(unitSystem && { unitSystem }),
          ...(locale && { locale }),
        },
      });
    }
  },

  setEquipment: (equipment: UserEquipment[]) => {
    const currentProfile = get().profile;
    if (currentProfile) {
      set({
        profile: {
          ...currentProfile,
          availableEquipment: equipment,
        },
      });
    }
  },

  addEquipment: (equipment: UserEquipment) => {
    const currentProfile = get().profile;
    if (currentProfile) {
      set({
        profile: {
          ...currentProfile,
          availableEquipment: [...currentProfile.availableEquipment, equipment],
        },
      });
    }
  },

  removeEquipment: (equipmentId: string) => {
    const currentProfile = get().profile;
    if (currentProfile) {
      set({
        profile: {
          ...currentProfile,
          availableEquipment: currentProfile.availableEquipment.filter(
            (e) => e.equipmentId !== equipmentId
          ),
        },
      });
    }
  },

  loadPersistedAuth: async () => {
    try {
      const token = await getFromStorage<string>(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        set({ isAuthenticated: true, authToken: token });
      }
    } catch (error) {
      console.error('Error loading persisted auth:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
