import { Injectable, Type } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from './translate.service';
import { IDialogOption } from '#interfaces/index';
import { DialogComponent } from '#components/core/dialog/dialog.component';
import { DIALOG } from '#utils/const';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(
    private modal: NzModalService,
    private trans: TranslateService,
  ) {}

  info(message: string, props?: IDialogOption): NzModalRef<DialogComponent> {
    return this.modal.create({
      nzContent: DialogComponent,
      nzCentered: true,
      nzClosable: false,
      nzData: {
        message,
        ...props,
        type: DIALOG.INFO,
        nzOkText: props?.okText,
        nzCancelText: props?.cancelText,
        onOk: props?.onOk,
        onCancel: props?.onCancel,
      },
    });
  }

  error(message: string, props?: IDialogOption): NzModalRef<DialogComponent> {
    return this.modal.create({
      nzContent: DialogComponent,
      nzCentered: true,
      nzClosable: false,
      nzNoAnimation: true,
      nzData: {
        message,
        ...props,
        type: DIALOG.ERROR,
        nzOkText: props?.okText,
        nzCancelText: props?.cancelText,
        onOk: props?.onOk,
        onCancel: props?.onCancel,
      },
    });
  }

  warning(message: string, props?: IDialogOption): NzModalRef<DialogComponent> {
    return this.modal.create({
      nzContent: DialogComponent,
      nzCentered: true,
      nzClosable: true,
      nzNoAnimation: true,
      nzData: {
        message,
        ...props,
        type: DIALOG.WARNING,
        nzOkText: props?.okText,
        nzCancelText: props?.cancelText,
        onOk: props?.onOk,
        onCancel: props?.onCancel,
      },
    });
  }

  confirm(message: string, props?: IDialogOption): NzModalRef<DialogComponent> {
    return this.modal.create({
      nzContent: DialogComponent,
      nzCentered: true,
      nzClosable: true,
      nzNoAnimation: true,
      nzData: {
        message,
        ...props,
        title: props?.title || 'confirm.title',
        type: DIALOG.CONFIRM,
        nzOkText: props?.okText || 'common.confirm',
        nzCancelText: props?.cancelText || 'common.cancel',
        onOk: props?.onOk,
        onCancel: props?.onCancel,
      },
    });
  }

  confirmWithoutIcon(
    title: string = 'confirm.title',
    message: string,
    props?: IDialogOption,
  ): NzModalRef<DialogComponent> {
    return this.modal.create({
      nzContent: DialogComponent,
      nzCentered: true,
      nzClosable: true,
      nzNoAnimation: true,
      nzTitle: this.trans.translate(title),
      nzData: {
        message,
        ...props,
        type: DIALOG.CONFIRM_WITHOUT_ICON,
        nzOkText: props?.okText,
        nzCancelText: props?.cancelText,
        onOk: props?.onOk,
        onCancel: props?.onCancel,
      },
    });
  }

  infoWithoutIcon(title: string, message: string, props?: IDialogOption): NzModalRef<DialogComponent> {
    return this.modal.create({
      nzContent: DialogComponent,
      nzCentered: true,
      nzClosable: true,
      nzNoAnimation: true,
      nzTitle: this.trans.translate(title),
      nzData: {
        message,
        ...props,
        type: DIALOG.INFO_WITHOUT_ICON,
        nzOkText: props?.okText,
        nzCancelText: props?.cancelText,
        onOk: props?.onOk,
        onCancel: props?.onCancel,
      },
    });
  }

  open<T>(component: Type<T>, props?: IDialogOption) {
    return this.modal.create({
      nzContent: component,
      nzCentered: true,
      nzClosable: props?.closable,
      nzBodyStyle: props?.style,
      nzFooter: props?.footer,
      nzNoAnimation: true,
      nzMaskClosable: props?.closeOutSizeOrESC ?? true,
      nzClassName: props?.className,
      nzKeyboard: props?.closeOutSizeOrESC ?? true,
      nzTitle: props?.title,
      nzWidth: props?.width,
      nzData: {
        ...props,
        ...props?.data,
        nzOkText: props?.okText,
        nzCancelText: props?.cancelText,
        onOk: props?.onOk,
        onCancel: props?.onCancel,
      },
    });
  }

  closeAll() {
    return this.modal.closeAll();
  }
}
