import { ITableConfig } from '#interfaces/table.interface';

export const tableUser: ITableConfig[] = [
  {
    title: 'common.table.header.email',
    key: 'email',
    width: '140px',
    sort: true,
  },
  {
    title: 'common.table.header.name',
    key: 'name',
    width: '140px',
    sort: true,
  },
  {
    title: 'common.table.header.phone',
    key: 'phone',
    width: '100px',
    sort: false,
  },
  {
    title: 'common.table.header.role',
    key: 'role',
    width: '100px',
    sort: false,
  },
  {
    title: 'common.table.header.status',
    key: 'isActive',
    width: '100px',
    sort: false,
  },
  {
    title: 'common.table.header.action',
    key: 'action',
    width: '100px',
    sort: false,
  },
];

export const tableDemo: ITableConfig[] = [
  {
    title: 'common.table.header.name',
    key: 'name',
    width: '140px',
    sort: true,
  },
  {
    title: 'common.table.header.phone',
    key: 'phone',
    width: '100px',
    sort: false,
  },
  {
    title: 'common.table.header.status',
    key: 'isActive',
    width: '100px',
    sort: false,
  },
  {
    title: 'common.table.header.action',
    key: 'action',
    width: '100px',
    sort: false,
  },
];

export const transactionHistory: ITableConfig[] = [
  {
    title: 'common.table.header.excutionTime',
    key: 'excutionTime',
    width: '100px',
    sort: false,
  },
  {
    title: 'common.table.header.moneyExcution',
    key: 'moneyExcution',
    width: '100px',
    sort: false,
  },
  {
    title: 'common.table.header.moneyAfterExcution',
    key: 'moneyAfterExcution',
    width: '100px',
    sort: false,
  },
  {
    title: 'common.table.header.reasonExcution',
    key: 'reasonExcution',
    width: '150px',
    sort: false,
  },
  {
    title: 'common.table.header.status',
    key: 'status',
    width: '80px',
    sort: false,
  },
];

export const lectureWithdrawHistory: ITableConfig[] = [
  {
    title: 'common.table.header.excutionTime',
    key: 'excutionTime',
    width: '100px',
    sort: false,
  },
  {
    title: 'common.table.header.moneyExcution',
    key: 'moneyExcution',
    width: '100px',
    sort: false,
  },
  {
    title: 'common.table.header.moneyMustPay',
    key: 'moneyMustPay',
    width: '100px',
    sort: false,
  },
  {
    title: 'common.table.header.reasonExcution',
    key: 'reasonExcution',
    width: '150px',
    sort: false,
  },
  {
    title: 'common.table.header.status',
    key: 'status',
    width: '80px',
    sort: false,
  },
  {
    title: 'common.table.header.action',
    key: 'action',
    width: '80px',
    sort: false,
  },
];

export const lectureRegistration: ITableConfig[] = [
  {
    title: 'common.table.header.registrationTime',
    key: 'registrationTime',
    width: '50px',
    sort: false,
  },
  {
    title: 'common.table.header.phone',
    key: 'phone',
    width: '100px',
    sort: false,
  },
  {
    title: 'common.table.header.name',
    key: 'name',
    width: '100px',
    sort: false,
  },
  {
    title: 'common.table.header.action',
    key: 'action',
    width: '80px',
    sort: false,
  },
];

export const lectureUpdate: ITableConfig[] = [
  {
    title: 'common.table.header.updateTime',
    key: 'registrationTime',
    width: '50px',
    sort: false,
  },
  {
    title: 'common.table.header.phone',
    key: 'phone',
    width: '100px',
    sort: false,
  },
  {
    title: 'common.table.header.name',
    key: 'name',
    width: '100px',
    sort: false,
  },
  {
    title: 'common.table.header.action',
    key: 'action',
    width: '80px',
    sort: false,
  },
];

export const manageAricle: ITableConfig[] = [
  {
    title: 'common.table.header.postingTime',
    key: 'registrationTime',
    width: '50px',
    sort: false,
  },
  {
    title: 'common.table.header.poster',
    key: 'name',
    width: '100px',
    sort: false,
  },
  {
    title: 'common.table.header.role',
    key: 'role',
    width: '100px',
    sort: false,
  },
  {
    title: 'common.table.header.action',
    key: 'action',
    width: '80px',
    sort: false,
  },
];

export const manageReport: ITableConfig[] = [
  {
    title: 'common.table.header.reportTime',
    key: 'registrationTime',
    width: '100px',
    sort: false,
  },
  {
    title: 'common.table.header.courseName',
    key: 'courseName',
    width: '140px',
    sort: false,
  },
  {
    title: 'common.table.header.slot',
    key: 'slot',
    width: '100px',
    sort: false,
  },
  {
    title: 'common.table.header.reporter',
    key: 'reporter',
    width: '100px',
    sort: false,
  },
  {
    title: 'common.table.header.accusedPerson',
    key: 'accusedPerson',
    width: '100px',
    sort: false,
  },
  {
    title: 'common.table.header.reportContent',
    key: 'reportContent',
    width: '100px',
    sort: false,
  },
  {
    title: 'common.table.header.status',
    key: 'status',
    width: '100px',
    sort: false,
  },
  {
    title: 'common.table.header.action',
    key: 'action',
    width: '80px',
    sort: false,
  },
];

export const classPeople: ITableConfig[] = [
  {
    title: 'Join time',
    key: 'createdAt',
    width: '50px',
    sort: false,
  },
  {
    title: 'common.table.header.phone',
    key: 'phone',
    width: '100px',
    sort: false,
  },
  {
    title: 'common.table.header.name',
    key: 'name',
    width: '100px',
    sort: false,
  },
];

export const TABLE_CONFIG = {
  TABLE_USER: tableUser,
  TABLE_DEMO: tableDemo,
  TABLE_TRANSACTION_HISTORY: transactionHistory,
  TABLE_LECTURE_WITHDRAW: lectureWithdrawHistory,
  TABLE_LECTURE_REGISTRATION: lectureRegistration,
  TABLE_LECTURE_UPDATE: lectureUpdate,
  TABLE_MANAGE_ARTICLE: manageAricle,
  TABLE_MANAGE_REPORT: manageReport,
  TABLE_CLASS_PEOPLE: classPeople,
};
