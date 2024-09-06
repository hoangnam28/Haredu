import { STRING } from '#utils/const';
import { getCookie } from '#utils/cookie.helper';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BaseSocketService extends Socket {
  constructor() {
    super({ url: environment.socketUrl, options: { autoConnect: false } });
    const token = getCookie(STRING.ACCESS_TOKEN);
    this.ioSocket.auth = { token };
  }

  connectSocket() {
    const token = getCookie(STRING.ACCESS_TOKEN);
    if (token) {
      this.ioSocket.auth = { token };
      this.connect();
    }
  }
}
