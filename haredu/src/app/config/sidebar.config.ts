import { IAccount } from '#interfaces/account.interface';
import { IMenu } from '#interfaces/menu.interface';
import { USER_ROLE } from '#utils/const';

const Master: IMenu[] = [{ label: 'menubar.lectureWithdrawal', icon: 'bag', routerLink: '/admin/lecture-withdraw' }];

const Staff: IMenu[] = [
  { label: 'menubar.information', icon: 'home', routerLink: '/staff/information' },
  { label: 'menubar.reportManage', icon: 'check-warning', routerLink: '/staff/report-manage' },
  { label: 'menubar.articleManage', icon: 'edit', routerLink: '/staff/article-manage' },
  { label: 'menubar.lectureRegistration', icon: 'group-user', routerLink: '/staff/lecture-registration' },
  { label: 'menubar.lectureUpdate', icon: 'user-circle', routerLink: '/staff/lecture-update' },
];

export const OWN_PROFILE_MEMU: (role: USER_ROLE) => IMenu[] = (role: USER_ROLE) => [
  {
    label: 'menubar.myAccount',
    icon: 'user-circle',
    children: [
      {
        label: 'menubar.profile',
        routerLink: '/users/profile',
      },
      {
        label: 'menubar.wallet',
        routerLink: '/users/wallet',
      },
      {
        label: 'menubar.transactionHistory',
        routerLink: '/users/transaction-history',
      },
      {
        label: 'menubar.changePassword',
        routerLink: '/users/change-password',
      },
      {
        label: 'My Video',
        routerLink: '/users/video-demo',
        hidden: role !== USER_ROLE.TUTOR,
      },
    ],
  },
  { label: 'menubar.classes', icon: 'home', routerLink: '/users/my-classes' },
  { label: 'menubar.mySchedule', matIcon: 'schedule', routerLink: '/users/my-schedule' },
  { label: 'menubar.information', matIcon: 'error', routerLink: '/users/information' },
  { label: 'menubar.penaltyCard', matIcon: 'sim_card', routerLink: '/users/penaltyCard' },
];

export const USER_PROFILE_MENU: (user: IAccount) => IMenu[] = (user: IAccount) => [
  {
    label: user.slug ?? '',
    icon: 'user-circle',
    children: [
      {
        label: 'menubar.profile',
        routerLink: '/users/profile/' + user.slug,
      },
      {
        label: 'Video',
        routerLink: '/users/video-demo/' + user.slug,
        hidden: user.role !== USER_ROLE.TUTOR,
      },
    ],
  },
  {
    label: 'menubar.classes',
    icon: 'home',
    routerLink: '/users/my-classes/' + user.slug,
    hidden: user.role !== USER_ROLE.TUTOR,
  },
  {
    label: 'menubar.information',
    matIcon: 'error',
    routerLink: '/users/information',
  },
  {
    label: 'menubar.penaltyCard',
    matIcon: 'sim_card',
    routerLink: '/users/penaltyCard',
  },
];

const Student: IMenu[] = [];

const Lecture: IMenu[] = [];

export const MappingMenuByRoles = {
  [USER_ROLE.ADMIN]: Master,
  [USER_ROLE.STAFF]: Staff,
  [USER_ROLE.STUDENT]: Student,
  [USER_ROLE.TUTOR]: Lecture,
};

export const MappingNameRoleByRoles = {
  [USER_ROLE.ADMIN]: 'Admin',
  [USER_ROLE.STAFF]: 'Staff',
  [USER_ROLE.STUDENT]: 'Student',
  [USER_ROLE.TUTOR]: 'Tutor',
};
