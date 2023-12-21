import { ChatResponse } from './chat.model';

export interface ChatEvent {
  type: 'chat';
  message: string;
  recordingId: string;
}

export interface InitChatEvent {
  type: 'init-chat';
  recordingId: string;
}

export interface WSChatResponse {
  type: 'chat-response';
  content: ChatResponse;
}

export type WsEvent = ChatEvent | InitChatEvent | WSChatResponse;
