export interface ChatEvent {
  type: 'chat';
  msg: string;
  recordingId: string;
}

export type WsEvent = ChatEvent;
