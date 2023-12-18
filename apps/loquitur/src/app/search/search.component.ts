import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { switchMap } from 'rxjs';
import { AppService } from '../app.service';
import { MatDividerModule } from '@angular/material/divider';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'loqui-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDividerModule, RouterModule],
})
export class SearchComponent {
  constructor(private route: ActivatedRoute, private appService: AppService) {}

  public result = toSignal(
    this.route.queryParamMap.pipe(
      switchMap((params) => {
        const query = params.get('query') ?? '';

        return this.appService.search(query);
      })
    )
  );
}
