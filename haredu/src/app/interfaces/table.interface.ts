import { IDummy } from '#interfaces/index';
import { USER_ROLE } from '#utils/const';
import { SortTypeRequest } from './api.interface';

export interface ITableConfig {
  title: string;
  key: string;
  align?: 'center' | 'left' | 'right';
  width?: string;
  fixed?: boolean;
  sort?: boolean;
  roles?: USER_ROLE[];
}

export interface ITableItem extends IDummy {
  disabled?: boolean;
}

export interface ISelectOption {
  label: string;
  value: boolean | number | string | null;
}

export interface SearchQuery {
  sort: { key: string; value: SortTypeRequest } | undefined;
  pageIndex: number;
  pageSize: number;
}

export interface ICheckedList {
  checkAll: boolean;
  checkedList: ITableItem[];
}

export interface ICheckedData {
  checkAll: boolean;
  checkedPage: {
    [pageIndex: number]: boolean;
  };
}
