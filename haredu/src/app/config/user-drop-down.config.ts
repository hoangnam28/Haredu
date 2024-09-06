import { IUserDropDown } from '#interfaces/menu.interface';
import { USER_ROLE } from '#utils/const';

const Master: IUserDropDown[] = [
  {
    label: 'menubar.accountSetting',
    routerLink: '/users/profile/abc',
  },
];

const Admin: IUserDropDown[] = [];
const Student: IUserDropDown[] = [];
const Lecture: IUserDropDown[] = [];

export const MappingUserDropdownByRoles = {
  [USER_ROLE.ADMIN]: Master,
  [USER_ROLE.STAFF]: Admin,
  [USER_ROLE.STUDENT]: Student,
  [USER_ROLE.TUTOR]: Lecture,
};

export const MappingLinkByRoles = {
  [USER_ROLE.ADMIN]: '/admin/',
  [USER_ROLE.STAFF]: '/staff/',
  [USER_ROLE.STUDENT]: '/student/',
  [USER_ROLE.TUTOR]: '/lecture/',
};

export const MappingLinkAfterLoginByRoles = {
  [USER_ROLE.ADMIN]: 'admin/lecture-withdraw',
  [USER_ROLE.STAFF]: 'staff/information',
  [USER_ROLE.STUDENT]: 'homepage',
  [USER_ROLE.TUTOR]: 'homepage',
};
