import { Injectable, inject } from '@angular/core';
import { Config } from '@loquitur/commons';
import { rxState } from '@rx-angular/state';
import { ApiService } from './api.service';
import { rxActions } from '@rx-angular/state/actions';
import { exhaustMap, merge } from 'rxjs';

interface AppState {
  config: Config;
}

const initialState: AppState = {
  config: {},
};

@Injectable({
  providedIn: 'root',
})
export class AppStore {
  #apiService = inject(ApiService);

  actions = rxActions<{
    setConfig: Partial<Config>;
  }>();

  #state = rxState<AppState>(({ set, connect }) => {
    set(initialState);

    connect(
      'config',
      merge(
        this.#apiService.getConfig(),
        this.actions.setConfig$.pipe(
          exhaustMap((config) => this.#apiService.setConfig(config))
        )
      )
    );
  });

  public readonly config = this.#state.signal('config');
}
