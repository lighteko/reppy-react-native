import apiClient from './api';
import {
  ChatMessage,
  SendMessageRequest,
  SendMessageResponse,
  ChatHistoryResponse,
  PaginationParams,
} from '@/types';

export const chatService = {
  async sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
    return apiClient.post<SendMessageResponse>('/chat/messages', data);
  },

  async streamMessage(
    content: string,
    onChunk: (chunk: string) => void,
    onComplete: (suggestedQuestions?: string[]) => void,
    onError: (error: any) => void
  ): Promise<void> {
    try {
      const client = apiClient.getClient();
      const response = await client.post(
        '/chat/messages/stream',
        { content },
        {
          responseType: 'stream',
          headers: {
            'Accept': 'text/event-stream',
          },
        }
      );

      let buffer = '';
      let suggestedQuestions: string[] | undefined;

      response.data.on('data', (chunk: Buffer) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onComplete(suggestedQuestions);
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                onChunk(parsed.content);
              }
              if (parsed.suggestedQuestions) {
                suggestedQuestions = parsed.suggestedQuestions;
              }
            } catch (e) {
              console.error('Error parsing stream data:', e);
            }
          }
        }
      });

      response.data.on('error', (error: any) => {
        onError(error);
      });
    } catch (error) {
      onError(error);
    }
  },

  async getChatHistory(params?: PaginationParams): Promise<ChatHistoryResponse> {
    return apiClient.get<ChatHistoryResponse>('/chat/messages', { params });
  },

  async deleteMessage(messageId: string): Promise<void> {
    return apiClient.delete<void>(`/chat/messages/${messageId}`);
  },
};
