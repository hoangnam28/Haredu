export interface IUserJoinedPayload {
  userId: string;
  roomId: string;
  userName: string;
  id: string;
  isHost: boolean;
  room: IRoom;
}

export interface IMember {
  userId: string;
  isHost: boolean;
  clientId: string;
  userName: string;
}

export interface IRoom {
  slotId: string;
  status: boolean;
  members: IMember[];
}

export interface IMessPayload {
  userName: string;
  userId: string;
  message: string;
  roomId: string;
}

export interface ISignalPayload {
  userId: string;
  userName: string;
  from: string;
  signal: any;
  isHost: boolean;
}

export interface IUserLeftPayload {
  id: string;
  room: IRoom;
  userLeft: string;
}
