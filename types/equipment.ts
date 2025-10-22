import { EquipmentTypeEnum } from './enums';

export interface Equipment {
  equipmentId: string;
  equipmentCode: string;
  equipmentType: EquipmentTypeEnum;
  createdAt: string;
}

export interface EquipmentI18n {
  equipmentI18nId: string;
  locale: string;
  equipmentId: string;
  equipmentName: string;
  instruction: string;
  createdAt: string;
}

export interface EquipmentWithI18n extends Equipment {
  equipmentName: string;
  instruction: string;
}

export interface EquipmentListItem {
  equipmentId: string;
  equipmentCode: string;
  equipmentName: string;
  equipmentType: EquipmentTypeEnum;
  instruction: string;
}

export interface UserEquipmentMap {
  userId: string;
  equipmentId: string;
  createdAt: string;
}
