import { Component, computed, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { UserProfileService } from '../../../profile/services/user-profile.service';
import { NgEmail } from "../../../../../auth/components/ng-email/ng-email";
import { IUpdateEmail } from '../../../../../../core/models/user.model';
import { MetaService } from '../../../../../../core/services/meta/meta.service';


@Component({
  selector: 'app-update-email',
  imports: [
    SharedModule,
    NgEmail
],
  template: `

<section class="w-full flex items-center justify-center p-5" role="region" aria-labelledby="update-email-heading">

<form [formGroup]="emailForm" (ngSubmit)="onChangeEmailSubmit()"
class="w-full sm:w-xl md:w-2xl lg:w-3xl  ngCard  border-brand-color/10  border rounded-box p-5"
role="form"
aria-describedby="update-email-desc">

  <header class="mb-2">
    <h2 id="update-email-heading" class="text-lg font-semibold">{{ 'settings.update_email.title' | translate }}</h2>
    <p id="update-email-desc" class="text-sm text-gray-500">{{ 'settings.update_email.subtitle' | translate }}</p>
  </header>

  <fieldset class="w-full fieldset  p-2 gap-5  space-y-2 " role="group" aria-labelledby="update-email-heading">
    <legend class="sr-only">{{ 'settings.update_email.title' | translate }}</legend>

    <app-ng-email [emailForm]="emailForm" />

    <button class="w-full btn btn-neutral btn-sm sm:btn-md bg-dark hover:bg-neutral mt-4 " [disabled]="isExistingEmail()" aria-disabled="{{ isExistingEmail() }}">
      {{ 'auth.forget_password.send_otp' | translate }}
    </button>

  </fieldset>
</form>
</section>
`,
})
export class updateEmail implements OnInit {
    readonly #metaService = inject(MetaService);
    #userService = inject(UserProfileService);
    #fb = inject(NonNullableFormBuilder);

    ngOnInit() {
      this.#metaService.setMeta({
        title: 'Update Email | Link Sphere Social',
        description: 'Update your email address associated with your Link Sphere Social account.',
        image: '',
        url: 'settings/update-email'
      });
    } 


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
