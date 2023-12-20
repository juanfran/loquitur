import { Pipe, PipeTransform } from '@angular/core';

import { intervalToDuration, formatDuration } from 'date-fns';

@Pipe({ name: 'loquiDuration', standalone: true })
export class DurationPipe implements PipeTransform {
  transform(durationSeconds: number): string {
    const epoch = new Date(0);
    const secondsAfterEpoch = new Date(durationSeconds * 1000);
    const duration = intervalToDuration({
      start: epoch,
      end: secondsAfterEpoch,
    });

    return formatDuration(duration);
  }
}
