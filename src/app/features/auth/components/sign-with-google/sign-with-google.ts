import { Component } from '@angular/core';


@Component({
  selector: 'app-sign-in-with-google',
  template: `
  <button 
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

}
