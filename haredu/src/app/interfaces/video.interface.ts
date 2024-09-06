import { IAccount, IFiled } from './account.interface';

export interface IVideo {
  title: string;
  description: string;
  image: string;
  teachingFileds: IFiled[];
  user: IAccount;
  createdAt: Date;
  url: string;
  duration: number;
}
