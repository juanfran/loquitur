import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    ReactiveFormsModule,
    NgOptimizedImage,
  ],
  selector: 'loqui-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  public form = new FormControl();

  constructor(private router: Router, private route: ActivatedRoute) {}

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
}
