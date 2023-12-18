import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, map, zip } from 'rxjs';
import { Recording } from './models/recordings.model';
import { SearchResult } from './models/search-result.model';
import { Speaker } from './models/speaker.model';
import { Whisper } from './models/whisper.model';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public recordings$ = new BehaviorSubject<Recording[]>([]);
  public whisper$ = new BehaviorSubject<Whisper | undefined>(undefined);
  public speakers$ = new BehaviorSubject<Speaker[]>([]);

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private router: Router) {
    this.wsListen();
  }

  public initRecordings() {
    this.whisper$.next(undefined);
    this.speakers$.next([]);

    if (this.recordings$.value.length) {
      return;
    }

    this.http.get<Recording[]>('http://localhost:8080/api/recordings').pipe(
      map((recordings) => {
        recordings.sort((a, b) => (a.startTime > b.startTime) ? -1 : 1);

        return recordings;
      }),
    ).subscribe((recordings) => {
      this.recordings$.next(recordings);
    })
  }

  public initFetch(id: Recording['recordID']) {
    const recordings = this.recordings$.value.map((it) => {
      return {
        ...it,
        appState: it.recordID === id ? 'inprogress' : it.appState
      }
    });

    this.recordings$.next(recordings);

    return this.http.get(`http://localhost:8080/api/fetch/${id}`);
  }

  public getText(id: Recording['recordID']) {
    zip(
      this.http.get<Whisper>(`http://localhost:8080/static/${id}/${id}-whisper.json`),
      this.http.get<Speaker[]>(`http://localhost:8080/static/${id}/${id}-speakers.json`)
    ).subscribe(([whisper, speakers]) => {
      this.whisper$.next(whisper);
      this.speakers$.next(speakers);
    });
  }

  public search(term: string) {
    return this.http.get<SearchResult[]>(`http://localhost:8080/api/search`, {
      params: {
        term
      }
    });
  }

  public wsListen() {
    const ws = new WebSocket('ws://localhost:8090');

    ws.addEventListener('message', (event: MessageEvent) => {
      console.log(event.data);
      this.finishFetch(event.data);
    });
  }

  public finishFetch(id: Recording['recordID']) {
    const recordings = this.recordings$.value.map((it) => {
      return {
        ...it,
        appState: it.recordID === id ? 'done' : it.appState
      }
    });

    this.recordings$.next(recordings);

    const snackBarRef = this.snackBar.open('New recording available', 'Go');

    snackBarRef.onAction().subscribe(() => {
      this.router.navigate(['record', id]);
    });
  }

  public getMinutes(milliseconds: number) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Number(((milliseconds % 60000) / 1000).toFixed(0));
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  public editSpeaker(id: Recording['recordID'], oldName: string, newName: string) {
    const newSpeaker = this.speakers$.value.map((it) => {
      if (it.speaker === oldName) {
        return {
          ...it,
          speaker: newName
        };
      }

      return it;
    });

    this.speakers$.next(newSpeaker);

    this.http.post(`http://localhost:8080/api/speakers/${id}`, {
      oldName,
      newName
    }).subscribe();
  }
}
