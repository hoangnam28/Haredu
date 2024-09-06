import { SOCKET_SCREEN_ACTION } from './../utils/const';
import { StyleObjectLike } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { ISelectOption } from './table.interface';

export interface IExport {
  id?: string[];
  isAll: boolean;
}

export interface IDummy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface ISocketResponse<T> {
  action: SOCKET_SCREEN_ACTION;
  payload: T;
}

export interface ISubscribeOption<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  onComplete?: () => void;
}

export interface IResponse<T> {
  code: number;
  success: boolean;
  message: string;
  errors: string;
  data: T;
}

export interface INgSubmit<T> {
  observable: Observable<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export interface IDialogOption {
  message?: string;
  onOk?: () => void;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
  className?: string;
  data?: IDummy;
  footer?: null | string;
  style?: StyleObjectLike;
  closeOutSizeOrESC?: boolean;
  eventName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onProcessWait?: Observable<any>;
  title?: string;
  closable?: boolean;
  width?: string | number;
}

export interface IBaseEntity {
  id: string;
  name: string;
}

export const ALL_OPTION: ISelectOption = {
  label: 'all',
  value: 'all',
};

export interface IBreadcrumbItem {
  label: string;
  url: string;
}

export interface ITimeStamp {
  createdAt: Date;
  updatedAt: Date;
}

export interface IToastOptions {
  type: string;
  svgIcon: string;
  noTranslate?: boolean;
  params?: { [key: string]: string };
}
