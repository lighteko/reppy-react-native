import { UnitSystemEnum } from '@/types';

export const kgToLbs = (kg: number): number => {
  return kg * 2.20462;
};

export const lbsToKg = (lbs: number): number => {
  return lbs / 2.20462;
};

export const cmToInches = (cm: number): number => {
  return cm / 2.54;
};

export const inchesToCm = (inches: number): number => {
  return inches * 2.54;
};

export const convertWeight = (weight: number, from: UnitSystemEnum, to: UnitSystemEnum): number => {
  if (from === to) return weight;

  if (from === UnitSystemEnum.CM_KG && to === UnitSystemEnum.IN_LB) {
    return kgToLbs(weight);
  }

  return lbsToKg(weight);
};

export const convertHeight = (height: number, from: UnitSystemEnum, to: UnitSystemEnum): number => {
  if (from === to) return height;

  if (from === UnitSystemEnum.CM_KG && to === UnitSystemEnum.IN_LB) {
    return cmToInches(height);
  }

  return inchesToCm(height);
};

export const getWeightUnit = (unitSystem: UnitSystemEnum): string => {
  return unitSystem === UnitSystemEnum.CM_KG ? 'kg' : 'lbs';
};

export const getHeightUnit = (unitSystem: UnitSystemEnum): string => {
  return unitSystem === UnitSystemEnum.CM_KG ? 'cm' : 'in';
};
