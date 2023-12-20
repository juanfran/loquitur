import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AppService } from '../app.service';
import { MatCardModule } from '@angular/material/card';
import { RecordTextComponent } from '../record-text/record-text.component';
import { SpeakersComponent } from '../speakers/speakers.component';
import { CommonModule } from '@angular/common';
import { HowLongPipe } from '../pipes/how-long.pipe';
import { ApiService } from '../api.service';
import {
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { DurationPipe } from '../pipes/duration.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
export class RecordComponent {
  #apiService = inject(ApiService);
  #appService = inject(AppService);
  #queryClient = injectQueryClient();
  #route = inject(ActivatedRoute);
  #id = signal<string>('');
  #cd = inject(ChangeDetectorRef);
  #destroyRef = inject(DestroyRef);
  baseUrl = this.#appService.baseUrl;

  @Input({ required: true }) set id(value: string) {
    this.#id.set(value);
  }

  @Input() segment?: string;

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

  public videoTime: number = 0;

  public initVideo() {
    const text = this.textQuery.data();

    if (!this.segment || !text) {
      return;
    }

    const segment = Number(this.segment);
    const whisperSegment = text[segment];

    if (whisperSegment) {
      this.selectTime(whisperSegment.start);
      this.#cd.detectChanges();

      requestAnimationFrame(() => {
        document.querySelector(`#entry-${segment}`)?.scrollIntoView();
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
    this.#apiService
      .setName(this.#id(), oldName, newName)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.#queryClient.invalidateQueries({
          queryKey: ['record', this.#id()],
        });
        this.#queryClient.invalidateQueries({ queryKey: ['text', this.#id()] });
      });
  }
}
