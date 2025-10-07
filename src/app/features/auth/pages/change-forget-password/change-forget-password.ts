import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { SharedModule } from '../../../../shared/modules/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgControl } from "../../../../shared/components/ng-control/ng-control.";
import { CustomValidators } from '../../../../core/validations/custom/custom-validations';
import { AuthService } from '../../service/auth.service';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BtnResendOtp } from "../../components/btn-resend-otp/btn-resend-otp";
import { ChangeForgetPassword } from '../../../../core/models/auth.model';


@Component({
    selector: 'app-change-forget-password',
    imports: [
    SharedModule,
    TranslateModule,
    NgControl,
    BtnResendOtp
],
    template: `
    <section class="w-full min-h-svh flex items-center justify-center p-5">
    <form 
    [formGroup]="changeForgetPasswordForm"  
    (ngSubmit)="onChangeForgetPasswordSubmit()"
    class="w-full sm:w-xl md:w-2xl lg:w-3xl ngCard border-brand-color/10 border rounded-box p-5">

    <fieldset class="w-full fieldset p-2 grid grid-cols-1 md:grid-cols-2 gap-5 space-y-2">
        <legend class="fieldset-legend col-span-1 md:col-span-2">Change Password</legend>

        <!-- OTP -->
        <div>
        <app-ng-control
            [option]="{
            type : 'number',
            name : 'OTP',
            formControlName : 'OTP',
            label : 'OTP',
            id : 'OTP',
            autocomplete : 'postal-code',
            inputmode : 'numeric' ,
            isRequired : true
            }"
            [form]="changeForgetPasswordForm" />
        </div>

        <!-- Password -->
        <div>
        <app-ng-control
            [option]="{
            type : 'password',
            name : 'newPassword',
            formControlName : 'newPassword',
            label : 'New Password',
            id : 'newPassword',
            autocomplete : 'new-password',
            isRequired : true
            }"
            [form]="changeForgetPasswordForm" />
        </div>

        <!-- Confirm Password -->
        <div>
        <app-ng-control
            [option]="{
            type : 'password',
            name : 'confirmNewPassword',
            formControlName : 'confirmNewPassword',
            label : 'confirm New Password',
            id : 'confirmNewPassword',
            autocomplete : 'new-password',
            isRequired : true
            }"
            [form]="changeForgetPasswordForm" />
        </div>

        <!-- Google + Submit -->
        <div class="col-span-1 md:col-span-2">
        <app-btn-resend-otp  (onClickResend)="resendForgetPasswordOTP()" />

        <button type="submit"
        class="w-full btn btn-neutral btn-sm sm:btn-md bg-dark hover:bg-neutral mt-4 ">
        Change Password
        </button>
        </div>
      </fieldset>

    </form>
  </section>
  `
})
export class changeForgetPassword implements OnInit  {
    
    #fb = inject(NonNullableFormBuilder);
    #authService = inject(AuthService);
    #route = inject(ActivatedRoute);

    email = toSignal<string | null>(this.#route.queryParamMap.pipe(map((query) => query.get('email'))));

    public changeForgetPasswordForm!: FormGroup;

    ngOnInit() {
    this.changeForgetPasswordForm = this.#fb.group({
    OTP :  ['' ,[
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6),
    ]],
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
        Validators.maxLength(80),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).+$/)
        ]
    ],
    }, { 
    validators : CustomValidators.confirmPassword('newPassword' , 'confirmNewPassword')
    });
    }

onChangeForgetPasswordSubmit() {
    if (this.changeForgetPasswordForm.valid) {
    const data : ChangeForgetPassword = this.changeForgetPasswordForm.getRawValue();
    
    this.#authService.changeForgetPassword({...data , email : this.email() || ''}).subscribe();
    return;
    }
    this.changeForgetPasswordForm.markAllAsTouched();
}

resendForgetPasswordOTP() : void {
const email = this.email();
if(!email) return;
this.#authService.resendForgetPasswordOtp({email}).subscribe();
}
}
