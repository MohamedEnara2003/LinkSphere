import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { SharedModule } from '../../../../shared/modules/shared.module';
import { NgControl } from "../../../../shared/components/ng-control/ng-control.";
import { NgEmail } from "../../components/ng-email/ng-email";
import { signInWithGoogle } from "../../components/sign-with-google/sign-with-google";
import { AuthRedirectLink } from "../../components/auth-redirect-link/auth-redirect-link";
import { AuthService } from '../../service/auth.service';
import { LoginType } from '../../../../core/models/auth.model';


@Component({
  selector: 'app-login',
  imports: [
  SharedModule, 
  NgControl, 
  NgEmail, 
  signInWithGoogle, 
  AuthRedirectLink
  ],
  template: `

<section class="w-full min-h-svh flex items-center justify-center p-5">

<form [formGroup]="loginForm" (ngSubmit)="onLoginSubmit()"
class="w-full sm:w-xl md:w-2xl lg:w-3xl  ngCard  border-brand-color/10  border rounded-box p-5">

<fieldset class="w-full fieldset  p-2 gap-5  space-y-2 ">
<legend class="fieldset-legend ">Log in</legend>

<app-ng-email [emailForm]="loginForm" />

<app-ng-control
[option]="{
type : 'password',
name : 'Password',
formControlName : 'password',
label : 'Password',
id : 'Password',
autocomplete : 'new-password',
isRequired : true
}"
[form]="loginForm" />


<nav class="grid grid-cols-1 gap-2">

<app-sign-in-with-google />

<button class="w-full btn btn-neutral btn-sm sm:btn-md bg-dark hover:bg-neutral 
  mt-4 ">
  Log in
</button>

<a href="/auth/forget-password" routerLink="/auth/forget-password" class="link text-base font-normal ngText ">
  Forget Password
</a>

</nav>

</fieldset>
<app-auth-redirect-link />
</form>
</section>
`,
})
export class Login implements OnInit  {
  #fb = inject(NonNullableFormBuilder);
  #authService = inject(AuthService);
  public loginForm!: FormGroup;


  ngOnInit() {
    this.loginForm = this.#fb.group({
 
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

});

}

  onLoginSubmit() {
  if(this.loginForm.valid){
  const user : LoginType = this.loginForm.getRawValue() ;
  this.#authService.login(user).subscribe()
  return
  }
  this.loginForm.markAllAsTouched()
  }


}
