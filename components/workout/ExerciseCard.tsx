import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../common';
import { Dumbbell } from 'lucide-react-native';

interface ExerciseCardProps {
  exerciseName: string;
  setCount: number;
  onPress: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exerciseName,
  setCount,
  onPress,
}) => {
  return (
    <Card onPress={onPress} variant="outlined" className="mb-3">
      <View className="flex-row items-center">
        <View className="w-12 h-12 rounded-full bg-primary-100 items-center justify-center mr-3">
          <Dumbbell size={24} color="#0073e6" />
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-neutral-900 text-base mb-1">
            {exerciseName}
          </Text>
          <Text className="text-sm text-neutral-600">
            {setCount} {setCount === 1 ? 'set' : 'sets'}
          </Text>
        </View>
      </View>
    </Card>
  );
};
