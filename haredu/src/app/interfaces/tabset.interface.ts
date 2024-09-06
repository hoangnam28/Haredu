import { NzTabPosition } from 'ng-zorro-antd/tabs';

export interface ITabSet {
  nzTabPosition?: NzTabPosition;
  items: ITab[];
}

export interface ITab {
  title: string;
  disabled?: boolean;
}
