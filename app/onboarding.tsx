import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageBubble, ChatInput, TypingIndicator } from '@/components/chat';
import { LoadingSpinner } from '@/components/common';
import { ChatMessage, SenderTypeEnum, ExperienceEnum } from '@/types';
import { useUserStore } from '@/store';
import { programService, equipmentService } from '@/services';

export default function OnboardingScreen() {
  const { profile, updateProfile } = useUserStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<any>({});
  const [generating, setGenerating] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const onboardingFlow = [
    {
      question: "Welcome to Reppy! I'm your AI fitness coach. What's your main fitness goal?",
      options: ['Build Muscle', 'Lose Weight', 'Gain Strength', 'Improve Endurance'],
      field: 'goal',
    },
    {
      question: 'Great! What would you say is your experience level with weight training?',
      options: ['Beginner', 'Intermediate', 'Professional'],
      field: 'experienceLevel',
    },
    {
      question: "Now, let's set up your equipment. What equipment do you have access to?",
      field: 'equipment',
      isEquipmentSelection: true,
    },
  ];

  useEffect(() => {
    sendAIMessage(onboardingFlow[0].question);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const sendAIMessage = (content: string) => {
    const aiMessage: ChatMessage = {
      messageId: `ai-${Date.now()}`,
      userId: '',
      senderType: SenderTypeEnum.REPPY,
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, aiMessage]);
  };

  const sendUserMessage = (content: string) => {
    const userMessage: ChatMessage = {
      messageId: `user-${Date.now()}`,
      userId: '',
      senderType: SenderTypeEnum.USER,
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
  };

  const handleUserResponse = async (response: string, field?: string) => {
    sendUserMessage(response);

    if (field) {
      setOnboardingData((prev: any) => ({ ...prev, [field]: response }));
    }

    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsTyping(false);

    const nextStep = step + 1;
    if (nextStep < onboardingFlow.length) {
      setStep(nextStep);
      sendAIMessage(onboardingFlow[nextStep].question);
    } else {
      await completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    setGenerating(true);
    sendAIMessage(
      "Perfect! I'm creating your personalized workout program. This will take just a moment..."
    );

    try {
      const equipmentIds = onboardingData.equipment || [];

      const response = await programService.generateProgram({
        goal: onboardingData.goal,
        experienceLevel: onboardingData.experienceLevel as ExperienceEnum,
        programName: 'My Program',
        startDate: new Date().toISOString().split('T')[0],
        availableEquipmentIds: equipmentIds,
      });

      let programReady = false;
      while (!programReady) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const status = await programService.checkGenerationStatus(response.jobId);
        if (status.status === 'completed') {
          programReady = true;
        }
      }

      sendAIMessage(
        "Your program is ready! Let's get started on your fitness journey."
      );

      setTimeout(() => {
        router.replace('/(tabs)/home');
      }, 2000);
    } catch (error) {
      sendAIMessage(
        "I encountered an issue creating your program. Let's try that again."
      );
      setGenerating(false);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <MessageBubble message={item} />
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.messageId}
          contentContainerClassName="px-4 pt-4 pb-2"
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        />

        {generating && (
          <View className="px-4 py-2">
            <LoadingSpinner message="Generating your program..." />
          </View>
        )}

        {!generating && step < onboardingFlow.length && (
          <View className="p-4 border-t border-neutral-200">
            {onboardingFlow[step].isEquipmentSelection ? (
              <ChatInput
                onSend={(msg) => handleUserResponse(msg, onboardingFlow[step].field)}
                placeholder="Tell me what equipment you have..."
              />
            ) : (
              <View className="flex-row flex-wrap gap-2">
                {onboardingFlow[step].options?.map((option, index) => (
                  <View
                    key={index}
                    className="bg-primary-500 rounded-lg px-4 py-3 flex-1 min-w-[45%]"
                    onTouchEnd={() =>
                      handleUserResponse(option, onboardingFlow[step].field)
                    }
                  >
                    <View className="text-white text-center font-semibold">
                      {option}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
