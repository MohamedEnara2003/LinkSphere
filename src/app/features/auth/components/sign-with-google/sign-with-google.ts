import { Component, inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';


@Component({
  selector: 'app-sign-in-with-google',
  template: `
  <button 
  (click)="loginWithGoogle()"
  title="Sign with goggle" 
  id="Sign-goggle" 
  type="button" 
  class="w-full btn bg-light hover:bg-card-light text-dark duration-300 transition-color ">
  <img src="/google.webp" alt="Google-icon" class="size-6" 
  loading="eager"
  decoding="sync"
  fetchpriority="high" 
  >
  Continue with goggle
  </button>
  `,
})
export class SignInWithGoogle {

  #authService = inject(AuthService);


  loginWithGoogle(): void {
  this.#authService.signInWithGoogleFirebase().subscribe();
  }
}

