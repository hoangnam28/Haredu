import { IAccount } from './account.interface';

export interface IGallery {
  _id: string;
  url: string;
}

export interface IComment {
  user: IAccount;
  like: number;
  content: string;
  replyComment?: IComment[];
}

export interface IPostCard {
  user: IAccount;
  content: string;
  images: IGallery[];
  like: number;
  share: number;
  comment: IComment[];
  createdAt: Date;
}
