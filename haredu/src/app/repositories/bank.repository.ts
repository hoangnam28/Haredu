import { Injectable } from '@angular/core';
import { Repository } from './repository';
import { AppHttpClient } from '#services/app-http-client.service';
import { IAccount, IChangePassword, IFiled, ILoginRequest, ILoginResponse } from '#interfaces/account.interface';
import { Observable, map } from 'rxjs';
import { IResponse } from '#interfaces/index';
import { BaseQueryRequest, BaseResponseRecords } from '#interfaces/api.interface';
import { HttpClient } from '@angular/common/http';
import { IQrCodeBank } from '#interfaces/transaction.interface';

@Injectable()
export class BankRepository {
  constructor(private httpClient: HttpClient) {}

  getBanks() {
    return this.httpClient.get('https://api.vietqr.io/v2/banks').pipe(map((res: any) => res.data));
  }

  lookup(payload: any) {
    return this.httpClient
      .post('https://api.vietqr.io/v2/lookup', payload, {
        headers: {
          'x-client-id': 'b2a9ba3c-17fa-44f7-aacb-f3918f17178f',
          'x-api-key': 'aa4de2ab-536c-47d9-8bbb-556406ddb698',
          'Content-Type': 'application/json',
        },
      })
      .pipe(map((res: any) => res.data));
  }

  generateQrCode(data: IQrCodeBank) {
    return this.httpClient
      .post('https://api.vietqr.io/v2/generate', data, {
        headers: {
          'x-client-id': 'b2a9ba3c-17fa-44f7-aacb-f3918f17178f',
          'x-api-key': 'aa4de2ab-536c-47d9-8bbb-556406ddb698',
          'Content-Type': 'application/json',
        },
      })
      .pipe(map((res: any) => res.data));
  }
}
