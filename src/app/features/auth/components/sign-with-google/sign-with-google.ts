import { Component, inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-sign-in-with-google',
  standalone: true,
  template: `
    <button type="button"
      class="w-full btn bg-card-dark dark:bg-card-light text-card-light dark:text-card-dark 
      hover:opacity-80 duration-300 transition-colors"
      (click)="signInWithGoogle()"
      aria-label="Sign in with Google">
      Sign in with Google
    </button>
  `,
})
export class SignInWithGoogle {
  #authService = inject(AuthService);

  signInWithGoogle(): void {
    this.#authService
      .initGoogleSignIn()
      .pipe(switchMap((idToken) => this.#authService.signUpWithGmail(idToken)))
      .subscribe({
        next: () => console.log('✅ تم تسجيل الدخول بنجاح'),
        error: (err) => console.error('❌ خطأ أثناء تسجيل الدخول:', err),
      });
  }
}
