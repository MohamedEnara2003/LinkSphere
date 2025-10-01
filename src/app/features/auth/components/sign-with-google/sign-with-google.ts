import { Component } from '@angular/core';



@Component({
selector: 'app-sign-in-with-google',
imports: [],
template: `
<button id="google-btn" 
class="w-full btn bg-card-dark dark:bg-card-light text-card-light dark:text-card-dark 
hover:opacity-80 duration-300 transition-colors" 
(click)="signInWithGoogle()" aria-label="Sign in with Google">
Sign in with Google
</button>
`,
})
export class signInWithGoogle {



    signInWithGoogle() : void {
    
    }
}
