import { Injectable } from '@angular/core';
import { Repository } from './repository';
import { AppHttpClient } from '#services/app-http-client.service';
import { Observable, map } from 'rxjs';
import { IResponse } from '#interfaces/index';
import { BaseQueryRequest, BaseResponseRecords } from '#interfaces/api.interface';
import {
  IClassroom,
  ICreateClassroom,
  ICreateManySlot,
  ICreateRoom,
  ICreateSlot,
  ISlot,
  ISlotHasClass,
} from '#interfaces/class.interface';
import { IRoom } from '#interfaces/meeting.interface';

@Injectable()
export class ClassroomRepository extends Repository {
  constructor(httpClient: AppHttpClient) {
    super(httpClient);
  }

  getAllMyClass(params: BaseQueryRequest) {
    return this.httpClient
      .get<BaseResponseRecords<IClassroom>>('/classrooms/my-classes', params)
      .pipe(map((res) => res.data));
  }

  getAllClasses(params: BaseQueryRequest) {
    return this.httpClient.get<BaseResponseRecords<IClassroom>>('/classrooms', params).pipe(map((res) => res.data));
  }

  getAllSlots(params: BaseQueryRequest) {
    return this.httpClient.get<ISlotHasClass[]>('/classrooms/all-slots', params);
  }

  getAllMySlots(params: BaseQueryRequest) {
    return this.httpClient.get<ISlotHasClass[]>('/classrooms/all-my-slots', params);
  }

  createClass(data: ICreateClassroom): Observable<IResponse<IClassroom>> {
    return this.httpClient.post('/classrooms', data);
  }

  getClassById(id: string): Observable<IResponse<IClassroom>> {
    return this.httpClient.get(`/classrooms/${id}`);
  }

  joinClass(classId: string): Observable<IResponse<IClassroom>> {
    return this.httpClient.patch(`/classrooms/join/${classId}`);
  }

  createSlot(data: ICreateSlot) {
    return this.httpClient.post('/slots', data);
  }

  getSlots(classId: string, params: BaseQueryRequest) {
    return this.httpClient.get<BaseResponseRecords<ISlot>>(`/slots/${classId}`, params);
  }

  getSlotById(id: string): Observable<IResponse<ISlot>> {
    return this.httpClient.get(`/slots/detail/${id}`);
  }

  createNewChannel(slotId: string): Observable<IResponse<string>> {
    return this.httpClient.get(`/agore/token/${slotId}`);
  }

  setUid(slotId: string, uid: string) {
    return this.httpClient.post(`/agore/uid/${slotId}`, { uid });
  }

  getRoomBySlotId(slotId: string) {
    return this.httpClient.get(`/rooms/${slotId}`);
  }

  createRoom(data: ICreateRoom) {
    return this.httpClient.post('/rooms', data);
  }

  getRoomById(roomId: string) {
    return this.httpClient.get<IRoom>(`/rooms/${roomId}`);
  }

  createManySlot(data: ICreateManySlot) {
    return this.httpClient.post('/slots/create-many', data);
  }

  deleteClass(id: string) {
    return this.httpClient.delete(`/classrooms/${id}`);
  }

  withDrawMoneyFromClass(classroomId: string) {
    return this.httpClient.post(`/classrooms/with-draw-money/${classroomId}`);
  }
}
