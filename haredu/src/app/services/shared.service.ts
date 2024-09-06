import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private _isCollapsed = new BehaviorSubject<boolean>(false);
  isCollapsed = this._isCollapsed.asObservable();
  constructor() {}

  public setIsCollapsed(_isCollapsed: boolean) {
    this._isCollapsed.next(_isCollapsed);
  }
}
