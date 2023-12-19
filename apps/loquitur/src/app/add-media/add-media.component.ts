import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppStore } from '../app.store';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { AddMediaService } from './add-media.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'loqui-add-media',
  template: `
    <h2 mat-dialog-title>Add media</h2>

    <mat-tab-group>
      <mat-tab label="Upload file">
        <div class="content">
          @if (uploadMedia().isPending) {
          <div class="upload">
            <mat-progress-bar mode="indeterminate"></mat-progress-bar>
          </div>
          } @else if (!uploadMedia().isPending) {
          <button
            type="button"
            mat-raised-button
            color="primary"
            (click)="fileInput.click()"
          >
            Choose File
          </button>

          <input
            hidden
            accept="video/*, audio/*"
            (change)="onFileSelected($event)"
            #fileInput
            type="file"
          />
          }
        </div>
      </mat-tab>
      <mat-tab label="Import from BigBlueButton">
        <div class="content">
          @if (!config().bbbApiKey || !config().bbbUrl) {
          <p>BigBlueButton API key and URL must be set in settings.</p>
          } @else {
          <p>test</p>
          }
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
  styleUrls: ['./add-media.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatTabsModule,
    MatInputModule,
    MatProgressBarModule,
    MatSnackBarModule,
  ],
})
export class AddMediaComponent {
  private appStore = inject(AppStore);
  private addMediaService = inject(AddMediaService);

  uploadMedia = this.addMediaService.uploadMedia;

  readonly config = this.appStore.config;

  public onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const fileList = target.files as FileList;
    const files = Array.from(fileList);

    this.uploadMedia().mutate(files);
  }
}
