import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  Input,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
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
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChatComponent } from '../chat/chat.component';
import { AppStore } from '../app.store';
import { ChatStore } from '../chat/chat.store';

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
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class RecordComponent {
  #apiService = inject(ApiService);
  #appService = inject(AppService);
  #appStore = inject(AppStore);
  #queryClient = injectQueryClient();
  #id = signal<string>('');
  #cd = inject(ChangeDetectorRef);
  #destroyRef = inject(DestroyRef);
  #dialog = inject(MatDialog);
  #chatStore = inject(ChatStore);
  baseUrl = this.#appService.baseUrl;
  readonly config = this.#appStore.config;

  @Input({ required: true }) set id(value: string) {
    this.#id.set(value);

    if (value) {
      this.#chatStore.actions.recording(value);
    }
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

  @ViewChild('videoElm') videoElementRef!: ElementRef<HTMLElement>;

  videoTime$ = new BehaviorSubject<number>(0);
  videoTime = this.videoTime$.asObservable();

  initVideo() {
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

  openChat() {
    this.#dialog.open(ChatComponent, {
      width: '800px',
      data: {
        recordingId: this.#id(),
      },
    });
  }

  timeUpdate(event: Event) {
    this.videoTime$.next((event.target as HTMLVideoElement).currentTime);
  }

  selectTime(time: number) {
    const videoWrapper = this.videoElementRef.nativeElement as HTMLElement;
    const video = videoWrapper.querySelector<HTMLVideoElement>('video');

    if (video) {
      video.currentTime = time;
      video.play();
    }
  }

  setNewName({ oldName, newName }: { oldName: string; newName: string }) {
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
