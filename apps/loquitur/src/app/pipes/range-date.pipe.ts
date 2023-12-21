import { Pipe, PipeTransform } from '@angular/core';
import { AppService } from '../app.service';
import { formatDistance } from 'date-fns';

@Pipe({ name: 'loquiRangeDate', standalone: true })
export class RangeDatePipe implements PipeTransform {
  constructor(public appService: AppService) {}

  transform(data: { startTime: number; endTime: number }): string {
    return formatDistance(data.startTime, data.endTime);
  }
}
