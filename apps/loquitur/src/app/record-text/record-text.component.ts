import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WhisperResponse } from '@loquitur/commons';
import { filterNil } from 'ngxtension/filter-nil';
import { Observable, Subject, distinctUntilChanged, filter } from 'rxjs';

@Component({
  selector: 'loqui-record-text',
  templateUrl: './record-text.component.html',
  styleUrls: ['./record-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
})
export class RecordTextComponent implements OnInit, AfterViewInit {
  #destroyRef = inject(DestroyRef);
  #elementRef = inject(ElementRef<HTMLElement>);

  @Input({ required: true })
  whisper!: WhisperResponse[];

  @Input({ required: true })
  time!: Observable<number>;

  @Output()
  selectTime = new EventEmitter<number>();

  words: HTMLElement[] = [];
  renderWord$ = new Subject<number>();
  renderEntry$ = new Subject<number>();

  ngAfterViewInit(): void {
    this.words = Array.from(
      this.#elementRef.nativeElement.querySelectorAll('.word')
    );

    this.renderWord$
      .pipe(
        distinctUntilChanged(),
        filterNil(),
        filter((index) => index >= 0),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe((index) => {
        this.#elementRef.nativeElement
          .querySelector('.current-word')
          ?.classList.remove('current-word');

        this.words[index].classList.add('current-word');
      });

    this.renderEntry$
      .pipe(
        distinctUntilChanged(),
        filterNil(),
        filter((index) => index >= 0),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe((index) => {
        this.#elementRef.nativeElement
          .querySelector('.current')
          ?.classList.remove('current');

        document.getElementById(`entry-${index}`)?.classList.add('current');
      });
  }

  ngOnInit() {
    this.time.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((time) => {
      this.findCurrent(time);
    });
  }

  findCurrent(time: number) {
    if (!this.words.length) {
      return;
    }

    const entryIndex = this.whisper.findIndex((it) => {
      return time >= it.start && time <= it.end;
    });

    const words = this.whisper.flatMap((it) => it.words);
    let wordIndex = words.findIndex((it) => {
      return time >= it.start && time <= it.end;
    });

    if (wordIndex === -1) {
      const nearWord = words
        .map((it, index) => {
          {
            return {
              diff: time - it.end,
              index,
            };
          }
        })
        .filter((it) => it.diff > 0)
        .toSorted((a, b) => {
          return a > b ? 1 : -1;
        })[0];

      wordIndex = nearWord.index;
    }

    this.renderWord$.next(wordIndex);
    this.renderEntry$.next(entryIndex);
  }

  selectResult(time: number) {
    this.selectTime.next(time);
  }
}
