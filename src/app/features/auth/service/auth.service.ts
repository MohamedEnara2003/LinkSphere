import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { SingleTonApi } from '../../../core/services/api/single-ton-api.service';
import { EMPTY, Observable, switchMap, tap } from 'rxjs';
import { AuthToken, ChangeForgetPassword, LoginBody, LoginType, logoutFlag, SignUp, VerifyOtp } from '../../../core/models/auth.model';

import { Router } from '@angular/router';
import { StorageService } from '../../../core/services/locale-storage.service';
import { isPlatformBrowser } from '@angular/common';
import { UserProfileService } from '../../public/pages/profile/services/user-profile.service';

declare global {
  namespace google.accounts.id {
    interface CredentialResponse {
      credential: string;
      select_by: string;
    }

    interface IdConfiguration {
      client_id: string;
      callback: (response: CredentialResponse) => void;
    }

    function initialize(config: IdConfiguration): void;
    function renderButton(parent: HTMLElement, options: { theme: string; size: string }): void;
    function prompt(): void; // ✅ أضفنا دي
  }
}


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

  #platform_id = inject(PLATFORM_ID);

  #routeName: string = "auth";
  #googleClientId : string = 
  '527860747448-4q6fmpfmju4rfghkgvn10s5g37rjc7si.apps.googleusercontent.com.apps.googleusercontent.com';
  

  #loginData = signal<LoginType | null>(null);


  // 🟢 Sign with Gmail
  initGoogleSignIn(): Observable<string> {
    if (!isPlatformBrowser(this.#platform_id)) {
      return new Observable((observer) => observer.complete());
    }

    return new Observable<string>((observer) => {
      // ✅ تحقق من تحميل SDK
      const checkGoogleLoaded = () => typeof google !== 'undefined' && google.accounts?.id;

      const initializeGoogle = () => {
        google.accounts.id.initialize({
          client_id: this.#googleClientId,
          callback: (response: google.accounts.id.CredentialResponse) => {
            observer.next(response.credential); // idToken
            observer.complete();
          },
        });

        // ✅ عرض نافذة اختيار الحساب
        google.accounts.id.prompt();
      };

      if (checkGoogleLoaded()) {
        initializeGoogle();
      } else {
        // ✅ انتظر حتى تحميل الـ SDK
        const interval = setInterval(() => {
          if (checkGoogleLoaded()) {
            clearInterval(interval);
            initializeGoogle();
          }
        }, 200);
      }

      return { unsubscribe() {} };
    });
  }

  signUpWithGmail(idToken: string): Observable<void> {
  return this.#singleTonApi.create(
  `${this.#routeName}/signup-with-gmail`,
  { idToken }
  );
}

// ____________________________________

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
  email: 'mohamedabdelziz2003@gmail.com',
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
