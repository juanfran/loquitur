export interface ChatResponse {
  model: string;
  created_at: string;
  message: { role: 'user' | 'system' | 'assistant'; content: string };
  done: boolean;
}
