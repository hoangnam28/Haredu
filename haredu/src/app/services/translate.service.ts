import { Injectable } from '@angular/core';
import { HashMap, TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  constructor(public translocoService: TranslocoService) {}

  translate(message: string, data?: HashMap): string {
    return this.translocoService.translate(message, data);
  }

  translateObject(message: string, data?: HashMap): string {
    return this.translocoService.translateObject(message, data);
  }
}
