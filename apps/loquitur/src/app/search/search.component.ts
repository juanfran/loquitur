import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  inject,
} from '@angular/core';
import { debounceTime, of, switchMap } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import type { SearchResult } from '@loquitur/commons';
import { ApiService } from '../api.service';
import { Router, RouterModule } from '@angular/router';
import type { FuseResult } from 'fuse.js';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'loqui-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDividerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    RouterModule,
  ],
})
export class SearchComponent {
  apiService = inject(ApiService);

  result: Signal<FuseResult<SearchResult>[]>;
  search = new FormControl('');
  dialogRef = inject(DialogRef);
  router = inject(Router);

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe(() => {
      this.dialogRef.close();
    });

    const search = this.search.valueChanges.pipe(
      debounceTime(200),
      takeUntilDestroyed(),
      switchMap((query) => {
        if (!query) {
          return of([]);
        }

        return this.apiService.search(query);
      })
    );

    this.result = toSignal(search, { initialValue: [] });
  }
}
