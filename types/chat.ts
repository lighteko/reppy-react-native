import { SenderTypeEnum } from './enums';

export interface ChatMessage {
  messageId: string;
  userId: string;
  senderType: SenderTypeEnum;
  content: string;
  createdAt: string;
  suggestedQuestions?: string[];
}

export interface SendMessageRequest {
  content: string;
}

export interface SendMessageResponse {
  message: ChatMessage;
  suggestedQuestions?: string[];
}

export interface StreamChunk {
  content: string;
  done: boolean;
  suggestedQuestions?: string[];
}

export interface ChatHistoryResponse {
  messages: ChatMessage[];
  total: number;
  hasMore: boolean;
}
