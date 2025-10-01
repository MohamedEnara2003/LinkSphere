import { IUser } from "./user.model";

export interface IFriendRequest {
  _id: string; // هيجي من MongoDB
  sendBy: string | IUser; // ممكن يكون مجرد id أو populated user
  sendTo: string | IUser;
  acceptedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}
