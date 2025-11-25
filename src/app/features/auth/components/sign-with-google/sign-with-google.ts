import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../../service/auth.service';


@Component({
  selector: 'app-sign-in-with-google',
  template: `
  <button 
  (click)="loginWithGoogle()"
  title="Sign in with Google" 
  id="Sign-google" 
  type="button" 
  class="w-full btn bg-light hover:bg-card-light text-dark duration-300 transition-color ">
  <img src="/google.webp" alt="Google-icon" class="size-6" 
  loading="eager"
  decoding="sync"
  fetchpriority="high" 
  >
  Continue with Google
  </button>
  `,

})
export class SignInWithGoogle {

  #authService = inject(AuthenticationService);


  
  loginWithGoogle(): void {
  this.#authService.signInWithGoogle().subscribe({
  error: (error) => console.error('Google sign-in failed', error)
  });
  }
}

