import { Injectable, inject } from '@angular/core';
import { AppService } from './app.service';
import { Config } from '@loquitur/commons';
import { from } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private appService = inject(AppService);
  private http = inject(HttpClient);
  private trpc = this.appService.getTrpcConfig();

  public setConfig(config: Config) {
    return from(this.trpc.setConfig.mutate(config));
  }

  public getConfig() {
    return from(this.trpc.getConfig.query());
  }

  public getRecordings() {
    return from(this.trpc.recordings.query());
  }

  public getRecording(id: string) {
    return from(this.trpc.recording.query(id));
  }

  public getText(id: string) {
    return from(this.trpc.text.query(id));
  }

  public setName(id: string, oldName: string, name: string) {
    return from(this.trpc.setName.mutate({ id, oldName, name }));
  }

  public uploadMedia(files: File[]) {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    return this.http.post<unknown[]>(
      `${this.appService.baseUrl}/upload`,
      formData
    );
  }
}
