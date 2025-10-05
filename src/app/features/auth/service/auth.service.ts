import { inject, Injectable, signal } from '@angular/core';
import { SingleTonApi } from '../../../core/services/api/single-ton-api.service';
import { EMPTY, Observable, switchMap, tap } from 'rxjs';
import { AuthToken, ChangeForgetPassword, LoginBody, LoginType, SignUp, VerifyOtp } from '../../../core/models/auth.model';

import { Router } from '@angular/router';
import { StorageService } from '../../../core/services/locale-storage.service';


interface Respons {
  message: string,
  info: string
  statusCode : number
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  #singleTonApi = inject(SingleTonApi);
  #router = inject(Router)
  #storageService = inject(StorageService)
  #routeName: string = "auth";
  
  #loginData = signal<LoginType | null>(null);


//🟢 Create Account 🟢

// 🟢 Sign Up 
signUp(data: SignUp): Observable<Respons> {
  this.#loginData.set({email : data.email , password : data.password})
  return this.#singleTonApi.create<Respons>(`${this.#routeName}/signup`, data).pipe(
  tap(() => this.#router.navigate(['/auth/confirm-email']))
  );
}

// 🟢 Confirm Email (Send OTP to Email) + Login مباشرة
confirmEmail(OTP: string): Observable<LoginBody> {
  return this.#singleTonApi.patch(`${this.#routeName}/confirm-email`, {
    email: this.#loginData()?.email,
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
// ______________________


// 🟢 Sign with Gmail
signUpWithGmail(idToken: string): Observable<void> {
  return this.#singleTonApi.create(
  `${this.#routeName}/signup-with-gmail`,
  { idToken }
  );
}


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
    // حطيت id فاضي "" لأن update بتطلب id، 
    // ممكن نعمل دالة خاصة في SingleTonApi للـ PATCH بدون id (أشرحلك تحت)
  }

  // 🟢 Verify Enable/Disable Two-Step Verification
  verifyTwoStepVerification(data: VerifyOtp): Observable<void> {
  return this.#singleTonApi.update(`${this.#routeName}/verify-enable-two-setup-verification`, data, ""); 
  }


refreshToken() : Observable<LoginBody>{
return this.#singleTonApi.find(`${this.#routeName}/refresh-token`)
}

removeTokens() {
  this.#storageService.removeItem('auth');
  this.#router.navigate(['/auth/login']);
}


// loginOut() : Observable<void> {
// return 
// }
}
