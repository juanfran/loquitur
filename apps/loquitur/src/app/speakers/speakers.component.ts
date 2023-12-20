import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { WhisperResponse } from '@loquitur/commons';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { DurationPipe } from '../pipes/duration.pipe';

interface SpeakerInfo {
  name: string;
  time: number;
}

@Component({
  selector: 'loqui-speakers',
  templateUrl: './speakers.component.html',
  styleUrls: ['./speakers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    DurationPipe,
  ],
})
export class SpeakersComponent implements OnChanges {
  el = inject(ElementRef);

  @HostListener('document:keydown.escape', ['$event'])
  public onKeydownHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.edit.set(-1);
    }
  }

  @Input({ required: true })
  whisper!: WhisperResponse[];

  @Output()
  newName = new EventEmitter<{
    oldName: string;
    newName: string;
  }>();

  renderList: SpeakerInfo[] = [];
  edit = signal(-1);
  form = new FormControl();

  generateList() {
    const speakers = {} as Record<string, number>;
    this.whisper.forEach((entry) => {
      if (!speakers[entry.speaker]) {
        speakers[entry.speaker] = 0;
      }

      speakers[entry.speaker] += entry.end - entry.start;
    });

    this.renderList = Object.entries(speakers)
      .map(([name, time]) => {
        return {
          name,
          time: Math.round(time),
        };
      })
      .toSorted((a, b) => {
        return a.name > b.name ? 1 : -1;
      });
  }

  openForm(index: number) {
    this.edit.set(index);

    this.form.setValue(this.renderList[index].name);

    requestAnimationFrame(() => {
      (this.el.nativeElement as HTMLElement).querySelector('input')?.focus();
    });
  }

  submit() {
    const oldName = this.renderList[this.edit()].name;

    this.newName.emit({
      oldName,
      newName: this.form.value,
    });

    this.edit.set(-1);
  }

  public ngOnChanges() {
    this.generateList();
  }
}
