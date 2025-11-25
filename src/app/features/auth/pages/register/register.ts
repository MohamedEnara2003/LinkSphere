import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { SharedModule } from '../../../../shared/modules/shared.module';
import { NgControl } from "../../../../shared/components/ng-control/ng-control.";
import { NgEmail } from "../../components/ng-email/ng-email";
import { CustomValidators } from '../../../../core/validations/custom/custom-validations';
import { AuthRedirectLink } from "../../components/auth-redirect-link/auth-redirect-link";
import { AuthenticationService } from '../../service/auth.service';
import { SignUp } from '../../../../core/models/auth.model';
import { SignInWithGoogle } from "../../components/sign-with-google/sign-with-google";
import { tap } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [
    SharedModule,
    NgControl,
    NgEmail,
    AuthRedirectLink,
    SignInWithGoogle
],
  template: `
  <section class="w-full min-h-svh flex items-center justify-center p-2">
    <form 
      [formGroup]="registerForm"  
      (ngSubmit)="onRegisterSubmit()"
      class="w-full sm:w-xl md:w-2xl lg:w-3xl ngCard border-brand-color/10 border rounded-box p-2">

     <fieldset
        class="fieldset p-4 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <legend class="fieldset-legend col-span-full">
          {{ 'auth.register.title' | translate }}
        </legend>

        <!-- USERNAME -->
        <app-ng-control
          class="col-span-full"
          [form]="registerForm"
          [option]="{
            type: 'text',
            name: 'UserName',
            formControlName: 'userName',
            label: 'auth.register.username',
            id: 'UserName',
            autocomplete: 'name',
            isRequired: true
          }"
        />

        <!-- EMAIL -->
        <div class="col-span-full">
          <app-ng-email [emailForm]="registerForm" />
        </div>

        <!-- GENDER -->
        <!-- <app-ng-control
          class=""
          [form]="registerForm"
          [option]="{
            type: 'select',
            name: 'gender',
            formControlName: 'gender',
            label: 'auth.register.gender',
            id: 'gender',
            selectOptions: ['male', 'female'],
            textForTranslate: 'auth.register.',
            isRequired: true,
            autocomplete: 'sex'
          }"
        /> -->

        <!-- PASSWORD -->
        <app-ng-control
          [form]="registerForm"
          [option]="{
            type: 'password',
            name: 'Password',
            formControlName: 'password',
            label: 'auth.register.password',
            id: 'Password',
            autocomplete: 'new-password',
            isRequired: true
          }"
        />

        <!-- CONFIRM PASSWORD -->
        <app-ng-control
          [form]="registerForm"
          [option]="{
            type: 'password',
            name: 'confirmPassword',
            formControlName: 'confirmPassword',
            label: 'auth.register.confirm_password',
            id: 'confirmPassword',
            autocomplete: 'new-password',
            isRequired: true
          }"
        />

        <!-- GOOGLE SIGN-IN + SUBMIT -->
        <div class="col-span-full flex flex-col gap-4">
          <app-sign-in-with-google />
          <button 
            type="submit"
            class="btn btn-neutral btn-sm sm:btn-md bg-dark hover:bg-neutral w-full"
          >
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
  #AuthenticationService = inject(AuthenticationService);
  
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

      // gender: [
      //   '', 
      //   [
      //     Validators.required,
      //     Validators.pattern(/^(male|female)$/i) 
      //   ]
      // ]

    }, { 
      validators : CustomValidators.confirmPassword('password' , 'confirmPassword')
    });
  }

  onRegisterSubmit() {
    if (this.registerForm.valid) {
      const user: SignUp = this.registerForm.getRawValue();
      this.#AuthenticationService.signUp(user).pipe(
      tap(() =>  this.registerForm.reset())
      ).subscribe();
      return;
    }
    
    this.registerForm.markAllAsTouched();
  }
}
