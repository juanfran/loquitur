import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Recording } from '../models/recordings.model';
import { AppService } from '../app.service';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
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
    MatButtonToggleModule,
    MatCardModule,
    MatDividerModule,
    HowLongPipe,
    MatProgressSpinnerModule,
    DurationPipe,
  ],
})
export class RecordingsComponent {
  #recordingsStore = inject(RecordingsStore);

  recordings = this.#recordingsStore.recordings;

  // public recordingType$ = new BehaviorSubject('all');
  // public recordings$ = combineLatest([
  //   this.appService.recordings$.asObservable(),
  //   this.recordingType$,
  // ]).pipe(
  //   map(([recordings, filter]) => {
  //     return recordings.filter((record) => {
  //       if (filter === 'all') {
  //         return true;
  //       }

  //       return record.appState === filter;
  //     });
  //   })
  // );

  // constructor(private appService: AppService) {
  //   this.appService.initRecordings();
  // }

  public initFetch(recordID: Recording['recordID']) {
    // this.appService.initFetch(recordID).subscribe();
  }

  public newType(event: MatButtonToggleChange) {
    // this.recordingType$.next(event.value);
  }
}
