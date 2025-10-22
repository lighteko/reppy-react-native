import { useEffect } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';
import { LoadingSpinner } from '@/components/common';
import { useUserStore } from '@/store';

export default function IndexScreen() {
  const { isAuthenticated, profile } = useUserStore();

  useEffect(() => {
    if (isAuthenticated && profile) {
      router.replace('/(tabs)/home');
    } else {
      router.replace('/auth');
    }
  }, [isAuthenticated, profile]);

  return (
    <View className="flex-1">
      <LoadingSpinner fullScreen />
    </View>
  );
}
