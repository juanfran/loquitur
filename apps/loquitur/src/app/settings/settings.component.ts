import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppStore } from '../app.store';

@Component({
  selector: 'loqui-settings',
  template: `
    <h2 mat-dialog-title>Settings</h2>
    <form [formGroup]="form" (submit)="submit()">
      <mat-dialog-content>
        <mat-form-field>
          <mat-label>BigBlueButton URL</mat-label>
          <input type="url" matInput formControlName="bbbUrl" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>BigBlueButton API key</mat-label>
          <input matInput type="password" formControlName="bbbApiKey" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Chat url</mat-label>
          <input matInput formControlName="chatApi" />
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
  private appStore = inject(AppStore);

  readonly config = this.appStore.config;

  public form = new FormGroup({
    bbbUrl: new FormControl(this.config().bbbUrl, { nonNullable: true }),
    bbbApiKey: new FormControl(this.config().bbbApiKey, { nonNullable: true }),
    chatApi: new FormControl(this.config().chatApi, {
      nonNullable: true,
    }),
  });

  submit() {
    if (this.form.valid) {
      this.appStore.actions.setConfig(this.form.value);
    }
  }
}
