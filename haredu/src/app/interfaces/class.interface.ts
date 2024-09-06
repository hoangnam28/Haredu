import { USER_ROLE } from '#utils/const';
import { IAccount, IFiled } from './account.interface';

export interface IClass {
  image: string;
  teachingFileds: IFiled[];
  className: string;
  timeStart: Date;
  user: IAccount;
}

export interface IClassroom {
  _id: string;
  name: string;
  thumbnail?: IGallery;
  banner?: IGallery;
  description: string;
  startTime: Date;
  endTime: Date;
  lecture: IAccount;
  students: IAccount[];
  teachFileds?: IFiled[];
  isActive?: boolean;
  status?: boolean;
  price: number;
}

export interface IGallery {
  userId: string;
  imageUrl: string;
  role: USER_ROLE;
}

export interface ISlot {
  _id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  meetingId?: string;
  mainVideo?: string;
  subVideo?: string[];
  status?: boolean;
  classroomId: string;
  uid: string;
}

export interface ISlotHasClass {
  _id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  meetingId?: string;
  mainVideo?: string;
  subVideo?: string[];
  status?: boolean;
  classroomId: IClassroom;
  uid: string;
}

export interface ICreateClassroom {
  name: string;
  thumbnail: string;
  banner: string;
  description: string;
  startTime: Date;
  endTime: Date;
  teachFileds: string[];
  price: number;
}

export interface ICreateSlot {
  classroomId: string;
  description: string;
  title: string;
  startTime: Date;
  endTime: Date;
}

export interface ICreateManySlot {
  slots: ICreateSlot[];
  classroomId: string;
}

export interface ICreateRoom {
  slotId: string;
}

export interface IMember {
  userId: string;
  isHost: boolean;
}
