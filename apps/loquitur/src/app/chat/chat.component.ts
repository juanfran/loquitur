import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ChatStore } from './chat.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { map } from 'rxjs/operators';

@Component({
  selector: 'loqui-chat',
  template: `
    <h2 mat-dialog-title>Chat</h2>
    <mat-dialog-content>
      @for (chat of messages(); track $index) {
      <div class="text" [class.ai]="chat.message.role === 'assistant'">
        <p class="user">
          @if (chat.message.role === 'user') { You } @else { AI }
        </p>
        <div class="response">
          {{ chat.message.content }}
        </div>
      </div>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <form (submit)="onSubmit($event)" class="new-message">
        <input type="text" [formControl]="message" />

        @if(loading()) {
        <div class="spinner">
          <mat-spinner [diameter]="40"></mat-spinner>
        </div>
        } @else {
        <button type="submit" mat-mini-fab color="primary">
          <mat-icon>send</mat-icon>
        </button>
        }
      </form>
    </mat-dialog-actions>
  `,
  standalone: true,
  styleUrls: ['./chat.component.css'],
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class ChatComponent {
  #chatStore = inject(ChatStore);

  public data = inject<{
    recordingId: string;
  }>(MAT_DIALOG_DATA);

  messages = this.#chatStore.messages;
  messages$ = this.#chatStore.messages$;
  loading = this.#chatStore.loading;

  message = new FormControl('', [Validators.required]);

  constructor() {
    this.#chatStore.actions.recording(this.data.recordingId);

    this.messages$
      .pipe(
        map((it) => {
          return it.length;
        })
      )
      .subscribe(() => {
        requestAnimationFrame(() => {
          const element = document.querySelector('mat-dialog-content');
          element?.scrollTo({
            top: element.scrollHeight,
            behavior: 'smooth',
          });
        });
      });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const message = this.message.value?.trim();

    if (message) {
      this.#chatStore.actions.message({
        message,
        recordingId: this.data.recordingId,
      });
      this.message.setValue('');
    }
  }
}
