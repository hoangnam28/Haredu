import { IAccount } from './account.interface';

export interface ITransaction {
  userId: IAccount;
  changeBalance: number;
  changeState: boolean;
  reason: string;
}

export interface IQrCodeBank {
  accountNo: string;
  accountName: string;
  acqId: string;
  amount: number;
  addInfo: string;
  format?: string;
  template: string;
}

export interface IBankRes {
  accountName: string;
  accountNumber: string;
  bin: string;
  shortName: string;
}
