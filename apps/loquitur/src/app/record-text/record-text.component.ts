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
import { Speaker } from '../models/speaker.model';
import { Segment, Whisper } from '../models/whisper.model';
import { WhisperResponse } from '@loquitur/commons';

interface TextResult {
  id: number;
  text: Segment['text'];
  start: Segment['start'];
  end: Segment['end'];
  speaker: string;
}

@Component({
  selector: 'loqui-record-text',
  templateUrl: './record-text.component.html',
  styleUrls: ['./record-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
})
export class RecordTextComponent implements OnInit, OnChanges {
  @Input()
  public speakers!: string[];

  @Input()
  public whisper!: WhisperResponse[];

  @Input()
  public time: number = 0;

  @Output()
  public selectTime = new EventEmitter<number>();

  public result!: TextResult[];
  public currentIndex = 0;

  public ngOnInit() {
    this.calculate();
    this.findCurrent();
  }

  public calculate() {
    this.result = this.whisper.map((segment, index) => {
      return {
        id: index,
        text: segment.text,
        start: segment.start,
        end: segment.end,
        speaker: segment.speaker,
      };
    });
  }

  public findCurrent() {
    this.currentIndex = this.result.findIndex((it) => {
      return this.time >= it.start && this.time <= it.end;
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['time'] && this.result) {
      this.findCurrent();
    }

    if (changes['speakers']) {
      this.calculate();
      this.findCurrent();
    }
  }

  public selectResult(text: TextResult) {
    this.selectTime.next(text.start);
  }
}
