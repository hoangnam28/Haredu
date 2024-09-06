/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, TemplateRef } from '@angular/core';
import { TranslateService } from './translate.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { IToastOptions } from '#interfaces/index';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastTemplate: TemplateRef<any>;
  private icClose: TemplateRef<any>;
  constructor(
    private nzNotificationService: NzNotificationService,
    private translateService: TranslateService,
  ) {}

  public initTemplate(toastRef: TemplateRef<any>, iconClose: TemplateRef<any>): void {
    this.toastTemplate = toastRef;
    this.icClose = iconClose;
  }

  toast(message: string, options?: IToastOptions) {
    const data = {
      message: options?.noTranslate ? message : this.translateService.translate(message),
      ...options,
    };

    this.nzNotificationService.template(this.toastTemplate, {
      nzData: data,
      nzPlacement: 'top',
      nzDuration: 3000,
      nzCloseIcon: this.icClose,
    });
  }

  success(message = 'toast.success-message', options?: Partial<IToastOptions>) {
    this.toast(message, { ...options, type: 'success', svgIcon: 'check-success' });
  }

  error(message = 'toast.error-message', options?: Partial<IToastOptions>) {
    this.toast(message, { ...options, type: 'error', svgIcon: 'check-error' });
  }

  warning(message = 'toast.warning-message', options?: Partial<IToastOptions>) {
    this.toast(message, { ...options, type: 'warning', svgIcon: 'check-warning' });
  }
}
