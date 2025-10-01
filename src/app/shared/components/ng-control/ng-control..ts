import { Component, inject, input, output } from '@angular/core';
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

        <span (click)="onClickIcon.emit()"  aria-hidden="true">
        <ng-content />
        </span>
  

        <input 
        [id]="option().id" 
        [formControlName]="option().formControlName" 
        [placeholder]="option().placeHolder || ''"
        [type]="option().type"
        [name]="option().name"
        [inputMode]="option().inputmode"
        class="placeholder:text-brand-color/50"
        [attr.aria-required]="option().isRequired"
        [attr.aria-describedby]="option().formControlName + 'Help'"
        [autocomplete]="option().autocomplete || 'on'"
        />
        </label>
        }
      }

        @if (shouldShowValidation() && isShowValidationsError()) {
        <p class="text-error text-xs mt-1 flex items-center gap-1 capitalize">
        
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
  translationService = inject(TranslationService)
  isShowValidationsError = input<boolean>(true)
  form = input.required<FormGroup>()
  option = input.required<FormControlOption>();

  onClickIcon = output<void>();


shouldShowValidation(): boolean {
  const control = this.form().controls[this.option().formControlName];
  return control ? (control.invalid && control.touched ) : false;
}


  shouldShowErrorsValidation() : string {
  const controlName = this.option().formControlName;
  const control  = this.form().controls[controlName]

  if(!control) return '' ;
  const errors = control.errors ;
  if(!errors) return '';

  if(errors['required']) {
  return `${controlName} ${this.translationService.heroTexts('messages.required')}`;
  }

  if(control.errors['email']) return `${controlName} is not valid`;

  if (errors['email']) return this.translationService.heroTexts('messages.invalid');

  if (errors['min']) {
    return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} 
    ${this.translationService.heroTexts('messages.min')}`;
  }

    if (errors['max']) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} 
      ${this.translationService.heroTexts('messages.max')}`;
    }
    if (errors['invalidSize']) {
      return this.translationService.heroTexts('messages.invalidSize');
    }

    if (errors['pattern'] && controlName === 'phone') 
    return this.translationService.heroTexts('messages.invalid');

    if (errors['minlength']) {
      if (controlName === 'postalCode') {
      return this.translationService.heroTexts('messages.minLength');
      }
      return this.translationService.heroTexts('messages.minLength');
    }

    if (errors['maxlength']) {
      if (controlName === 'postalCode') {
      return this.translationService.heroTexts('messages.maxlength');
      }
      return this.translationService.heroTexts('messages.maxlength');
    }

    if (errors['passwordMismatch']) return 'Passwords do not match' ;

  return `${controlName} ${this.translationService.heroTexts('messages.invalid')}`;
  }
  
}
