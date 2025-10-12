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


export interface IFriend {
  _id: string;
  id?: string;
  picture?: string;
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

  picture?: string;
  placeholder? : string ,
  
  coverImages?: string[];

  friends?: IFriend[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserProfile {
  data : {
  user : IUser
  }
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

