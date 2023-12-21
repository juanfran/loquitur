import { ChatEvent, ChatResponse } from '@loquitur/commons';
import { getText } from './get-text';
import { getConfig } from '../db';
import { Observable } from 'rxjs';

const chats = new Map<string, ChatResponse['message'][]>();

async function* streamAsyncIterator(stream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield decoder.decode(value, { stream: !done });
  }
  reader.releaseLock();
}

export function chat(event: ChatEvent): Observable<ChatResponse> {
  return new Observable((observer) => {
    getConfig().then((config) => {
      if (!config.chatApi) {
        return;
      }

      const { recordingId } = event;

      const text = getText(recordingId).map((it) => {
        return `${it.speaker}: ${it.text}`;
      });

      const current = chats.get(recordingId) ?? [
        {
          role: 'system',
          content: `You are an assistant. You must answer in the user language. You must answer questions about this conversation: \n ${text.join(
            '\n'
          )}
    `,
        },
      ];

      chats.set(recordingId, [
        ...current,
        {
          role: 'user',
          content: event.msg,
        },
      ]);

      fetch(config.chatApi + 'chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral',
          messages: chats.get(recordingId),
        }),
      }).then(async (response) => {
        const messanges: ChatResponse[] = [];

        for await (const value of streamAsyncIterator(response.body)) {
          const parsed = JSON.parse(value) as ChatResponse;

          observer.next(parsed);
          messanges.push(parsed);

          if (parsed.done) {
            observer.complete();

            chats.set(recordingId, [
              ...current,
              ...messanges.map((it) => {
                return it.message;
              }),
            ]);
          }
        }
      });
    });
  });
}

export function deleteChat(recordingId: string) {
  chats.delete(recordingId);
}
