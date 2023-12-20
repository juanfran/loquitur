import { Pipe, PipeTransform } from '@angular/core';
import { Recording } from '@loquitur/commons';

import { formatDistance } from 'date-fns';

@Pipe({ name: 'loquiHowLong', standalone: true })
export class HowLongPipe implements PipeTransform {
  transform(recording: Recording): string {
    return formatDistance(recording.date, new Date(), { addSuffix: true });
  }
}
