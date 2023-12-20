import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./recordings/recordings.component').then(
        (m) => m.RecordingsComponent
      ),
  },
  {
    path: 'record/:id',
    loadComponent: () =>
      import('./record/record.component').then((m) => m.RecordComponent),
  },
];
