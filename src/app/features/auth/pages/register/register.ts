import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { SharedModule } from '../../../../shared/modules/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgControl } from "../../../../shared/components/ng-control/ng-control.";
import { NgEmail } from "../../components/ng-email/ng-email";
import { CustomValidators } from '../../../../core/validations/custom/custom-validations';
import { AuthRedirectLink } from "../../components/auth-redirect-link/auth-redirect-link";
import { AuthService } from '../../service/auth.service';
import { SignUp } from '../../../../core/models/auth.model';
import { SignInWithGoogle } from "../../components/sign-with-google/sign-with-google";

@Component({
  selector: 'app-register',
  imports: [
    SharedModule,
    TranslateModule,
    NgControl,
    NgEmail,
    AuthRedirectLink,
    SignInWithGoogle
],
  template: `
  <section class="w-full min-h-svh flex items-center justify-center p-5">
    <form 
      [formGroup]="registerForm"  
      (ngSubmit)="onRegisterSubmit()"
      class="w-full sm:w-xl md:w-2xl lg:w-3xl ngCard border-brand-color/10 border rounded-box p-5">

      <fieldset class="w-full fieldset p-2 grid grid-cols-1 md:grid-cols-2 gap-5 space-y-2">
        <legend class="fieldset-legend col-span-1 md:col-span-2">{{ 'auth.register.title' | translate }}</legend>

        <!-- UserName -->
        <div>
          <app-ng-control
            [option]="{
              type : 'text',
              name : 'UserName',
              formControlName : 'userName',
              label : 'auth.register.username',
              id : 'UserName',
              autocomplete : 'name',
              isRequired : true
            }"
            [form]="registerForm" />
        </div>

        <!-- Email -->
        <div>
          <app-ng-email [emailForm]="registerForm" />
        </div>

        <!-- Phone -->
        <div>
          <app-ng-control
            [option]="{
              type : 'tel',
              name : 'phone',
              formControlName : 'phone',
              label : 'auth.register.phone',
              id : 'phone',
              autocomplete : 'tel',
              inputmode : 'tel',
              isRequired : true
            }"
            [form]="registerForm" />
        </div>

        <!-- Gender -->
        <div>
          <app-ng-control
            [option]="{
              type : 'select',
              name : 'gender',
              formControlName : 'gender',
              label : 'auth.register.gender',
              id : 'gender',
              selectOptions : ['male' , 'female'] ,
              textForTranslate : 'auth.register.',
              isRequired : true,
              autocomplete : 'sex'
            }"
            [form]="registerForm" />
        </div>

        <!-- Password -->
        <div>
          <app-ng-control
            [option]="{
              type : 'password',
              name : 'Password',
              formControlName : 'password',
              label : 'auth.register.password',
              id : 'Password',
              autocomplete : 'new-password',
              isRequired : true
            }"
            [form]="registerForm" />
        </div>

        <!-- Confirm Password -->
        <div>
          <app-ng-control
            [option]="{
              type : 'password',
              name : 'confirmPassword',
              formControlName : 'confirmPassword',
              label : 'auth.register.confirm_password',
              id : 'confirmPassword',
              autocomplete : 'new-password',
              isRequired : true
            }"
            [form]="registerForm" />
        </div>

        <!-- Google + Submit -->
        <div class="col-span-1 md:col-span-2">
          <app-sign-in-with-google/>
          <button type="submit"
            class="w-full btn btn-neutral btn-sm sm:btn-md bg-dark hover:bg-neutral mt-4 ">
            {{ 'auth.register.register_button' | translate }}
          </button>
        </div>
      </fieldset>
      <app-auth-redirect-link [isAccount]="true"/>
    </form>
  </section>
  `
})
export class Register implements OnInit  {
  #fb = inject(NonNullableFormBuilder);
  #authService = inject(AuthService);
  
  public registerForm!: FormGroup;

  ngOnInit() {
    this.registerForm = this.#fb.group({
      userName: [
        '', 
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
          Validators.pattern(/^(?! )[a-zA-Z0-9_ ]*(?<! )$/)
        ]
      ],
      email: [
        '', 
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(254),
          Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        ]
      ],
      password: [
        '', 
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(80),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).+$/)
        ]
      ],
      confirmPassword: [
        '', 
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(80),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).+$/)
        ]
      ],
      phone: [
        '', 
        [
          Validators.required,
          Validators.pattern(/^\+?[0-9]{8,15}$/)
        ]
      ],
      gender: [
        '', 
        [
          Validators.required,
          Validators.pattern(/^(male|female)$/i) 
        ]
      ]
    }, { 
      validators : CustomValidators.confirmPassword('password' , 'confirmPassword')
    });
  }

  onRegisterSubmit() {
    if (this.registerForm.valid) {
      const user: SignUp = this.registerForm.getRawValue();
      this.#authService.signUp(user).subscribe();
      return;
    }
    this.registerForm.markAllAsTouched();
  }
}
