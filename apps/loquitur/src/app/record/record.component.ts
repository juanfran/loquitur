import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, share, take } from 'rxjs';
import { AppService } from '../app.service';
import { filterNil } from 'ngxtension/filter-nil';
import { MatCardModule } from '@angular/material/card';
import { RecordTextComponent } from '../record-text/record-text.component';
import { SpeakersComponent } from '../speakers/speakers.component';
import { CommonModule } from '@angular/common';
import { HowLongPipe } from '../pipes/how-long.pipe';

@Component({
  selector: 'loqui-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RecordTextComponent,
    SpeakersComponent,
    HowLongPipe,
  ],
})
export class RecordComponent implements OnInit {
  @HostListener('window:scroll')
  public onScroll() {
    const scollPosition = window.pageYOffset;

    if (this.videoElementRef) {
      const videoWrapper = this.videoElementRef.nativeElement as HTMLElement;
      const video = videoWrapper.querySelector<HTMLElement>('video');

      if (video) {
        const videoBottom = videoWrapper.getBoundingClientRect().bottom;
        const videoHeight = videoWrapper.getBoundingClientRect().height;

        if (scollPosition > videoBottom + videoHeight) {
          video.classList.add('stuck');
        } else {
          video.classList.remove('stuck');
        }
      }
    }
  }

  @ViewChild('videoElm') public videoElementRef!: ElementRef;

  public video = '';
  public whisper$ = this.appService.whisper$.asObservable();
  public speakers$ = this.appService.speakers$.asObservable();
  public videoTime: number = 0;
  public segment$ = this.route.queryParamMap.pipe(
    map((params) => {
      return params.get('segment') ?? '';
    })
  );

  public record$ = this.appService.recordings$.asObservable().pipe(
    map((recordings) => {
      const id = this.route.snapshot.paramMap.get('id');

      const record = recordings.find((record) => record.recordID === id);

      if (record) {
        return record;
      }

      return undefined;
    }),
    share()
  );

  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
    this.appService.initRecordings();
  }

  public ngOnInit(): void {
    const recordID = this.route.snapshot.paramMap.get('id');

    if (recordID) {
      this.video = `http://localhost:8080/static/${recordID}/${recordID}.webm`;

      this.appService.getText(recordID);
    }
  }

  public initVideo() {
    if (this.route.snapshot.queryParams['segment']) {
      const segment = Number(this.route.snapshot.queryParams['segment']);

      this.whisper$.pipe(filterNil(), take(1)).subscribe((whisper) => {
        const whisperSegment = whisper.segments.find((it) => it.id === segment);

        if (whisperSegment) {
          this.selectTime(whisperSegment.start);
          this.cd.detectChanges();

          requestAnimationFrame(() => {
            document
              .querySelector(`#entry-${whisperSegment.id}`)
              ?.scrollIntoView();
          });
        }
      });
    }
  }

  public timeUpdate(event: Event) {
    this.videoTime = (event.target as HTMLVideoElement).currentTime;
  }

  public selectTime(time: number) {
    const videoWrapper = this.videoElementRef.nativeElement as HTMLElement;
    const video = videoWrapper.querySelector<HTMLVideoElement>('video');

    if (video) {
      video.currentTime = time + 0.1;
    }
  }
}
