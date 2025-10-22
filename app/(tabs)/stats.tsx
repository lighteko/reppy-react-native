import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, LoadingSpinner } from '@/components/common';
import { useUserStore } from '@/store';
import { workoutService } from '@/services';
import { SessionHistory } from '@/types';
import { formatWorkoutDate, calculateStreak } from '@/utils';
import { Calendar, TrendingUp, Award } from 'lucide-react-native';
import { startOfMonth, endOfMonth, format, isSameDay } from 'date-fns';

export default function StatsScreen() {
  const { profile } = useUserStore();
  const [sessions, setSessions] = useState<SessionHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.userId) {
      loadStats();
    }
  }, [profile?.userId]);

  const loadStats = async () => {
    if (!profile?.userId) return;

    try {
      setLoading(true);
      const startDate = startOfMonth(new Date()).toISOString().split('T')[0];
      const endDate = endOfMonth(new Date()).toISOString().split('T')[0];

      const history = await workoutService.getSessionHistory(
        profile.userId,
        startDate,
        endDate
      );
      setSessions(history);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <LoadingSpinner fullScreen message="Loading stats..." />
      </SafeAreaView>
    );
  }

  const totalWorkouts = sessions.length;
  const sessionDates = sessions.map((s) => s.startTime.split('T')[0]);
  const currentStreak = calculateStreak(sessionDates);

  const getDayWorkouts = (date: Date) => {
    return sessions.filter((s) =>
      isSameDay(new Date(s.startTime), date)
    ).length;
  };

  const renderCalendar = () => {
    const today = new Date();
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();
    const firstDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    ).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} className="w-10 h-10 m-1" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(today.getFullYear(), today.getMonth(), day);
      const workoutCount = getDayWorkouts(date);
      const hasWorkout = workoutCount > 0;
      const isToday = isSameDay(date, today);

      days.push(
        <View
          key={day}
          className={`
            w-10 h-10 m-1 rounded-lg items-center justify-center
            ${hasWorkout ? 'bg-success' : 'bg-neutral-100'}
            ${isToday ? 'border-2 border-primary-500' : ''}
          `}
        >
          <Text
            className={`text-sm font-medium ${
              hasWorkout ? 'text-white' : 'text-neutral-700'
            }`}
          >
            {day}
          </Text>
        </View>
      );
    }

    return days;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 border-b border-neutral-200">
        <Text className="text-2xl font-bold text-neutral-900">Your Progress</Text>
        <Text className="text-sm text-neutral-600 mt-1">
          Track your fitness journey
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="px-6 py-6">
          <View className="flex-row gap-3 mb-6">
            <Card variant="elevated" className="flex-1 bg-primary-50">
              <View className="items-center">
                <TrendingUp size={24} color="#0073e6" />
                <Text className="text-2xl font-bold text-neutral-900 mt-2">
                  {totalWorkouts}
                </Text>
                <Text className="text-sm text-neutral-600">
                  This Month
                </Text>
              </View>
            </Card>

            <Card variant="elevated" className="flex-1 bg-secondary-50">
              <View className="items-center">
                <Award size={24} color="#00e673" />
                <Text className="text-2xl font-bold text-neutral-900 mt-2">
                  {currentStreak}
                </Text>
                <Text className="text-sm text-neutral-600">
                  Day Streak
                </Text>
              </View>
            </Card>
          </View>

          <Card variant="elevated" className="mb-6">
            <View className="flex-row items-center mb-4">
              <Calendar size={20} color="#212529" />
              <Text className="text-lg font-bold text-neutral-900 ml-2">
                {format(new Date(), 'MMMM yyyy')}
              </Text>
            </View>

            <View className="flex-row flex-wrap">
              <Text className="w-10 h-10 m-1 text-center text-xs text-neutral-600 leading-10">
                S
              </Text>
              <Text className="w-10 h-10 m-1 text-center text-xs text-neutral-600 leading-10">
                M
              </Text>
              <Text className="w-10 h-10 m-1 text-center text-xs text-neutral-600 leading-10">
                T
              </Text>
              <Text className="w-10 h-10 m-1 text-center text-xs text-neutral-600 leading-10">
                W
              </Text>
              <Text className="w-10 h-10 m-1 text-center text-xs text-neutral-600 leading-10">
                T
              </Text>
              <Text className="w-10 h-10 m-1 text-center text-xs text-neutral-600 leading-10">
                F
              </Text>
              <Text className="w-10 h-10 m-1 text-center text-xs text-neutral-600 leading-10">
                S
              </Text>
              {renderCalendar()}
            </View>

            <View className="flex-row items-center justify-center mt-4 gap-4">
              <View className="flex-row items-center">
                <View className="w-4 h-4 rounded bg-success mr-2" />
                <Text className="text-xs text-neutral-600">Workout day</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-4 h-4 rounded bg-neutral-100 mr-2" />
                <Text className="text-xs text-neutral-600">Rest day</Text>
              </View>
            </View>
          </Card>

          <Text className="text-lg font-bold text-neutral-900 mb-3">
            Recent Workouts
          </Text>

          {sessions.length === 0 ? (
            <Card variant="outlined">
              <Text className="text-neutral-600 text-center py-4">
                No workouts this month yet. Let's get started!
              </Text>
            </Card>
          ) : (
            sessions.slice(0, 10).map((session) => (
              <Card key={session.sessionId} variant="outlined" className="mb-3">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="font-semibold text-neutral-900 mb-1">
                      {session.routineName}
                    </Text>
                    <Text className="text-sm text-neutral-600">
                      {formatWorkoutDate(session.startTime)}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-sm text-neutral-600">
                      {session.totalExercises} exercises
                    </Text>
                    <Text className="text-sm text-neutral-600">
                      {session.totalSets} sets
                    </Text>
                  </View>
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
