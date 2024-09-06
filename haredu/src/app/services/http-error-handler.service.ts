/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { HttpException } from './../interfaces/exception.interface';
import { DialogService } from './dialog.service';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';

const DEFAULT_ERROR_MESSAGE = 'defaultErrorMessage';

export class UnauthenticatedException implements HttpException {
  code = '401';
  message = 'Unauthenticated';
}

@Injectable()
export class HttpErrorHandler {
  /**
   * HttpErrorHandler Constructor.
   */
  constructor(
    private dialogService: DialogService,
    private auth: AuthService,
    private toastService: ToastService,
  ) {}

  /**
   * Handle http request error.
   */
  public handle(response: HttpErrorResponse) {
    const body = this.parseJson(response.error);

    if (response.status === 401) {
      this.auth.endSession();
      requestAnimationFrame(() => this.dialogService.error('Session is expired'));
      return throwError(() => new UnauthenticatedException());
    }

    if (response.status === 403) {
      // this.dialogService.warning('message.no_permission');
    }

    let error: string = '';

    if (body) {
      const message: string | string[] | undefined = body.errors;

      error = this.getError(message);
      requestAnimationFrame(() => this.toastService.error(error || DEFAULT_ERROR_MESSAGE));
    }

    return throwError(() => new Error(error));
  }

  /**
   * Parse JSON without throwing errors.
   */
  private parseJson(json: string): { errors?: string; isShowErrorToast?: string } {
    if (typeof json !== 'string') {
      return json;
    }

    try {
      return JSON.parse(json);
    } catch (e) {
      return {};
    }
  }

  private getError(errors: string | string[] | undefined): string {
    if (typeof errors === 'string' || !errors) {
      return errors || '';
    }

    let err = '';
    Array(...errors).forEach((e: string) => {
      err += e + '\n';
    });

    return err;
  }
}
