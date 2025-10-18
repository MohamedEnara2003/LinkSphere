import { inject, Injectable, signal } from '@angular/core';
import { SingleTonApi } from '../../../core/services/api/single-ton-api.service';
import { EMPTY, Observable, switchMap, tap } from 'rxjs';
import { AuthToken, ChangeForgetPassword, LoginBody, LoginType, logoutFlag, SignUp, VerifyOtp } from '../../../core/models/auth.model';

import { Router } from '@angular/router';
import { StorageService } from '../../../core/services/locale-storage.service';

import { UserProfileService } from '../../public/pages/profile/services/user-profile.service';


interface Respons {
  message: string,
  info: string
  statusCode : number
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  #router = inject(Router)
  #singleTonApi = inject(SingleTonApi);

  #storageService = inject(StorageService);
  #userProfileService = inject(UserProfileService);


  #routeName: string = "auth";

  #loginData = signal<LoginType | null>(null);

// ____________________________________



//🟢 Create Account 🟢

signWithGoggle(idToken: string): Observable<void> {
  return this.#singleTonApi.create(
  `${this.#routeName}/signup-with-gmail`,
  { idToken }
  );
  }

// 🟢 Sign Up 
signUp(data: SignUp): Observable<Respons> {
  this.#loginData.set({email : data.email , password : data.password})
  return this.#singleTonApi.create<Respons>(`${this.#routeName}/signup`, data).pipe(
  tap(() => this.#router.navigate(['/auth/confirm-email'] , {
  queryParams : {email : data.email}
  }))
  );
}

// 🟢 Confirm Email (Send OTP to Email) + Login مباشرة
confirmEmail(OTP: string , email : string): Observable<LoginBody> {
  return this.#singleTonApi.patch(`${this.#routeName}/confirm-email`, {
  email,
  OTP,
  }).pipe(
  switchMap(() => {
  const loginData = this.#loginData();
  if(!loginData) {
  this.#router.navigate(['/auth/login'])
  return EMPTY;
  };
  return this.login(loginData);
  })
  );
}

resendConfirmEmailOtp(email: string): Observable<void> {
return this.#singleTonApi.create(`${this.#routeName}/re-send-confirm-email-otp`, {email});
}

// ___________________________


// 🟢 Login
login(data: LoginType): Observable<LoginBody> {
  return this.#singleTonApi.create<LoginBody>(`${this.#routeName}/login`, data).pipe(
    tap((res: LoginBody) => {
      this.#storageService.setItem<AuthToken>('auth', {
        access_token: res.data.credentials.access_token,
        refresh_token: res.data.credentials.refresh_token
      });
      this.#router.navigate(['/public'])
    })
  );
}


// 🟢 Forget Password && 
// 🟢 Resend Forget Password Otp
// 🟢 Change Forget Password
forgetPassword(email : string ): Observable<void> {
  return this.#singleTonApi
    .create<void>(`${this.#routeName}/forget-password`, {email})
    .pipe(
      tap(() => {
      this.#router.navigate(['/auth/change-forget-password'], {
      queryParams: { email} 
      });
      })
    );
}

resendForgetPasswordOtp(data: { email: string }): Observable<void> {
return this.#singleTonApi.create(`${this.#routeName}/resend-forget-password-otp`, data);
}

changeForgetPassword(data: ChangeForgetPassword): Observable<void> {
    return this.#singleTonApi.create<void>(
    `${this.#routeName}/change-forget-password`,
    data
    ).pipe(
    tap(() => this.#router.navigate(['/auth/login']) )
    );
  }

// ______________________________________________ //


// 🟢 Verify Confirm Email (Check OTP)
  verifyConfirmEmail(OTP: string ): Observable<void> {
  return this.#singleTonApi.patch(`${this.#routeName}/verify-confirm-email`,  {data : OTP});
  }

// 🟢 Enable/Disable Two-Step Verification
  changeTwoStepVerification(): Observable<void> {
  return this.#singleTonApi.update(`${this.#routeName}/change-two-setup-verification`, {}, ""); 
  }

  // 🟢 Verify Enable/Disable Two-Step Verification
  verifyTwoStepVerification(data: VerifyOtp): Observable<void> {
  return this.#singleTonApi.update(`${this.#routeName}/verify-enable-two-setup-verification`, data, ""); 
  }

//__________________________________

// 🟢 Refresh Token & Remove Tokens
refreshToken() : Observable<LoginBody>{
return this.#singleTonApi.find(`${this.#routeName}/refresh-token`)
}

removeTokens() {
  this.#storageService.removeItem('auth');
  this.#router.navigate(['/auth/login']);
}
//__________________________________


logout(logoutFlag?: logoutFlag): Observable<void> {
  const body = logoutFlag ? { logoutFlag } : {};
  return this.#singleTonApi
    .create<void>(`${this.#routeName}/logout`, body)
    .pipe(
      tap(() => {
      this.removeTokens();  
      this.#userProfileService.setUser(null);
      this.#userProfileService.setUserProfile(null);
      })
    );
}


}
