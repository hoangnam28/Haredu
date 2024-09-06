import { Injectable } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

@Injectable({
  providedIn: 'root',
})
export class ClipBoardService {
  constructor(private clipboard: Clipboard) {}

  copy(value: string) {
    this.clipboard.copy(value);
  }
}
