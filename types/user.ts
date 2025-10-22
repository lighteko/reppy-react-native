import { SexEnum, UnitSystemEnum } from './enums';

export interface User {
  userId: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface UserBio {
  userId: string;
  sex: SexEnum;
  height?: number;
  bodyWeight?: number;
  birthdate?: string;
  createdAt: string;
}

export interface UserPreferences {
  userId: string;
  unitSystem: UnitSystemEnum;
  notifReminder: boolean;
  locale: string;
  createdAt: string;
}

export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  goal?: string;
  experienceLevel?: string;
  unitSystem: UnitSystemEnum;
  locale: string;
  sex?: SexEnum;
  height?: number;
  bodyWeight?: number;
  birthdate?: string;
  availableEquipment: UserEquipment[];
}

export interface UserEquipment {
  equipmentId: string;
  equipmentCode: string;
  equipmentName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}
