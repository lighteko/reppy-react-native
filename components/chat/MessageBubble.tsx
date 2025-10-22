import React from 'react';
import { View, Text } from 'react-native';
import { ChatMessage, SenderTypeEnum } from '@/types';
import { formatRelativeTime } from '@/utils';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.senderType === SenderTypeEnum.USER;

  return (
    <View className={`mb-4 ${isUser ? 'items-end' : 'items-start'}`}>
      <View
        className={`
          max-w-4/5 rounded-2xl px-4 py-3
          ${isUser ? 'bg-primary-500' : 'bg-neutral-100'}
        `}
      >
        <Text className={`text-base ${isUser ? 'text-white' : 'text-neutral-900'}`}>
          {message.content}
        </Text>
      </View>
      <Text className="text-xs text-neutral-500 mt-1 px-1">
        {formatRelativeTime(message.createdAt)}
      </Text>
    </View>
  );
};
