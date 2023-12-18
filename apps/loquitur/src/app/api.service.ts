import { Injectable, inject } from '@angular/core';
import { AppService } from './app.service';
import { Config } from '@loquitur/commons';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private appService = inject(AppService);
  private trpc = this.appService.getTrpcConfig();

  public setConfig(config: Config) {
    return from(this.trpc.setConfig.mutate(config));
  }
}
