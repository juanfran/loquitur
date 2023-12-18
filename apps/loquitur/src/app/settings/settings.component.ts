import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../api.service';

@Component({
  selector: 'loqui-settings',
  template: `
    <h2 mat-dialog-title>Settings</h2>
    <form [formGroup]="form" (submit)="submit()">
      <mat-dialog-content>
        <mat-form-field>
          <mat-label>BigBlueButton URL</mat-label>
          <input type="url" matInput formControlName="openAIApiKey" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>BigBlueButton API key</mat-label>
          <input matInput formControlName="openAIApiKey" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>OpenAI API key</mat-label>
          <input matInput formControlName="openAIApiKey" />
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-flat-button mat-dialog-close>Cancel</button>
        <button
          mat-flat-button
          color="primary"
          type="submit"
          [mat-dialog-close]="true"
        >
          Save
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styleUrls: ['./settings.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class SettingsComponent {
  public form = new FormGroup({
    bbbUrl: new FormControl('', { nonNullable: true }),
    bbbApiKey: new FormControl('', { nonNullable: true }),
    openAIApiKey: new FormControl('', { nonNullable: true }),
  });

  private apiService = inject(ApiService);

  submit() {
    if (this.form.valid) {
      this.apiService.setConfig(this.form.value).subscribe();
    }
  }
}
