import { Pipe, PipeTransform } from '@angular/core';
import { AppService } from '../app.service';
import { Recording } from '../models/recordings.model';

@Pipe({ name: 'loquiHowLong', standalone: true })
export class HowLongPipe implements PipeTransform {
  constructor(public appService: AppService) {}

  transform(recording: Recording): string {
    const milliseconds =
      new Date(recording.endTime).getTime() -
      new Date(recording.startTime).getTime();

    return this.appService.getMinutes(milliseconds);
  }
}
