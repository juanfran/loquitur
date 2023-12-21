import { Injectable, inject } from '@angular/core';
import { AppService } from './app.service';
import { Config } from '@loquitur/commons';
import { from } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  #appService = inject(AppService);
  #http = inject(HttpClient);
  #trpc = this.#appService.getTrpcConfig();

  setConfig(config: Config) {
    return from(this.#trpc.setConfig.mutate(config));
  }

  getConfig() {
    return from(this.#trpc.getConfig.query());
  }

  getRecordings() {
    return from(this.#trpc.recordings.query());
  }

  getRecording(id: string) {
    return from(this.#trpc.recording.query(id));
  }

  search(query: string) {
    return from(this.#trpc.search.query(query));
  }

  getText(id: string) {
    return from(this.#trpc.text.query(id));
  }

  setName(id: string, oldName: string, name: string) {
    return from(this.#trpc.setName.mutate({ id, oldName, name }));
  }

  uploadMedia(files: File[]) {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    return this.#http.post<unknown[]>(
      `${this.#appService.baseUrl}/upload`,
      formData
    );
  }

  bbb() {
    return from(this.#trpc.bbb.query());
  }

  fetchBBBRecording(id: string) {
    return this.#http.post<void>(
      `${this.#appService.baseUrl}/fetch-bbb/${id}`,
      {}
    );
  }

  deleteRecording(id: string) {
    return from(this.#trpc.deleteRecording.mutate(id));
  }
}
