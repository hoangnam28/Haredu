import { USER_ROLE } from '#utils/const';

export interface IMenu {
  routerLink?: string;
  label: string;
  icon?: string;
  matIcon?: string;
  iconActive?: string;
  children?: IMenu[];
  role?: USER_ROLE[];
  class?: string;
  value?: string;
  isOpen?: boolean;
  isBlank?: boolean;
  hidden?: boolean;
}

export interface ICollapsePanel {
  id: string;
  image: string;
  title: string;
  style: { [key: string]: string };
  items: ICollapsePanelItem[];
  active: boolean;
}

export interface ICollapsePanelItem {
  header: string;
  body: string;
  url: string;
}

export interface IUserDropDown {
  label: string;
  routerLink?: string;
  icon?: string;
  class?: string;
  role?: USER_ROLE[];
}
