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


interface TextResult {
  id: number;
  text: Segment['text'];
  start: Segment['start'];
  end: Segment['end'];
  speakers: string;
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
  public speakers!: Speaker[];

  @Input()
  public whisper!: Whisper;

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
    let lastSpeaker: string[] = [];

    this.result = this.whisper.segments.map((segment) => {
      let speakers = this.speakers
        .filter((speaker) => {
          const case1 =
            speaker.start <= segment.start && speaker.end >= segment.end;
          const case2 =
            speaker.start <= segment.start &&
            speaker.end <= segment.end &&
            speaker.end >= segment.start;
          const case3 =
            speaker.start >= segment.start && speaker.end <= segment.end;

          return case1 || case2 || case3;
        })
        .map((it) => it.speaker);

      if (!speakers.length) {
        speakers = lastSpeaker;

        if (!speakers.length) {
          speakers = [this.speakers[0].speaker];
        }
      }

      lastSpeaker = [...speakers];

      return {
        id: segment.id,
        text: segment.text,
        start: segment.start,
        end: segment.end,
        speakers: [...new Set(speakers)].join(', '),
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
