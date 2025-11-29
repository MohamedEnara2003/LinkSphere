import { Component, computed, inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { UserProfileService } from '../../../profile/services/user-profile.service';
import { NgEmail } from "../../../../../auth/components/ng-email/ng-email";
import { IUpdateEmail } from '../../../../../../core/models/user.model';


@Component({
  selector: 'app-update-email',
  imports: [
    SharedModule,
    NgEmail
],
  template: `

<section class="w-full flex items-center justify-center p-5">

<form [formGroup]="emailForm" (ngSubmit)="onChangeEmailSubmit()"
class="w-full sm:w-xl md:w-2xl lg:w-3xl  ngCard  border-brand-color/10  border rounded-box p-5">

<fieldset class="w-full fieldset  p-2 gap-5  space-y-2 ">
<legend class="fieldset-legend ">{{ 'settings.update_email.title' | translate }}</legend>

<app-ng-email [emailForm]="emailForm" />

<button class="w-full btn btn-neutral btn-sm sm:btn-md bg-dark hover:bg-neutral 
mt-4 " [disabled]="isExistingEmail()">
{{ 'auth.forget_password.send_otp' | translate }}
</button>

</fieldset>
</form>
</section>
`,
})
export class updateEmail  {

    #userService = inject(UserProfileService);
    #fb = inject(NonNullableFormBuilder); 


    public emailForm = this.#fb.group({
    email: [this.#userService.user()?.email || '' , {
    validators: [
    Validators.required,
    Validators.email,
    Validators.maxLength(254),
    Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    ]
    }]
});

isExistingEmail =
computed(() => (this.#userService.user()?.email || '') ===  this.emailForm.controls['email'].value);


onChangeEmailSubmit() {
    if(this.emailForm.valid){
    const email  : IUpdateEmail = this.emailForm.getRawValue() ;
    if(this.isExistingEmail() ) return ;
    this.#userService.updateEmail(email).subscribe()
    return
    }
    this.emailForm.markAllAsTouched()
}

}
