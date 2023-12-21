import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppService } from '../app.service';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { HowLongPipe } from '../pipes/how-long.pipe';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { RecordingsStore } from './recordings.store';
import { DurationPipe } from '../pipes/duration.pipe';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'loqui-recordings',
  templateUrl: './recordings.component.html',
  styleUrls: ['./recordings.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    HowLongPipe,
    MatProgressSpinnerModule,
    DurationPipe,
  ],
})
export class RecordingsComponent {
  #recordingsStore = inject(RecordingsStore);
  #appService = inject(AppService);

  recordings = this.#recordingsStore.recordings;
  baseUrl = this.#appService.baseUrl;

  deleteReconding(id: string) {
    this.#recordingsStore.actions.deleterecording(id);
  }
}
