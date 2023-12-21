export interface ChatEvent {
  type: 'chat';
  message: string;
  recordingId: string;
}

export type WsEvent = ChatEvent;
