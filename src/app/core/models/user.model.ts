// نفس الـ enums عشان تكون متطابقة مع الـ backend
export enum GenderEnum {
  male = "male",
  female = "female",
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

// نسخة مبسطة من بيانات الصديق
export interface IFriend {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  picture?: string;
  gender: GenderEnum;
}

// نسخة الـ User اللي الـ frontend بيستخدمها
export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string; // virtual من الـ backend
  slug: string;

  email: string;
  phone?: string;

  gender: GenderEnum;
  role: RoleEnum;

  picture?: string;
  placeholder? : string ,
  
  coverImages?: string[];

  friends?: IFriend[];
}

export interface UnfreezePayload {
  email: string;
  password: string;
}


export interface FriendRequestResponse {
  requestId: string;
}


export interface IUpdateBasicInfo {
  userName?: string;
  gender?: string;
  phone?: string;
}

export interface IUpdateEmail {
  newEmail: string;
}

export interface IConfirmUpdateEmail {
  otp: string;
}
export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

