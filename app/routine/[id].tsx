import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, LoadingSpinner } from '@/components/common';
import { ExerciseCard } from '@/components/workout';
import { programService } from '@/services';
import { RoutineDetail } from '@/types';
import { ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function RoutineDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [routine, setRoutine] = useState<RoutineDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadRoutine();
    }
  }, [id]);

  const loadRoutine = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const details = await programService.getRoutineDetails(id);
      setRoutine(details);
    } catch (error) {
      console.error('Error loading routine:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartWorkout = () => {
    if (id) {
      router.push(`/workout/${id}`);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <LoadingSpinner fullScreen message="Loading routine..." />
      </SafeAreaView>
    );
  }

  if (!routine) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-xl font-bold text-neutral-900 mb-2">
            Routine Not Found
          </Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-6 py-4 border-b border-neutral-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#212529" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-neutral-900">
          {routine.routineName}
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="px-6 py-6">
          <View className="mb-6">
            <Text className="text-neutral-600 mb-4">
              {routine.plans.length} exercises in this routine
            </Text>
            <Button
              title="Start This Workout"
              onPress={handleStartWorkout}
              size="lg"
              fullWidth
            />
          </View>

          <Text className="text-xl font-bold text-neutral-900 mb-4">
            Exercises
          </Text>

          {routine.plans
            .sort((a, b) => a.execOrder - b.execOrder)
            .map((plan, index) => (
              <Card key={plan.planId} variant="outlined" className="mb-4">
                <View className="mb-3">
                  <Text className="text-sm text-neutral-600 mb-1">
                    Exercise {index + 1}
                  </Text>
                  <Text className="text-lg font-bold text-neutral-900 mb-2">
                    {plan.exerciseName}
                  </Text>
                  {plan.description && (
                    <Text className="text-sm text-neutral-600 mb-3">
                      {plan.description}
                    </Text>
                  )}
                </View>

                <View className="bg-neutral-50 rounded-lg p-3">
                  <Text className="text-sm font-semibold text-neutral-700 mb-2">
                    Sets ({plan.sets.length})
                  </Text>
                  {plan.sets.map((set, setIndex) => (
                    <View
                      key={set.setId}
                      className="flex-row justify-between py-2 border-b border-neutral-200 last:border-b-0"
                    >
                      <Text className="text-neutral-700">
                        Set {setIndex + 1} {set.setTypeName && `(${set.setTypeName})`}
                      </Text>
                      <Text className="text-neutral-900 font-medium">
                        {set.reps ? `${set.reps} reps` : ''}
                        {set.weight ? ` × ${set.weight}kg` : ''}
                        {set.duration ? ` ${set.duration}s` : ''}
                      </Text>
                    </View>
                  ))}
                </View>

                {plan.memo && (
                  <View className="mt-3 bg-primary-50 rounded-lg p-3">
                    <Text className="text-sm text-primary-700">{plan.memo}</Text>
                  </View>
                )}
              </Card>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
