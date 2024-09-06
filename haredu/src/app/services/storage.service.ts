/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Injectable } from '@angular/core';

export class InmemoryStorage {
  data: { [key: string]: string } = {};

  setItem(key: string, data: { [key: string]: unknown }) {
    this.data[key] = String(data);
  }

  getItem(key: string) {
    return this.data[key] || null;
  }

  deleteItem(key: string) {
    delete this.data[key];
  }
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  prefix = 'comc_';
  localStorage: Storage;

  constructor() {
    this.localStorage = window.localStorage || new InmemoryStorage();
  }

  public set(key: string, data: string) {
    this.localStorage.setItem(this.generateKey(key), data);
  }

  public get(key: string) {
    return this.localStorage.getItem(this.generateKey(key));
  }

  public setSession(key: string, data: string) {
    sessionStorage.setItem(this.generateKey(key), data);
  }

  public getSession(key: string) {
    return sessionStorage.getItem(this.generateKey(key));
  }

  public unset(key: string) {
    this.localStorage.removeItem(this.generateKey(key));
  }

  private generateKey(key: string) {
    return this.prefix + '_' + key;
  }
}
