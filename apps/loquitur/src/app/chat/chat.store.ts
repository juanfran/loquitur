import { Injectable, inject } from '@angular/core';
import {
  ChatEvent,
  ChatResponse,
  InitChatEvent,
  WsEvent,
} from '@loquitur/commons';
import { rxState } from '@rx-angular/state';

import { rxActions } from '@rx-angular/state/actions';
import { tap } from 'rxjs';
import { AppService } from '../app.service';

interface ChatState {
  loading: boolean;
  recording: string;
  messages: ChatResponse[];
}

const initialState: ChatState = {
  loading: false,
  recording: '',
  messages: [],
};

@Injectable({
  providedIn: 'root',
})
export class ChatStore {
  #appService = inject(AppService);

  actions = rxActions<{
    message: Pick<ChatEvent, 'message' | 'recordingId'>;
    destroy: string;
    recording: string;
    chunk: ChatResponse;
  }>();

  #sendMessage$ = this.actions.onMessage((message$) => {
    return message$.pipe(
      tap((message) => {
        const messages = this.#state.get('messages');
        messages.push({
          message: {
            role: 'user',
            content: message.message,
          },
          done: true,
          created_at: new Date().toISOString(),
        });

        this.#state.set({ loading: true, messages: [...messages] });

        this.#appService.sendWsMessage({
          type: 'chat',
          ...message,
        } as ChatEvent);
      })
    );
  });

  #chunk$ = this.actions.onChunk((chunk$) => {
    return chunk$.pipe(
      tap((chunk) => {
        let messages = this.#state.get('messages');

        const inProgress = messages.find((it) => !it.done);

        if (inProgress) {
          inProgress.message.content += chunk.message.content;
          inProgress.done = chunk.done;
        } else {
          messages = [...messages, chunk];
        }

        this.#state.set({ messages: [...messages], loading: !chunk.done });
      })
    );
  });

  #setRecording$ = this.actions.onRecording((recording$) => {
    return recording$.pipe(
      tap((recordingId) => {
        this.#appService.sendWsMessage({
          type: 'init-chat',
          recordingId,
        } as InitChatEvent);

        this.#state.set({ recording: recordingId, messages: [] });
      })
    );
  });

  #state = rxState<ChatState>(({ set }) => {
    set(initialState);

    this.#appService.ws?.addEventListener('message', (event: MessageEvent) => {
      const data = JSON.parse(event.data) as WsEvent;

      if (data.type === 'chat-response') {
        this.actions.chunk(data.content);
      }
    });
  });

  readonly messages = this.#state.signal('messages');
  readonly messages$ = this.#state.select('messages');
  readonly loading = this.#state.signal('loading');
}
