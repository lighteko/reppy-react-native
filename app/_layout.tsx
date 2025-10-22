import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useUserStore, useWorkoutStore } from '@/store';
import { LoadingSpinner } from '@/components/common';
import { View } from 'react-native';

export default function RootLayout() {
  useFrameworkReady();

  const { isLoading, loadPersistedAuth } = useUserStore();
  const { loadPersistedWorkout } = useWorkoutStore();

  useEffect(() => {
    const initialize = async () => {
      await loadPersistedAuth();
      await loadPersistedWorkout();
    };
    initialize();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1">
        <LoadingSpinner fullScreen message="Loading Reppy..." />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="routine/[id]" />
        <Stack.Screen name="workout/[sessionId]" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
