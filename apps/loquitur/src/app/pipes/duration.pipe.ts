import { Pipe, PipeTransform } from '@angular/core';
import { Recording } from '@loquitur/commons';

import { intervalToDuration, formatDuration } from 'date-fns';

@Pipe({ name: 'loquiDuration', standalone: true })
export class DurationPipe implements PipeTransform {
  transform(recording: Recording): string {
    const epoch = new Date(0);
    const secondsAfterEpoch = new Date(recording.duration * 1000);
    const duration = intervalToDuration({
      start: epoch,
      end: secondsAfterEpoch,
    });

    return formatDuration(duration);
  }
}
