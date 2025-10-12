import { IUser } from "./user.model";

export interface FriendRequestResponse {
  data : {RequestId: string}
}


export interface IFriendRequest {
  _id: string;
  sendBy: string;
  sendTo: string;
  createdAt: string;  // ISO date string
  updatedAt: string;  // ISO date string
  acceptedAt: string;
  __v: number;
}

export interface SentFriendRequest {
  requestId: string;
  createdAt: string;
  receiver: IUser; // الشخص اللي إنت بعتله
}

export interface ReceivedFriendRequest {
  requestId: string;
  createdAt: string;
  sender: IUser; // الشخص اللي بعتلك
}


