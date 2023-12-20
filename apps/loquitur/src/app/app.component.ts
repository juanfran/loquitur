import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SettingsComponent } from './settings/settings.component';
import { MatDialog } from '@angular/material/dialog';
import { AppStore } from './app.store';
import { AddMediaComponent } from './add-media/add-media.component';
import { SearchComponent } from './search/search.component';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    MatButtonModule,
  ],
  selector: 'loqui-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  public form = new FormControl();
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private appStore = inject(AppStore);

  readonly config = this.appStore.config;

  public ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.form.setValue(params.get('query'));
    });
  }

  public submit() {
    this.router.navigate(['search'], {
      queryParams: {
        query: this.form.value,
      },
    });
  }

  public openSearch() {
    this.dialog.open(SearchComponent, {
      width: '650px',
    });
  }

  public openSettings() {
    this.dialog.open(SettingsComponent, {
      width: '450px',
    });
  }

  public addMedia() {
    this.dialog.open(AddMediaComponent, {
      width: '650px',
    });
  }
}
