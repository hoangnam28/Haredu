import { Injectable } from '@angular/core';
import { Repository } from './repository';
import { AppHttpClient } from '#services/app-http-client.service';
import { Observable, map } from 'rxjs';
import { IResponse } from '#interfaces/index';
import { ICreateDemo, IDemo } from '#interfaces/demo.interface';
import { BaseQueryRequest, BaseResponseRecords } from '#interfaces/api.interface';

@Injectable()
export class DemoRepository extends Repository {
  constructor(httpClient: AppHttpClient) {
    super(httpClient);
  }

  createDemo(data: ICreateDemo): Observable<IResponse<IDemo>> {
    return this.httpClient.post('/demo', data);
  }

  getAllDemo(params: BaseQueryRequest) {
    return this.httpClient.get<BaseResponseRecords<IDemo>>('/demo', params).pipe(map((res) => res.data));
  }
}
