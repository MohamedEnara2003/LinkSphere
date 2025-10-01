import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { SharedModule } from '../../../../shared/modules/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgControl } from "../../../../shared/components/ng-control/ng-control.";
import { NgEmail } from "../../components/ng-email/ng-email";
import { CustomValidators } from '../../../../core/validations/custom/custom-validations';
import { signInWithGoogle } from "../../components/sign-with-google/sign-with-google";
import { AuthRedirectLink } from "../../components/auth-redirect-link/auth-redirect-link";


@Component({
  selector: 'app-register',
  imports: [SharedModule, TranslateModule, NgControl, NgEmail, signInWithGoogle, AuthRedirectLink],
  template: `
  
<section class="w-full min-h-svh flex items-center justify-center p-5">

<form [formGroup]="registerForm" 
class="w-full sm:w-xl md:w-2xl lg:w-3xl  ngCard  border-brand-color/10  border rounded-box p-5">

<fieldset class="w-full fieldset    p-2
grid grid-cols-1 md:grid-cols-2 gap-5  space-y-2 ">
<legend class="fieldset-legend col-span-1 md:col-span-2">Register</legend>

<div >
<app-ng-control
[option]="{
type : 'text',
name : 'UserName',
formControlName : 'userName',
label : 'UserName',
id : 'UserName',
autocomplete : 'name',
isRequired : true
}"
[form]="registerForm" />
</div>


<div>
<app-ng-email [emailForm]="registerForm" />
</div>

<div>
<app-ng-control
[option]="{
type : 'tel',
name : 'phone',
formControlName : 'phone',
label : 'Phone',
id : 'phone',
autocomplete : 'tel',
inputmode : 'tel',
isRequired : true
}"
[form]="registerForm" />
</div>

<div>
<app-ng-control
[option]="{
type : 'select',
name : 'gender',
formControlName : 'gender',
label : 'Gender',
id : 'gender',
selectOptions : ['Male' , 'Female'] ,
isRequired : true,
autocomplete : 'sex'
}"
[form]="registerForm" />
  </div>

<div>
<app-ng-control
[option]="{
type : 'text',
name : 'Password',
formControlName : 'password',
label : 'Password',
id : 'Password',
autocomplete : 'new-password',
isRequired : true
}"
[form]="registerForm" />
</div>

<div>
<app-ng-control
[option]="{
type : 'text',
name : 'confirmPassword',
formControlName : 'confirmPassword',
label : 'Confirm Password',
id : 'confirmPassword',
autocomplete : 'new-password',
isRequired : true
}"
[form]="registerForm" />
</div>


<div class="col-span-1 md:col-span-2">
<app-sign-in-with-google />

<button class="w-full btn btn-neutral btn-sm sm:btn-md bg-dark hover:bg-neutral 
  mt-4 ">
  Register
</button>
</div>
</fieldset>
<app-auth-redirect-link [isAccount]="true"/>
</form>
 </section>
`,
})
export class Register implements OnInit  {
  private readonly fb = inject(NonNullableFormBuilder);


  public registerForm!: FormGroup;


  ngOnInit() {
    this.registerForm = this.fb.group({
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
    if(this.registerForm.valid){
    const user  = this.registerForm.getRawValue() ;
    return
    }
    this.registerForm.markAllAsTouched()
  }


}
