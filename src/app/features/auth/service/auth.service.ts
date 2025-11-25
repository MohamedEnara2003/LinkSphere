import { inject, Injectable, signal } from '@angular/core';
import { SingleTonApi } from '../../../core/services/api/single-ton-api.service';
import { EMPTY, filter, from, Observable, switchMap, take, tap, throwError } from 'rxjs';
import { AuthToken, ChangeForgetPassword, LoginBody, LoginType, logoutFlag, SignUp, Token, VerifyOtp } from '../../../core/models/auth.model';

import { Router } from '@angular/router';
import { StorageService } from '../../../core/services/locale-storage.service';

import { UserProfileService } from '../../public/pages/profile/services/user-profile.service';
import { DomService } from '../../../core/services/dom.service';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { environment } from '../../../../environments/environment.development';




interface Respons {
  message: string,
  info: string
  statusCode : number
}

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  #routeName: string = "auth";

  #singleTonApi = inject(SingleTonApi);
  #router = inject(Router);
  #domService = inject(DomService);
  #storageService = inject(StorageService);
  #userProfileService = inject(UserProfileService);
  #auth0 = inject(Auth0Service, { optional: true });

  #registerData = signal<{email : string} | null>(null);


// ____________________________________

constructor() {
this.#registerData.set(this.#storageService.getItem("register") || null);
}


// 🟢 Store Tokens 🟢
#storeTokens({access_token , refresh_token } : Token) : void {
   this.#storageService.setItem<AuthToken>('auth', {
        access_token: access_token,
        refresh_token:refresh_token
      });
    this.#router.navigate(['/public'])
}


//🟢 Sign in with Google via Auth0 🟢
signInWithGoogle(): Observable<LoginBody> {
  if (!this.#domService.isBrowser()) {
    return throwError(() => new Error('Google Sign-In only works on browser'));
  }

  if (!this.#auth0) {
    return throwError(() => new Error('Auth0 is not available on this platform'));
  }

  const connection = environment.auth0.googleConnection || 'google-oauth2';

  return from(
    this.#auth0.loginWithPopup({
      authorizationParams: {
        connection,
        prompt: 'select_account'
      }
    })
  ).pipe(
    switchMap(() =>
      this.#auth0!.idTokenClaims$.pipe(
        filter((claims): claims is { __raw: string; [key: string]: unknown } => !!claims?.__raw),
        take(1)
      )
    ),
    switchMap((claims) => {
      const userName =
        (claims['name'] as string | undefined) ||
        (claims['nickname'] as string | undefined) ||
        (claims['email'] as string | undefined) ||
        '';
      return this.#signWithGoggle(claims.__raw, userName);
    })
  );
}

#signWithGoggle(idToken: string , userName : string): Observable<LoginBody> {
  return this.#singleTonApi.create<LoginBody>(
  `${this.#routeName}/signup-with-gmail`,
  { idToken , userName}
  ).pipe(
  tap(({data : {credentials}}) => {
  this.#storeTokens(credentials);
  })
  );
  }

//______________________________

// 🟢 Sign Up 
signUp(data: SignUp): Observable<Respons> {
  const {email} = data
  return this.#singleTonApi.create<Respons>(`${this.#routeName}/signup`, data).pipe(
  tap(() => {
  this.#router.navigate(['/auth/confirm-email'] , { queryParams : {email } });
  this.#storageService.setItem("register" , JSON.stringify({email}));
  }
))

}

// 🟢 Confirm Email (Send OTP to Email) + Login 
confirmEmail(OTP: string , email : string): Observable<LoginBody> {
  return this.#singleTonApi.patch(`${this.#routeName}/confirm-email`, {
  email,
  OTP,
  }).pipe(
  switchMap(() => {
  const {email} = this.#registerData()!;
  if(!email) {
  this.#router.navigate(['/auth/login'])
  return EMPTY;
  };
  return this.login({email , password :''});
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
    tap(({data : {credentials}}) => {
      this.#storeTokens(credentials);
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
