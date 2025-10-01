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
  address?: string;

  gender: GenderEnum;
  role: RoleEnum;

  provider: ProviderEnum;

  picture?: string;
  coverImages?: string[];

  friends?: IFriend[];

  createdAt: Date;
  updatedAt?: Date;
}
