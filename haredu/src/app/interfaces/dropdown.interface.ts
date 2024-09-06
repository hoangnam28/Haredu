export interface IDropdown {
  items: IDropdownItem[];
  isShowCheckbox?: boolean;
  key: string;
}

export interface IDropdownItem {
  title: string;
  value: string;
  checked?: boolean;
}
