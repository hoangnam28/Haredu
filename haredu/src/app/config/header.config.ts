import { IMenu } from '#interfaces/menu.interface';
import { USER_ROLE } from '#utils/const';

export const Master: IMenu[] = [];
export const Staff: IMenu[] = [];
export const Student: IMenu[] = [
  { routerLink: 'posts', label: 'menubar.post' },
  { routerLink: 'videos', label: 'menubar.video' },
  { routerLink: 'classes-open', label: 'menubar.classesOpen' },
];
export const Lecture: IMenu[] = [
  { routerLink: 'posts', label: 'menubar.post' },
  { routerLink: 'videos', label: 'menubar.video' },
  { routerLink: 'classes-open', label: 'menubar.classesOpen' },
];

export const MappingHeaderByRoles = {
  [USER_ROLE.ADMIN]: Master,
  [USER_ROLE.STAFF]: Staff,
  [USER_ROLE.STUDENT]: Student,
  [USER_ROLE.TUTOR]: Lecture,
};
