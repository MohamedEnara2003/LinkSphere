import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { NgControl } from '../../../../../../shared/components/ng-control/ng-control.';
import { CustomValidators } from '../../../../../../core/validations/custom/custom-validations';
import { UserProfileService } from '../../../profile/services/user-profile.service';
import { ChangePasswordDto } from '../../../../../../core/models/user.model';


@Component({
  selector: 'app-change-password',
  imports: [ SharedModule, NgControl],
  template: `
  <section class="w-full flex items-center justify-center p-5">
    <form 
      [formGroup]="changePasswordForm"  
      (ngSubmit)="onChangePasswordSubmit()"
      class="w-full sm:w-xl md:w-2xl lg:w-3xl ngCard border-brand-color/10 border rounded-box p-5">

      <fieldset class="w-full fieldset p-2 grid grid-cols-1 gap-5 space-y-2">
        <legend class="fieldset-legend">{{ 'settings.change_password.title' | translate }}</legend>

        <!-- Old Password -->

          <app-ng-control
            [option]="{
              type : 'password',
              name : 'oldPassword',
              formControlName : 'oldPassword',
              label : 'settings.change_password.old_password',
              id : 'oldPassword',
              autocomplete : 'current-password',
              isRequired : true
            }"
            [form]="changePasswordForm" />
    

        <!-- New Password -->
          <app-ng-control
            [option]="{
              type : 'password',
              name : 'newPassword',
              formControlName : 'newPassword',
              label : 'settings.change_password.new_password',
              id : 'newPassword',
              autocomplete : 'new-password',
              isRequired : true
            }"
            [form]="changePasswordForm" />
 

        <!-- Confirm New Password -->
        <app-ng-control
            [option]="{
            type : 'password',
            name : 'confirmNewPassword',
            formControlName : 'confirmNewPassword',
            label : 'settings.change_password.confirm_new_password',
            id : 'confirmNewPassword',
            autocomplete : 'new-password',
            isRequired : true
            }"
            [form]="changePasswordForm" />

        <!-- Submit Button -->
        <div>
        <button type="submit" class="w-full btn btn-neutral btn-sm sm:btn-md mt-4">
        {{'settings.change_password.save_button' | translate }}
        </button>
        </div>
    </fieldset>
    </form>
</section>
`
})
export class ChangePasswordComponent implements OnInit {
  #fb = inject(NonNullableFormBuilder);
  #userProfileService = inject(UserProfileService);

  public changePasswordForm!: FormGroup;

  ngOnInit() {
    this.changePasswordForm = this.#fb.group({
        oldPassword: [
        '', 
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(80)
        ]
      ],
      newPassword: [
        '', 
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(80),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).+$/)
        ]
      ],
      confirmNewPassword: [
        '', 
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(80)
        ]
      ]
    }, { 
      validators : CustomValidators.confirmPassword('newPassword', 'confirmNewPassword')
    });
  }

  onChangePasswordSubmit() {
    if (this.changePasswordForm.valid) {
    const data : ChangePasswordDto = this.changePasswordForm.getRawValue();
    this.#userProfileService.changePassword(data).subscribe()
    }
    this.changePasswordForm.markAllAsTouched();
  }
}
