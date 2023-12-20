import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { WhisperResponse } from '@loquitur/commons';

@Component({
  selector: 'loqui-record-text',
  templateUrl: './record-text.component.html',
  styleUrls: ['./record-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
})
export class RecordTextComponent implements OnInit, OnChanges {
  @Input({ required: true })
  public whisper!: WhisperResponse[];

  @Input()
  public time: number = 0;

  @Output()
  public selectTime = new EventEmitter<number>();

  public currentEntryIndex = 0;
  public currentWordIndex = 0;

  public ngOnInit() {
    this.findCurrent();
  }

  public findCurrent() {
    this.currentEntryIndex = this.whisper.findIndex((it) => {
      return this.time >= it.start && this.time <= it.end;
    });

    const entry = this.whisper[this.currentEntryIndex];
    let newCurrentWordIndex = -1;

    if (entry) {
      newCurrentWordIndex = entry.words.findIndex((it) => {
        return this.time >= it.start && this.time <= it.end;
      });
    }

    if (newCurrentWordIndex !== -1) {
      this.currentWordIndex = newCurrentWordIndex;
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['time']) {
      this.findCurrent();
    }
  }

  public selectResult(time: number) {
    this.selectTime.next(time);
  }
}
