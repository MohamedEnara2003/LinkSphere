import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../../shared/modules/shared.module';
import { NgEmail } from "../../components/ng-email/ng-email";
import { AuthRedirectLink } from "../../components/auth-redirect-link/auth-redirect-link";
import { AuthenticationService } from '../../service/auth.service';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-forget-password',
  imports: [
  SharedModule, 
  TranslateModule,
  NgEmail, 
  AuthRedirectLink
  ],
  template: `

<section class="w-full min-h-svh flex items-center justify-center p-5">

<form [formGroup]="forgetPasswordForm" (ngSubmit)="onConfirmEmailSubmit()"
class="w-full sm:w-xl md:w-2xl lg:w-3xl  ngCard  border-brand-color/10  border rounded-box p-5">

<fieldset class="w-full fieldset  p-2 gap-5  space-y-2 ">
<legend class="fieldset-legend ">{{ 'auth.forget_password.title' | translate }}</legend>

<app-ng-email [emailForm]="forgetPasswordForm" />

<button class="w-full btn btn-neutral btn-sm sm:btn-md bg-dark hover:bg-neutral 
mt-4 ">
{{ 'auth.forget_password.send_otp' | translate }}
</button>

</fieldset>
<app-auth-redirect-link />
</form>
</section>
`,
})
export class ForgetPassword  {

    #authService = inject(AuthenticationService);

    public forgetPasswordForm = new FormGroup({
    email: new FormControl<string>('', {
    validators: [
    Validators.required,
    Validators.email,
    Validators.maxLength(254),
    Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    ]
    })
});

onConfirmEmailSubmit() {
    if(this.forgetPasswordForm.valid){
    const email  = this.forgetPasswordForm.getRawValue().email! ;
    this.#authService.forgetPassword(email).pipe().subscribe();
    return
    }
    this.forgetPasswordForm.markAllAsTouched()
}

}
