import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom, map, take } from 'rxjs';
import { AppService } from '../app.service';
import { filterNil } from 'ngxtension/filter-nil';
import { MatCardModule } from '@angular/material/card';
import { RecordTextComponent } from '../record-text/record-text.component';
import { SpeakersComponent } from '../speakers/speakers.component';
import { CommonModule } from '@angular/common';
import { HowLongPipe } from '../pipes/how-long.pipe';
import { ApiService } from '../api.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { DurationPipe } from '../pipes/duration.pipe';

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
    DurationPipe,
  ],
})
export class RecordComponent implements OnInit {
  #apiService = inject(ApiService);
  #appService = inject(AppService);
  #route = inject(ActivatedRoute);
  #id = signal<string>('');
  #cd = inject(ChangeDetectorRef);
  baseUrl = this.#appService.baseUrl;

  @Input({ required: true }) set id(value: string) {
    this.#id.set(value);
  }

  recordQuery = injectQuery(() => ({
    enabled: this.#id().length > 0,
    queryKey: ['record', this.#id()],
    queryFn: ({ queryKey }) => {
      return lastValueFrom(this.#apiService.getRecording(queryKey[1]));
    },
  }));

  textQuery = injectQuery(() => ({
    enabled: this.#id().length > 0,
    queryKey: ['text', this.#id()],
    queryFn: ({ queryKey }) => {
      return lastValueFrom(this.#apiService.getText(queryKey[1]));
    },
  }));

  @HostListener('window:scroll')
  public onScroll() {
    const scollPosition = window.scrollY;

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

  public whisper$ = this.#appService.whisper$.asObservable();
  public speakers$ = this.#appService.speakers$.asObservable();
  public videoTime: number = 0;
  public segment$ = this.#route.queryParamMap.pipe(
    map((params) => {
      return params.get('segment') ?? '';
    })
  );

  public ngOnInit(): void {
    // todo
    this.#appService.getText(this.#id());
  }

  public initVideo() {
    // todo
    if (this.#route.snapshot.queryParams['segment']) {
      const segment = Number(this.#route.snapshot.queryParams['segment']);

      this.whisper$.pipe(filterNil(), take(1)).subscribe((whisper) => {
        const whisperSegment = whisper.segments.find((it) => it.id === segment);

        if (whisperSegment) {
          this.selectTime(whisperSegment.start);
          this.#cd.detectChanges();

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

  public setNewName({
    oldName,
    newName,
  }: {
    oldName: string;
    newName: string;
  }) {
    this.#apiService.setName(this.#id(), oldName, newName).subscribe();
  }
}
