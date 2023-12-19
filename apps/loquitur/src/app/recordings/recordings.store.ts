import { Injectable, inject } from '@angular/core';
import { Config, Recording } from '@loquitur/commons';
import { rxState } from '@rx-angular/state';

import { rxActions } from '@rx-angular/state/actions';
import { ApiService } from '../api.service';

interface RecordingState {
  recordings: Recording[];
}

const initialState: RecordingState = {
  recordings: [],
};

@Injectable({
  providedIn: 'root',
})
export class RecordingsStore {
  #apiService = inject(ApiService);

  actions = rxActions<{
    setConfig: Partial<Config>;
  }>();

  #state = rxState<RecordingState>(({ set, connect }) => {
    set(initialState);

    connect('recordings', this.#apiService.getRecordings());
  });

  public readonly recordings = this.#state.signal('recordings');
}
