import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { AppStore } from '../app.store';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { HowLongPipe } from '../pipes/how-long.pipe';
import { RangeDatePipe } from '../pipes/range-date.pipe';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  injectMutation,
  injectQuery,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { ApiService } from '../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RecordingsStore } from '../recordings/recordings.store';

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
                  <img [src]="imageItem[0]" />
                  }
                </mat-card-title-group>
              </mat-card-header>
              <mat-card-content>
                <p><span>Duration:</span> {{ record | loquiRangeDate }}</p>
                <p><span>Speakers:</span> {{ record.participants }}</p>
                <mat-divider></mat-divider>
              </mat-card-content>
              <mat-card-actions>
                @if (inProgress().includes(record.recordID)) {
                <mat-progress-spinner mode="indeterminate" diameter="40" />
                } @else {
                <button
                  type="text"
                  (click)="initFetchBbb(record.recordID)"
                  mat-button
                >
                  Download
                </button>
                }
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
    MatProgressSpinnerModule,
  ],
})
export class AddMediaComponent {
  #appStore = inject(AppStore);
  #apiService = inject(ApiService);
  #snackBar = inject(MatSnackBar);
  #recordingsStore = inject(RecordingsStore);

  inProgress = signal([] as string[]);

  uploadMedia = injectMutation(() => ({
    mutationFn: (files: File[]) =>
      lastValueFrom(this.#apiService.uploadMedia(files)),

    onSuccess: () => {
      this.#snackBar.open('Upload success', 'Close', {
        duration: 3000,
      });

      this.#recordingsStore.actions.refetch();
    },
  }));

  bbbElements = injectQuery(() => ({
    queryKey: ['bbb'],
    queryFn: () => lastValueFrom(this.#apiService.bbb()),
  }));

  fetchBbb = injectMutation(() => ({
    onMutate: (id: string) => {
      this.inProgress.set([...this.inProgress(), id]);
    },
    mutationFn: (id: string) =>
      lastValueFrom(this.#apiService.fetchBBBRecording(id)),

    onSuccess: (_, id) => {
      this.inProgress.set(this.inProgress().filter((it) => it !== id));

      this.#snackBar.open('Upload success', 'Close', {
        duration: 3000,
      });

      this.#recordingsStore.actions.refetch();
    },
  }));

  readonly config = this.#appStore.config;

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const fileList = target.files as FileList;
    const files = Array.from(fileList);

    this.uploadMedia().mutate(files);
  }

  initFetchBbb(recordId: string): void {
    this.fetchBbb().mutate(recordId);

    // this.fetchBbb().isPending
  }
}
