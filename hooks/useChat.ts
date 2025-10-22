import { useState, useEffect, useCallback } from 'react';
import { chatService } from '@/services';
import { ChatMessage, SenderTypeEnum } from '@/types';
import { parseApiError, getUserFriendlyMessage } from '@/utils';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [streamingMessage, setStreamingMessage] = useState<string>('');

  const loadHistory = useCallback(async (limit: number = 50, offset: number = 0) => {
    try {
      setLoading(true);
      setError(null);

      const response = await chatService.getChatHistory({ limit, offset });
      setMessages(response.messages.reverse());
    } catch (err: any) {
      const apiError = parseApiError(err);
      setError(getUserFriendlyMessage(apiError));
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = async (content: string, useStreaming: boolean = true) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      messageId: `temp-${Date.now()}`,
      userId: '',
      senderType: SenderTypeEnum.USER,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setError(null);

    if (useStreaming) {
      setStreaming(true);
      setStreamingMessage('');

      const tempAiMessage: ChatMessage = {
        messageId: `temp-ai-${Date.now()}`,
        userId: '',
        senderType: SenderTypeEnum.REPPY,
        content: '',
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, tempAiMessage]);

      await chatService.streamMessage(
        content,
        (chunk: string) => {
          setStreamingMessage((prev) => prev + chunk);
        },
        (suggestions?: string[]) => {
          if (suggestions) {
            setSuggestedQuestions(suggestions);
          }
          setStreaming(false);
          setStreamingMessage('');
        },
        (err: any) => {
          const apiError = parseApiError(err);
          setError(getUserFriendlyMessage(apiError));
          setStreaming(false);
          setStreamingMessage('');
        }
      );
    } else {
      try {
        const response = await chatService.sendMessage({ content: content.trim() });

        setMessages((prev) => [
          ...prev.filter((m) => !m.messageId.startsWith('temp-')),
          userMessage,
          response.message,
        ]);

        if (response.suggestedQuestions) {
          setSuggestedQuestions(response.suggestedQuestions);
        }
      } catch (err: any) {
        const apiError = parseApiError(err);
        setError(getUserFriendlyMessage(apiError));
        setMessages((prev) => prev.filter((m) => m.messageId !== userMessage.messageId));
      }
    }
  };

  useEffect(() => {
    if (streamingMessage && messages.length > 0) {
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage.senderType === SenderTypeEnum.REPPY) {
          return [
            ...prev.slice(0, -1),
            { ...lastMessage, content: streamingMessage },
          ];
        }
        return prev;
      });
    }
  }, [streamingMessage]);

  return {
    messages,
    loading,
    streaming,
    error,
    suggestedQuestions,
    sendMessage,
    loadHistory,
    setSuggestedQuestions,
  };
};
