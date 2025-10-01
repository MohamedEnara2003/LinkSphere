import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';




@Component({
selector: 'app-auth-redirect-link',
imports: [RouterModule],
template: `
    @let redirect = isAccount() ? 'login' : 'register';
    <nav class="flex justify-center items-center gap-1 mt-2" 
    aria-label="Auth-redirect-link" role="navigation">
    <p class="ngText font-normal">
    {{ isAccount() ? 'Already have an account?' :  'Dont have an account?' }}
    </p>

    <a [href]="['/auth/' , redirect]"  [routerLink]="['/auth/' , redirect]" 
    [aria-label]=" redirect + ' page link'" 
    role="link"
    class="link  text-brand-color "> 
    {{ isAccount() ? 'Log in' :  ' Create One' }}
    </a>

    </nav>
`,
})
export class AuthRedirectLink {
isAccount = input<boolean>(false);
}
