import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@loqui/api/app/router';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  readonly baseUrl = environment.apiURL;
  ws?: WebSocket;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.wsListen();
  }

  public wsListen() {
    this.ws = new WebSocket(environment.wsUrl);
  }

  sendWsMessage(message: object) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws?.send(JSON.stringify(message));
    }
  }

  // public finishFetch(id: Recording['recordID']) {
  //   const recordings = this.recordings$.value.map((it) => {
  //     return {
  //       ...it,
  //       appState: it.recordID === id ? 'done' : it.appState,
  //     };
  //   });

  //   this.recordings$.next(recordings);

  //   const snackBarRef = this.snackBar.open('New recording available', 'Go');

  //   snackBarRef.onAction().subscribe(() => {
  //     this.router.navigate(['record', id]);
  //   });
  // }

  public getTrpcConfig() {
    return createTRPCProxyClient<AppRouter>({
      links: [
        httpBatchLink({
          url: this.baseUrl + '/trpc',
          fetch(url, options) {
            return fetch(url, {
              ...options,
            });
          },
        }),
      ],
    });
  }
}
