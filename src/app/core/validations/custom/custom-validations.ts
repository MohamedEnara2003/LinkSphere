import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export class CustomValidators {


  static confirmPassword(passwordControlName: string, confirmPasswordControlName: string): ValidatorFn {
  return (formGroup: AbstractControl ) : ValidationErrors |  null  => {
  const passwordControl  = formGroup.get(passwordControlName) ;
  const confirmPasswordControl  = formGroup.get(confirmPasswordControlName) ;
  if(!passwordControl || !confirmPasswordControl) return null;

  if (confirmPasswordControl.errors && !confirmPasswordControl.errors['passwordMismatch']) {
  return null;
  }

  if (passwordControl.value !== confirmPasswordControl.value) {
  confirmPasswordControl.setErrors({ passwordMismatch: true });
  } else {
  confirmPasswordControl.setErrors(null);
  }
  
  return null
  }
  }

  static post(contentKey: string, attachmentsKey: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const contentControl = formGroup.get(contentKey);
      const attachmentsControl = formGroup.get(attachmentsKey);

      if (!contentControl || !attachmentsControl) return null;

      const content = contentControl.value?.trim();
      const attachments = attachmentsControl.value;

      // ✅ الشرط الأساسي: لازم واحد على الأقل يكون موجود
      const isValid = !!content || (attachments && attachments.length > 0);

      return isValid ? null : { requiredPostData: true };
    };
  }



}
