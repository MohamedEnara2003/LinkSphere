import { Component, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { FormGroup } from '@angular/forms';
import { TranslationService } from '../../../core/services/translations/translation.service';

export interface FormControlOption {
  type : 'text' | 'number' | 'password' | 'email' | 'tel' | 'file' |  'select' | 'textarea' ,
  formControlName : string ,
  label? : string ,
  id? : string,
  placeHolder? : string ,
  isRequired? : boolean ,
  inputmode? : 'tel' | 'numeric' | 'email' | 'decimal',
  name? : string,
  inputClass? : string,
  autocomplete? : 'email' | 'postal-code' | 'username' | 'name' | 'given-name' | 'family-name' | 'sex' 
  | 'organization'  | 'street-address' | 'address-level1' | 'address-level2' | 'country-name' | 'current-password'  
  | 'new-password' | 'search' | 'tel',

  // If type select
  textForTranslate? : string ,
  selectOptions? : string[] 
}


@Component({
  selector: 'app-ng-control',
  imports: [SharedModule],
  template: `
  <div [formGroup]="form()" class="">

  @if(option().label){
    <label class="label block mb-1 ngText" [for]="this.option().id">
        {{ translationService.heroTexts( option().label! )}} 
        <span aria-hidden="true" class="text-sm font-medium"
        [ngClass]="option().isRequired ?  'text-error' : 'text-gray-400' ">
        {{!option().isRequired ? ('forms.optional' | translate) : '*'}}
        </span>
      </label>
  }
  
      @switch (this.option().type) {
      
        @case ('textarea') {
        <textarea 
        [id]="option().id" 
        [name]="option().name"
        [formControlName]="option().formControlName" 
        [placeholder]="option().placeHolder"
        [attr.aria-describedby]="option().formControlName + 'Help'"
        [class]="option().inputClass || 'ng-textarea'" 
        [ngClass]="(shouldShowValidation() && isShowValidationsError()) ? 'textarea-error': ''"
        ></textarea>
        }

        @case ('select') {
        <select 
        [id]="option().id" 
        [name]="option().name"
        [formControlName]="option().formControlName" 
        [autocomplete]="option().autocomplete || 'on'"
        [class]="option().inputClass || 'ng-select'" 
        aria-selected="true"
        [attr.aria-required]="option().isRequired"
        [attr.aria-describedby]="option().formControlName + 'Help'"
        [ngClass]="(shouldShowValidation() && isShowValidationsError())  ? 
        'select-error' : ''">
        @for (o of this.option().selectOptions; track o) {
        @let option =  this.option().textForTranslate  ? this.option().textForTranslate + o : o;
        <option [value]="o">{{
        translationService.heroTexts(option)}}
        </option>
        }
        </select> 
        }

        @default {

        <label  
        [for]="option().id"
        [class]="option().inputClass || 'ng-input'" 
        [ngClass]="(shouldShowValidation() && isShowValidationsError()) ? 'input-error': ''">
        
        <input 
        #inputRef
        [type]="option().type === 'password' ? isShowPass() ? 'text' : 'password' : option().type"
        [id]="option().id" 
        [formControlName]="option().formControlName" 
        [placeholder]="option().placeHolder || ''"
        [name]="option().name"
        [inputMode]="option().inputmode"
        class="placeholder:text-gray-500"
        [attr.aria-required]="option().isRequired"
        [attr.aria-describedby]="option().formControlName + 'Help'"
        [autocomplete]="option().autocomplete || 'on'"
        />

        @if(option().type === 'password'){
        
        <button (click)="isShowPass.set(!isShowPass())" type="button" aria-hidden="true"
        class="ngBtnIcon">
        
        @if(isShowPass()){
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clip-rule="evenodd" />
        </svg>
        }@else {
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
        <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
        <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
        <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
        </svg>
        }
        </button>
        }


        </label>

        }
      }

        @if (shouldShowValidation() && isShowValidationsError()) {
        <p class="text-error text-xs mt-1 flex items-center gap-1 ">
        
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" 
        stroke="currentColor" class="size-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>

        {{shouldShowErrorsValidation()}}
        </p>
        }
  </div>
  `,
})
export class NgControl{
  translationService = inject(TranslationService);
  
  inputRef = viewChild<ElementRef<HTMLElement>>('inputRef');

  form = input.required<FormGroup>();
  option = input.required<FormControlOption>();
  isShowValidationsError = input<boolean>(true);
  
  isShowPass = signal<boolean>(false);

  focusInput(): void {
  const inputRef =this.inputRef()?.nativeElement;
  if(inputRef){
  inputRef.focus();
  }
  }

shouldShowValidation(): boolean {
const control = this.form().controls[this.option().formControlName];
return control ? (control.invalid && (control.touched || control.dirty)) : false;
}

shouldShowErrorsValidation(): string {
  const controlName = this.option().formControlName;
  const control = this.form().controls[controlName];

  if (!control) return '';
  const errors = control.errors;
  if (!errors) return '';

  // Required
  if (errors['required']) {
    return this.translationService.heroTexts('messages.required');
  }

  // Email
  if (errors['email']) {
    return this.translationService.heroTexts('messages.email');
  }

  // Password mismatch
  if (errors['passwordMismatch']) {
    return this.translationService.heroTexts('messages.passwordMismatch');
  }

  // Simplified general invalid cases
  if (errors['pattern'] || errors['minlength'] || errors['maxlength']) {
    return this.translationService.heroTexts('messages.invalid');
  }

  // Default fallback
  return this.translationService.heroTexts('messages.invalid');
}

  
}
