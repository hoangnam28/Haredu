import { AppHttpClient } from '#services/app-http-client.service';
import { Injectable } from '@angular/core';

@Injectable()
export class Repository {
  constructor(protected httpClient: AppHttpClient) {}
}
