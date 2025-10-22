import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  questions,
  onSelect,
}) => {
  if (!questions.length) return null;

  return (
    <View className="px-4 py-2">
      <Text className="text-xs text-neutral-600 mb-2 font-medium">Suggested:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2">
          {questions.map((question, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onSelect(question)}
              className="bg-primary-100 rounded-full px-4 py-2 border border-primary-300"
            >
              <Text className="text-primary-700 text-sm">{question}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
