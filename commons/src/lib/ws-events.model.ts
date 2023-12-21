export interface ChatEvent {
  type: 'chat';
  message: string;
  recordingId: string;
}

export interface InitChatEvent {
  type: 'init-chat';
  recordingId: string;
}

export type WsEvent = ChatEvent | InitChatEvent;
