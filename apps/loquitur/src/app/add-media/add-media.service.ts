import { Injectable, inject } from '@angular/core';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { ApiService } from '../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AddMediaService {
  #apiService = inject(ApiService);
  #snackBar = inject(MatSnackBar);

  uploadMedia = injectMutation(() => ({
    mutationFn: (files: File[]) =>
      lastValueFrom(this.#apiService.uploadMedia(files)),

    onSuccess: () => {
      this.#snackBar.open('Upload success', 'Close', {
        duration: 3000,
      });
    },
  }));
}
