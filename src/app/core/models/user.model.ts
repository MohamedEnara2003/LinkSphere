import { Picture } from "./picture";

// نفس الـ enums عشان تكون متطابقة مع الـ backend
export enum GenderEnum {
  male = "male",
  female = "female",
}

export enum FriendRequestEnum {
  sent = "sent",
  resaved = "received",
}

export enum RoleEnum {
  user = "user",
  admin = "admin",
  superAdmin = "super-admin",
}

export enum ProviderEnum {
  system = "system",
  google = "google",
}

export type RelationshipState  =
|'me'
|'isFriend'
|'notFriend'
|'requestSent'
|'requestReceived';


export interface IFriend {
  _id: string;
  id?: string;
  picture?: Picture;
  firstName: string;
  lastName : string;
  userName: string;
  email: string;
}


// نسخة الـ User اللي الـ frontend بيستخدمها
export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string; 
  slug: string;

  email: string;
  phone?: string;

  gender: GenderEnum;
  role: RoleEnum;

  picture?: Picture;
  coverImage?: Picture;

  friends?: IFriend[];
  flag : RelationshipState 
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserProfile {
  data : {
  user : IUser
  }
}

export interface Author {
    id: string;
    _id: string;
    firstName: string;
    lastName: string;
    userName: string;
    picture? : Picture;
}

export interface UnfreezePayload {
  email: string;
  password: string;
}



export interface IUpdateBasicInfo {
  userName?: string;
  gender?: GenderEnum;
  phone?: string;
}

export interface IUpdateEmail {
  email: string;
}

export interface IConfirmUpdateEmail {
  OTP: string;
}
export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

