import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button, LoadingSpinner } from '@/components/common';
import { ExerciseCard } from '@/components/workout';
import { useProgramStore, useUserStore } from '@/store';
import { programService } from '@/services';
import { Dumbbell, Calendar } from 'lucide-react-native';

export default function HomeScreen() {
  const { profile, isAuthenticated } = useUserStore();
  const { program, getNextRoutine, setProgram, setLoading, isLoading } = useProgramStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
      return;
    }

    if (!profile?.userId) return;

    loadProgram();
  }, [isAuthenticated, profile?.userId]);

  const loadProgram = async () => {
    if (!profile?.userId) return;

    try {
      setLoading(true);
      const activeProgram = await programService.getActiveProgram(profile.userId);
      if (activeProgram) {
        setProgram(activeProgram);
      } else {
        router.replace('/onboarding');
      }
    } catch (error) {
      console.error('Error loading program:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProgram();
    setRefreshing(false);
  };

  const handleStartNextWorkout = async () => {
    const nextRoutine = getNextRoutine();
    if (nextRoutine) {
      router.push(`/routine/${nextRoutine.routineId}`);
    }
  };

  const handleRoutinePress = (routineId: string) => {
    router.push(`/routine/${routineId}`);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <LoadingSpinner fullScreen message="Loading your program..." />
      </SafeAreaView>
    );
  }

  if (!program) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center px-6">
          <Dumbbell size={64} color="#adb5bd" />
          <Text className="text-xl font-bold text-neutral-900 mt-4 mb-2">
            No Program Found
          </Text>
          <Text className="text-neutral-600 text-center mb-6">
            Let's create your personalized workout program
          </Text>
          <Button
            title="Get Started"
            onPress={() => router.push('/onboarding')}
          />
        </View>
      </SafeAreaView>
    );
  }

  const nextRoutine = getNextRoutine();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View className="px-6 py-6">
          <Text className="text-3xl font-bold text-neutral-900 mb-2">
            Welcome back!
          </Text>
          <Text className="text-lg text-neutral-600 mb-6">
            {profile?.username || 'Athlete'}
          </Text>

          <Card variant="elevated" className="mb-6 bg-primary-500">
            <View className="mb-3">
              <Text className="text-white text-sm font-medium mb-1">
                CURRENT PROGRAM
              </Text>
              <Text className="text-white text-2xl font-bold">
                {program.programName}
              </Text>
            </View>
            {program.goal && (
              <Text className="text-white/80 mb-4">Goal: {program.goal}</Text>
            )}
            {nextRoutine && (
              <>
                <View className="flex-row items-center mb-3">
                  <Calendar size={16} color="#ffffff" />
                  <Text className="text-white font-semibold ml-2">
                    Next Workout
                  </Text>
                </View>
                <Text className="text-white text-lg font-bold mb-4">
                  {nextRoutine.routineName}
                </Text>
                <Button
                  title="Start Workout"
                  onPress={handleStartNextWorkout}
                  variant="secondary"
                  fullWidth
                />
              </>
            )}
          </Card>

          <View className="mb-4">
            <Text className="text-xl font-bold text-neutral-900 mb-3">
              All Routines
            </Text>
            {program.routines
              .sort((a, b) => a.routineOrder - b.routineOrder)
              .map((routine) => (
                <Card
                  key={routine.routineId}
                  variant="outlined"
                  className="mb-3"
                  onPress={() => handleRoutinePress(routine.routineId)}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-sm text-neutral-600 mb-1">
                        Day {routine.routineOrder}
                      </Text>
                      <Text className="text-lg font-bold text-neutral-900">
                        {routine.routineName}
                      </Text>
                    </View>
                    <View className="w-8 h-8 rounded-full bg-primary-100 items-center justify-center">
                      <Text className="text-primary-500 font-bold">
                        {routine.routineOrder}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
