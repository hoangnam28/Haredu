import { Injectable } from '@angular/core';
import { Repository } from './repository';
import { AppHttpClient } from '#services/app-http-client.service';
import { IAccount, IChangePassword, IFiled, ILoginRequest, ILoginResponse } from '#interfaces/account.interface';
import { Observable, map } from 'rxjs';
import { IResponse } from '#interfaces/index';
import { BaseQueryRequest, BaseResponseRecords } from '#interfaces/api.interface';
import { IBankRes, IQrCodeBank, ITransaction } from '#interfaces/transaction.interface';

@Injectable()
export class UserRepository extends Repository {
  constructor(httpClient: AppHttpClient) {
    super(httpClient);
  }

  login(data: ILoginRequest): Observable<IResponse<ILoginResponse>> {
    return this.httpClient.post('/auth/login', data);
  }

  changePassword(data: IChangePassword): Observable<IResponse<ILoginResponse>> {
    return this.httpClient.post('/auth/change-password', data);
  }

  forgotPassword(email: string): Observable<IResponse<boolean>> {
    return this.httpClient.post('/auth/forgot-password', { email });
  }

  getMe(): Observable<IResponse<IAccount>> {
    return this.httpClient.get('/user/get-me');
  }

  getAllUser(params: BaseQueryRequest) {
    return this.httpClient.get<BaseResponseRecords<IAccount>>('/user', params).pipe(map((res) => res.data));
  }

  getOneUser(slug: string) {
    return this.httpClient.get<any>(`/user/${slug}`).pipe(map((res) => res.data));
  }

  getOwnUser() {
    return this.httpClient.get<any>(`/user`).pipe(map((res) => res.data));
  }

  getFields(params: BaseQueryRequest) {
    return this.httpClient.get<any>('/fields', params).pipe(map((res) => res.data));
  }

  update(data: any) {
    return this.httpClient.patch('/user/update', data);
  }

  getBalance() {
    return this.httpClient.get('/user/wallet/get-balance').pipe(map((res) => res.data));
  }

  updateBank(data: any) {
    return this.httpClient.post('/user/wallet/update-bank', data).pipe(map((res) => res.data));
  }

  getTransactionHistory() {
    return this.httpClient.get('/user/wallet/transaction-history').pipe(map((res) => res.data));
  }

  userChangePasswords(data: any) {
    return this.httpClient.patch('/user/change-password', data).pipe(map((res) => res.data));
  }

  getAllTransaction(params: BaseQueryRequest) {
    return this.httpClient.get<BaseResponseRecords<ITransaction>>('/transaction', params).pipe(map((res) => res.data));
  }

  getAllLectureWithdraw(params: BaseQueryRequest) {
    return this.httpClient
      .get<BaseResponseRecords<ITransaction>>('/transaction/lecture-withdraw', params)
      .pipe(map((res) => res.data));
  }

  withDrawMoney(data: { money: number; password: string }) {
    return this.httpClient.post('/user/with-draw-money', data);
  }

  getTutorNeedVerify() {
    return this.httpClient.get<any>('/user/tutor-need-verify').pipe(map((res) => res.data));
  }

  updateTutorNeedVerify(data: any) {
    return this.httpClient.patch<any>('/user/update-tutor-need-verify', data).pipe(map((res) => res.data));
  }

  getTutor(userId: string): Observable<IResponse<{ bank: IBankRes }>> {
    return this.httpClient.get(`/user/get-tutor/${userId}`);
  }

  rejectTrans(tranId: string, reason: string) {
    return this.httpClient.post(`/transaction/reject/${tranId}`, { reasonReject: reason });
  }

  confirmTrans(userId: string, tranId: string, proof: string, amount: number) {
    return this.httpClient.post(`/transaction/confirm/${tranId}`, { proof, amount, userId });
  }

  subscribes(data: { owner: string; subscriber: string }) {
    return this.httpClient.post('/subscribes', data);
  }

  getSubscribes(owner: string) {
    return this.httpClient.get<{ _id: string }>(`/subscribes/${owner}`);
  }

  unSubscribes(subId: string) {
    return this.httpClient.delete(`/subscribes/${subId}`);
  }
}
