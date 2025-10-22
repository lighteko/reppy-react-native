import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';
import { ExerciseSet, SetRecord } from '@/types';
import { formatSetInfo } from '@/utils';

interface SetRowProps {
  set: ExerciseSet;
  setNumber: number;
  record?: SetRecord;
  onLog: (actualReps?: number, actualWeight?: number) => void;
}

export const SetRow: React.FC<SetRowProps> = ({ set, setNumber, record, onLog }) => {
  const isCompleted = !!record;

  return (
    <View className="flex-row items-center justify-between py-3 px-4 bg-neutral-50 rounded-lg mb-2">
      <View className="flex-1">
        <Text className="font-semibold text-neutral-900 mb-1">
          Set {setNumber} {set.setTypeName && `(${set.setTypeName})`}
        </Text>
        <Text className="text-sm text-neutral-600">
          {formatSetInfo(set.reps, set.weight, set.duration, set.distance)}
        </Text>
        {isCompleted && (
          <Text className="text-xs text-success mt-1">
            Completed: {formatSetInfo(record.actualReps, record.actualWeight)}
          </Text>
        )}
      </View>
      <TouchableOpacity
        onPress={() => !isCompleted && onLog(set.reps, set.weight)}
        className={`
          w-10 h-10 rounded-full items-center justify-center
          ${isCompleted ? 'bg-success' : 'bg-primary-500'}
        `}
        disabled={isCompleted}
      >
        {isCompleted && <Check size={20} color="#ffffff" />}
        {!isCompleted && <Text className="text-white font-bold">+</Text>}
      </TouchableOpacity>
    </View>
  );
};
