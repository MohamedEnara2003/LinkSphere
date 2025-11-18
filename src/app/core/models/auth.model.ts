
export type logoutFlag =  "current" | "all" ;
export interface AuthToken {
  access_token : string ;
  refresh_token : string ;
}

export interface SignUp {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender?: string;
  phone?: string;
}

export interface LoginType {
  email: string;
  password: string;
}

export interface Token {
    access_token: string,
    refresh_token: string ,
}
export interface LoginBody {
    data: {
    credentials:  Token
    }
}

export interface ForgetPassword {
  email: string;
}
export interface ChangeForgetPassword {
    email: string;
    OTP: string;
    newPassword: string;
    confirmNewPassword: string;
}


export interface VerifyOtp {
  OTP: string;
}


