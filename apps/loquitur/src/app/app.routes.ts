import { Route } from '@angular/router';
import { RecordingsComponent } from './recordings/recordings.component';
import { RecordComponent } from './record/record.component';
import { SearchComponent } from './search/search.component';

export const appRoutes: Route[] = [
  { path: '', component: RecordingsComponent },
  { path: 'record/:id', component: RecordComponent },
  { path: 'search', component: SearchComponent },
];
