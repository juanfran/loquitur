import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppStore } from '../app.store';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { AddMediaService } from './add-media.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { HowLongPipe } from '../pipes/how-long.pipe';
import { RangeDatePipe } from '../pipes/range-date.pipe';
import { MatDividerModule } from '@angular/material/divider';

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
        <mat-dialog-content>
          <div class="content">
            @if (!config().bbbApiKey || !config().bbbUrl) {
            <p>BigBlueButton API key and URL must be set in settings.</p>
            } @else { @for(record of bbbElements.data(); track record.recordID)
            {
            <mat-card class="card">
              <mat-card-header>
                <mat-card-title-group>
                  <mat-card-title>{{ record.name }} </mat-card-title>
                  <mat-card-subtitle
                    >{{ record.startTime | loquiHowLong }}
                  </mat-card-subtitle>
                  @if (record.playback.format.preview?.images?.image; as
                  imageItem) {
                  <img mat-card-sm-image [src]="imageItem[0]" />
                  }
                </mat-card-title-group>
              </mat-card-header>
              <mat-card-content>
                <p><span>Duration:</span> {{ record | loquiRangeDate }}</p>
                <p><span>Speakers:</span> {{ record.participants }}</p>
                <mat-divider></mat-divider>
              </mat-card-content>
              <mat-card-actions>
                <button type="text" mat-button>Download</button>
              </mat-card-actions>
            </mat-card>

            } }
          </div>
        </mat-dialog-content>
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
    MatCardModule,
    HowLongPipe,
    RangeDatePipe,
    MatDividerModule,
  ],
})
export class AddMediaComponent {
  private appStore = inject(AppStore);
  private addMediaService = inject(AddMediaService);

  uploadMedia = this.addMediaService.uploadMedia;
  bbbElements = this.addMediaService.bbbElements;

  readonly config = this.appStore.config;

  public onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const fileList = target.files as FileList;
    const files = Array.from(fileList);

    this.uploadMedia().mutate(files);
  }
}
