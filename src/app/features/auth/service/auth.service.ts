import { inject, Injectable, signal } from '@angular/core';
import { SingleTonApi } from '../../../core/services/api/single-ton-api.service';
import {catchError, from, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { AuthToken, ChangeForgetPassword, LoginBody, LoginType, logoutFlag, SignUp, Token, VerifyOtp } from '../../../core/models/auth.model';

import { Router } from '@angular/router';
import { StorageService } from '../../../core/services/storage/locale-storage.service';

import { UserProfileService } from '../../public/features/profile/services/user-profile.service';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { firebaseAuth } from '../../../../environments/firebase.config';
import { DomService } from '../../../core/services/document/dom.service';


interface Respons {
  message: string,
  info: string
  statusCode : number
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  #routeName: string = "auth";

  #singleTonApi = inject(SingleTonApi);
  #router = inject(Router);
  #domService = inject(DomService);
  #storageService = inject(StorageService);
  #userProfileService = inject(UserProfileService);

registerData = signal<{email : string} | null>(null);

// ____________________________________

constructor() {
this.registerData.set(JSON.parse(this.#storageService.getItem("register")!) || null);
}

// 🟢 Store Tokens 🟢
#storeTokens({access_token , refresh_token } : Token) : void {
   this.#storageService.setItem<AuthToken>('auth', {
        access_token: access_token,
        refresh_token:refresh_token
      });
    this.#router.navigate(['/public/feed'])
}

//🟢 Create Account 🟢
signInWithGoogleFirebase(): Observable<LoginBody | null> {

    if(!this.#domService.isBrowser()){
    return throwError(() => new Error('Google Sign-In only works on browser'));
    }

    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(firebaseAuth, provider)).pipe(
      switchMap(result => {

      const credential = GoogleAuthProvider.credentialFromResult(result);
      const idToken = credential?.idToken;

        if (!idToken) {
          return throwError(() => new Error('No Google ID token found'));
        }
        return this.#signWithGoggle(idToken , result.user.displayName || '')
      }),
    catchError(() => {
    return of(null);
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
  const userEmail = this.registerData()?.email || email;
  return this.#singleTonApi.patch<LoginBody>(`${this.#routeName}/confirm-email`, {
  email : userEmail,
  OTP,
  }).pipe(
  tap(({data : {credentials}}) => {

  if(!userEmail) {
  this.#router.navigate(['/auth/login'])
  }
  
  this.#storageService.removeItem('register');
  this.#storeTokens(credentials);
  })
  );
}

resendConfirmEmailOtp(email: string): Observable<void> {
const userEmail = this.registerData()?.email || email;
console.log(userEmail);
return this.#singleTonApi.create(`${this.#routeName}/re-send-confirm-email-otp`, {email : userEmail});
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
