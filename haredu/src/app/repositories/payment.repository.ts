import { Injectable } from '@angular/core';
import { Repository } from './repository';
import { AppHttpClient } from '#services/app-http-client.service';
import { Observable } from 'rxjs';
import { IResponse } from '#interfaces/index';

@Injectable()
export class PaymentRepository extends Repository {
  constructor(httpClient: AppHttpClient) {
    super(httpClient);
  }

  createPayment(amount: number): Observable<IResponse<{ paymentLink: string }>> {
    return this.httpClient.post('/payment', { amount });
  }

  confirm(token: string): Observable<IResponse<string>> {
    return this.httpClient.post('/payment/confirm/', { token });
  }
}
