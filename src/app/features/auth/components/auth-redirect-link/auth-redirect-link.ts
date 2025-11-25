import { Component, input } from '@angular/core';
import { SharedModule } from '../../../../shared/modules/shared.module';



@Component({
selector: 'app-auth-redirect-link',
imports: [SharedModule],
template: `
    @let redirect = isAccount() ? 'login' : 'register';
    <nav class="flex justify-center items-center gap-1 mt-2" 
    aria-label="Auth-redirect-link" role="navigation">
    <p class="ngText font-normal">
    {{ isAccount() ? ('auth.login.already_have_account' | translate) : ('auth.login.dont_have_account' | translate) }}
    </p>

    <a [href]="['/auth/' , redirect]"  [routerLink]="['/auth/' , redirect]" 
    [aria-label]=" redirect + ' page link'" 
    role="link"
    class="link  text-brand-color "> 
    {{ isAccount() ? ('auth.login.log_in' | translate) : ('auth.login.create_one' | translate) }}
    </a>

    </nav>
`,
})
export class AuthRedirectLink {
isAccount = input<boolean>(false);
}
