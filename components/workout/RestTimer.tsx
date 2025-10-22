import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { X, Play } from 'lucide-react-native';
import { Card } from '../common';

interface RestTimerProps {
  isActive: boolean;
  remainingTime: number;
  formattedTime: string;
  progress: number;
  onStop: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  isActive,
  remainingTime,
  formattedTime,
  progress,
  onStop,
}) => {
  if (!isActive) return null;

  return (
    <Card variant="elevated" className="mb-4 bg-primary-50">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 rounded-full bg-primary-500 items-center justify-center mr-3">
            <Play size={20} color="#ffffff" />
          </View>
          <View className="flex-1">
            <Text className="text-sm text-neutral-600 mb-1">Rest Timer</Text>
            <Text className="text-2xl font-bold text-primary-500">{formattedTime}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={onStop}
          className="w-10 h-10 rounded-full bg-neutral-200 items-center justify-center"
        >
          <X size={20} color="#495057" />
        </TouchableOpacity>
      </View>
      <View className="mt-3 h-2 bg-neutral-200 rounded-full overflow-hidden">
        <View
          className="h-full bg-primary-500"
          style={{ width: `${progress}%` }}
        />
      </View>
    </Card>
  );
};
