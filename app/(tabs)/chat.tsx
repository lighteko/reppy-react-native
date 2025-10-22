import React, { useEffect, useRef } from 'react';
import { View, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MessageBubble,
  ChatInput,
  SuggestedQuestions,
  TypingIndicator,
} from '@/components/chat';
import { LoadingSpinner } from '@/components/common';
import { useChat } from '@/hooks';
import { ChatMessage } from '@/types';

export default function ChatScreen() {
  const {
    messages,
    loading,
    streaming,
    suggestedQuestions,
    sendMessage,
    loadHistory,
    setSuggestedQuestions,
  } = useChat();

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, streaming]);

  const handleSend = (message: string) => {
    sendMessage(message, true);
    setSuggestedQuestions([]);
  };

  const handleQuestionSelect = (question: string) => {
    sendMessage(question, true);
    setSuggestedQuestions([]);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <MessageBubble message={item} />
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="px-6 py-4 border-b border-neutral-200">
        <Text className="text-2xl font-bold text-neutral-900">Chat with Reppy</Text>
        <Text className="text-sm text-neutral-600 mt-1">
          Ask me anything about your workouts
        </Text>
      </View>

      <View className="flex-1">
        {loading && messages.length === 0 ? (
          <LoadingSpinner message="Loading chat history..." />
        ) : (
          <>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.messageId}
              contentContainerClassName="px-4 pt-4 pb-2"
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center py-12">
                  <Text className="text-neutral-500 text-center">
                    Start a conversation with Reppy!
                  </Text>
                </View>
              }
              ListFooterComponent={streaming ? <TypingIndicator /> : null}
            />
            {suggestedQuestions.length > 0 && (
              <SuggestedQuestions
                questions={suggestedQuestions}
                onSelect={handleQuestionSelect}
              />
            )}
          </>
        )}
      </View>

      <ChatInput onSend={handleSend} disabled={streaming} />
    </SafeAreaView>
  );
}
