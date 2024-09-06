import { INgSubmit, IResponse, ISubscribeOption } from '#interfaces/index';
import { ComponentService } from '#services/component.service';
import { DialogService } from '#services/dialog.service';
import { LoadingService } from '#services/loading.service';
import { WebsocketService } from '#services/socket-gateway.service';
import { ToastService } from '#services/toast.service';
import { TranslateService } from '#services/translate.service';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject, debounceTime, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private session$: Subject<void>;
  formGroup: FormGroup;
  constructor(protected service: ComponentService) {}

  ngOnDestroy(): void {
    this.preDestroy();
    this.doDestroy();
  }

  protected getControl(controlName: string): FormControl<unknown> | null {
    return this.formGroup.get(controlName) as FormControl;
  }

  protected onFormChange<T>(): Observable<T> {
    return this.formGroup.valueChanges.pipe(debounceTime(100));
  }

  protected formValue<T>(): T {
    return this.formGroup.getRawValue();
  }

  protected get translate(): TranslateService {
    return this.service.translate;
  }

  protected get router() {
    return this.service.router;
  }

  protected get queryParams() {
    return new URLSearchParams(window.location.search);
  }

  protected get dialogService(): DialogService {
    return this.service.dialog;
  }

  protected get toastService(): ToastService {
    return this.service.toast;
  }

  protected get loadingService(): LoadingService {
    return this.service.loading;
  }

  protected get socket(): WebsocketService {
    return this.service.socket;
  }

  protected async redirect(path: string | string[], queryParams?: { [key: string]: string }, replaceUrl = false) {
    const commands = path instanceof Array ? path : [path];
    await this.router.navigate(commands, { queryParams, replaceUrl });
  }

  protected subscribeOnce<T>(observable$: Observable<T>, options?: ISubscribeOption<T>) {
    return observable$.pipe(take(1)).subscribe({
      next: options?.onSuccess,
      error: options?.onError,
      complete: options?.onComplete,
    });
  }

  protected subscribeUntilDestroy<T>(
    observable$: Observable<T>,
    onSuccess: (data: T) => void,
    onError?: (data: T) => void,
  ) {
    return observable$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value) => onSuccess(value),
      error: (err) => onError && onError(err),
    });
  }

  protected preDestroy() {
    /**
     * Overwrite fnc from extends component
     */
  }

  private doDestroy() {
    if (this.session$ && !this.session$.closed) {
      this.session$.next();
      this.session$.complete();
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  ngSubmit<T>({ observable, onSuccess, onError }: INgSubmit<IResponse<T>>) {
    if (this.formGroup.valid) {
      this.subscribeOnce(observable, { onSuccess, onError });
      return;
    }

    Object.values(this.formGroup.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity();
      }
    });
  }

  convertToDatetime(data: any) {
    if (data) {
      const date = new Date(data);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const hh = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      const ss = String(date.getSeconds()).padStart(2, '0');
      data = `${hh}:${min}:${ss} ${dd}-${mm}-${yyyy} `;
    }
    return data;
  }

  convertToDate(data: any) {
    if (data) {
      const date = new Date(data);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      data = `${dd}-${mm}-${yyyy}`;
    }
    return data;
  }
}
