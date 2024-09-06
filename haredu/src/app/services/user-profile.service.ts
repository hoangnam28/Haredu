// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LocalStorageKey, USER_ROLE } from '#utils/const';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { IAccount } from '#interfaces/account.interface';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  constructor(private storageService: StorageService) {}

  set currentUser(user: IAccount | null) {
    if (user) {
      this.storageService.set(LocalStorageKey.currentUser, JSON.stringify(user));
    } else {
      this.storageService.unset(LocalStorageKey.currentUser);
    }
  }

  get currentUser(): IAccount {
    try {
      return JSON.parse(this.storageService.get(LocalStorageKey.currentUser) || '{}');
    } catch (error) {
      return JSON.parse('{}');
    }
  }
}
