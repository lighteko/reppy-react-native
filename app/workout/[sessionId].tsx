import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, TextInput, Modal } from '@/components/common';
import { RestTimer } from '@/components/workout';
import { useWorkout, useRestTimer } from '@/hooks';
import { ArrowLeft, ArrowRight, ChevronLeft, Info } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SentimentEnum } from '@/types';

export default function WorkoutSessionScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const {
    activeWorkout,
    currentExercise,
    isFirstExercise,
    isLastExercise,
    startWorkout,
    logSet,
    finishWorkout,
    nextExercise,
    previousExercise,
    getSetRecord,
    loading,
  } = useWorkout();

  const restTimer = useRestTimer();

  const [actualReps, setActualReps] = useState<string>('');
  const [actualWeight, setActualWeight] = useState<string>('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (sessionId && !initialized && !activeWorkout) {
      initializeWorkout();
    }
  }, [sessionId, initialized]);

  const initializeWorkout = async () => {
    if (!sessionId || initialized) return;

    const session = await startWorkout(sessionId);
    if (session) {
      setInitialized(true);
    } else {
      Alert.alert('Error', 'Could not start workout session');
      router.back();
    }
  };

  const handleLogSet = async (setId: string, plannedReps?: number, plannedWeight?: number) => {
    const reps = actualReps ? parseInt(actualReps) : plannedReps;
    const weight = actualWeight ? parseFloat(actualWeight) : plannedWeight;

    const success = await logSet(setId, reps, weight);
    if (success) {
      setActualReps('');
      setActualWeight('');

      const set = currentExercise?.sets.find((s) => s.setId === setId);
      if (set?.restTime) {
        restTimer.start(setId, set.restTime);
      }
    }
  };

  const handleFinishWorkout = () => {
    Alert.alert(
      'Finish Workout',
      'Are you sure you want to finish this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Finish',
          onPress: async () => {
            await finishWorkout();
            router.replace('/(tabs)/home');
          },
        },
      ]
    );
  };

  if (!activeWorkout || !currentExercise) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <Text className="text-neutral-600">Loading workout...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const completedSets = currentExercise.sets.filter((set) =>
    getSetRecord(set.setId)
  ).length;

  const progress = Math.round(
    ((activeWorkout.currentExerciseIndex + 1) / activeWorkout.exercises.length) * 100
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 border-b border-neutral-200">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color="#212529" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-neutral-900">
            {activeWorkout.routineName}
          </Text>
          <TouchableOpacity onPress={() => setShowInstructions(true)}>
            <Info size={24} color="#0073e6" />
          </TouchableOpacity>
        </View>
        <View className="h-2 bg-neutral-200 rounded-full overflow-hidden">
          <View
            className="h-full bg-primary-500"
            style={{ width: `${progress}%` }}
          />
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="px-6 py-6">
          <RestTimer {...restTimer} onStop={restTimer.stop} />

          <Card variant="elevated" className="mb-6">
            <Text className="text-sm text-neutral-600 mb-1">
              Exercise {activeWorkout.currentExerciseIndex + 1} of{' '}
              {activeWorkout.exercises.length}
            </Text>
            <Text className="text-2xl font-bold text-neutral-900 mb-3">
              {currentExercise.exerciseName}
            </Text>
            {currentExercise.description && (
              <Text className="text-neutral-600 mb-3">
                {currentExercise.description}
              </Text>
            )}
            <Text className="text-sm font-semibold text-neutral-700">
              Sets: {completedSets} / {currentExercise.sets.length}
            </Text>
          </Card>

          <View className="mb-4">
            <Text className="text-lg font-bold text-neutral-900 mb-3">
              Log Your Sets
            </Text>

            {currentExercise.sets.map((set, index) => {
              const record = getSetRecord(set.setId);
              const isCompleted = !!record;

              return (
                <Card
                  key={set.setId}
                  variant="outlined"
                  className={`mb-3 ${isCompleted ? 'bg-success/5 border-success' : ''}`}
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="font-semibold text-neutral-900">
                      Set {index + 1}
                      {set.setTypeName && ` (${set.setTypeName})`}
                    </Text>
                    {isCompleted && (
                      <View className="bg-success rounded-full px-3 py-1">
                        <Text className="text-white text-xs font-semibold">
                          DONE
                        </Text>
                      </View>
                    )}
                  </View>

                  <View className="flex-row gap-2 mb-3">
                    <View className="flex-1">
                      <Text className="text-xs text-neutral-600 mb-1">
                        Reps
                      </Text>
                      <TextInput
                        value={isCompleted ? record.actualReps?.toString() || '' : actualReps}
                        onChangeText={setActualReps}
                        placeholder={set.reps?.toString() || '0'}
                        keyboardType="number-pad"
                        editable={!isCompleted}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-neutral-600 mb-1">
                        Weight (kg)
                      </Text>
                      <TextInput
                        value={isCompleted ? record.actualWeight?.toString() || '' : actualWeight}
                        onChangeText={setActualWeight}
                        placeholder={set.weight?.toString() || '0'}
                        keyboardType="decimal-pad"
                        editable={!isCompleted}
                      />
                    </View>
                  </View>

                  {!isCompleted && (
                    <Button
                      title="Log Set"
                      onPress={() => handleLogSet(set.setId, set.reps, set.weight)}
                      variant="primary"
                      size="sm"
                      fullWidth
                    />
                  )}
                </Card>
              );
            })}
          </View>

          <View className="flex-row gap-3 mb-6">
            <Button
              title="Previous"
              onPress={previousExercise}
              variant="outline"
              disabled={isFirstExercise}
              icon={<ArrowLeft size={16} color="#0073e6" />}
            />
            <Button
              title="Next"
              onPress={nextExercise}
              variant="outline"
              disabled={isLastExercise}
              icon={<ArrowRight size={16} color="#0073e6" />}
            />
          </View>

          <Button
            title="Finish Workout"
            onPress={handleFinishWorkout}
            variant="secondary"
            size="lg"
            fullWidth
          />
        </View>
      </ScrollView>

      <Modal
        visible={showInstructions}
        onClose={() => setShowInstructions(false)}
        title="Exercise Instructions"
      >
        <Text className="text-neutral-700 leading-6">
          {currentExercise.description ||
            'Focus on proper form and controlled movements. Rest as needed between sets.'}
        </Text>
      </Modal>
    </SafeAreaView>
  );
}
