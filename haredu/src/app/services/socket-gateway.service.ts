import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseSocketService } from './socket.service';
import { ISocketResponse } from '#interfaces/index';
import { IDummy } from '#interfaces/index';
import { SOCKET_SCREEN_ACTION } from '#utils/const';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  constructor(private socket: BaseSocketService) {}

  sendMessage(action: SOCKET_SCREEN_ACTION, payload?: IDummy) {
    this.socket.emit(action, { payload });
  }

  getMessage<T>(event: SOCKET_SCREEN_ACTION): Observable<ISocketResponse<T>> {
    return this.socket.fromEvent(event);
  }

  getMessage2<T>(event: string): Observable<ISocketResponse<T>> {
    return this.socket.fromEvent(event);
  }
}
