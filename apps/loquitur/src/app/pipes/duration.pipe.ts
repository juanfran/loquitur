import { Pipe, PipeTransform } from '@angular/core';
import { Recording } from '@loquitur/commons';

import { formatDuration } from 'date-fns';

@Pipe({ name: 'loquiDuration', standalone: true })
export class DurationPipe implements PipeTransform {
  transform(recording: Recording): string {
    return formatDuration({
      seconds: recording.duration,
    });
  }
}
