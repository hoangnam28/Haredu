import { DIALOG } from '#utils/const';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent implements AfterViewInit {
  DIALOG = DIALOG;

  mapIcon = {
    [DIALOG.CONFIRM]: 'confirm',
    [DIALOG.ERROR]: 'error',
    [DIALOG.INFO]: 'info',
    [DIALOG.WARNING]: 'warning',
    [DIALOG.INFO_WITHOUT_ICON]: '',
    [DIALOG.CONFIRM_WITHOUT_ICON]: '',
  };

  readonly modal = inject(NzModalRef);
  readonly props = inject(NZ_MODAL_DATA);
  readonly cdr = inject(ChangeDetectorRef);

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  onOk() {
    this.props.onOk && this.props.onOk();
    this.modal.close(true);
  }

  onCancel() {
    this.props.onCancel && this.props.onCancel();
    this.modal.close(false);
  }

  get message(): string {
    return this.props.message || '';
  }

  get type(): DIALOG {
    return this.props.type ?? DIALOG.INFO;
  }

  get okText(): string {
    return this.props.nzOkText || 'common.ok';
  }

  get icon(): string {
    return this.mapIcon[this.type];
  }

  get cancelText(): string {
    return this.props.nzCancelText || 'common.cancel';
  }
}
