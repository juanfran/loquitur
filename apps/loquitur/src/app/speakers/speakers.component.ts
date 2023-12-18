import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AppService } from '../app.service';
import { Recording } from '../models/recordings.model';
import { Speaker } from '../models/speaker.model';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

interface SpeakerInfo {
  name: string;
  time: string;
}

@Component({
  selector: 'loqui-speakers',
  templateUrl: './speakers.component.html',
  styleUrls: ['./speakers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule
],
})
export class SpeakersComponent implements OnChanges {
  @HostListener('document:keydown.escape', ['$event'])
  public onKeydownHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.edit = -1;
    }
  }

  @Input()
  public record!: Recording['recordID'];

  @Input()
  public speakers!: Speaker[];

  public renderList: SpeakerInfo[] = [];
  public edit: number = -1;
  public form = new FormControl();

  constructor(public appService: AppService, public el: ElementRef) {}

  public generateList() {
    const speakersList = new Set(
      this.speakers.map((speaker) => speaker.speaker)
    );

    this.renderList = [...speakersList].map((speaker) => {
      const time = this.speakers.reduce((prev, cur) => {
        if (cur.speaker === speaker) {
          return prev + cur.start + cur.end;
        }

        return prev;
      }, 0);

      return {
        name: speaker,
        time: this.appService.getMinutes(time * 10),
      };
    });

    this.renderList.sort((a, b) => (a.name > b.name ? 1 : -1));
  }

  public openForm(index: number) {
    this.edit = index;

    this.form.setValue(this.renderList[index].name);

    requestAnimationFrame(() => {
      (this.el.nativeElement as HTMLElement).querySelector('input')?.focus();
    });
  }

  public submit() {
    const oldName = this.renderList[this.edit].name;

    this.appService.editSpeaker(this.record, oldName, this.form.value);
    this.edit = -1;
  }

  public ngOnChanges() {
    this.generateList();
  }
}
