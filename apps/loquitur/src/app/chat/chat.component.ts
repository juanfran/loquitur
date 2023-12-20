import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'loqui-chat',
  template: `
    <h2 mat-dialog-title>Chat</h2>
    <mat-dialog-content>
      <div class="text">
        <p class="user">You</p>
        <div class="response">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut eros
          in massa tristique ultrices non quis erat. Nulla gravida dolor vitae
          lectus gravida aliquet.
        </div>
      </div>
      <div class="text ai">
        <p class="user">AI</p>
        <div class="response">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut eros
          in massa tristique ultrices non quis erat. Nulla gravida dolor vitae
          lectus gravida aliquet.
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <div class="new-message">
        <input type="text" />

        <button mat-mini-fab color="primary">
          <mat-icon>send</mat-icon>
        </button>
      </div>
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
  ],
})
export class ChatComponent {}

// person / person_outline
