import { Author } from "./user.model";


export interface FriendRequestResponse {
  data : {RequestId: string}
}

export interface IFriendRequest {
  _id: string;
  sendBy: string;
  sendTo: string;
  createdAt: string; 
  updatedAt: string;  
  __v: number;
}

export interface SentFriendRequest extends IFriendRequest {
  receiver : Author
}

export interface ReceivedFriendRequest extends IFriendRequest{
  sender : Author
}


