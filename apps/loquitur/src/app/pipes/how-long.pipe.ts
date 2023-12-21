import { Pipe, PipeTransform } from '@angular/core';

import { formatDistance } from 'date-fns';

@Pipe({ name: 'loquiHowLong', standalone: true })
export class HowLongPipe implements PipeTransform {
  transform(date: number | string): string {
    return formatDistance(date, new Date(), { addSuffix: true });
  }
}
