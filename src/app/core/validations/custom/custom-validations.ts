import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AllowComments, Availability, IPost } from '../../models/posts.model';
import { IComment } from '../../models/comments.model';


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

  
static post(existingPost?: IPost): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {

    const contentControl = formGroup.get('content');
    const attachmentsControl = formGroup.get('attachments');

    const availabilityControl = formGroup.get('availability');
    const allowCommentsControl = formGroup.get('allowComments');
    const tagsControl = formGroup.get('tags');

    if (!contentControl || !attachmentsControl) return null;

    const newContent = contentControl.value?.trim() as string;
    const newAttachments = attachmentsControl.value as File[];
    const newAvailability = availabilityControl?.value as Availability;
    const newAllowComments = allowCommentsControl?.value as AllowComments;
    const newTags = tagsControl?.value as string[];

    // Create Mode
    if (!existingPost) {
      const isValid = !!newContent || (newAttachments && newAttachments.length > 0);
      return isValid ? null : { requiredPostData: true };
    }

    // Update Mode 
    const contentChanged = newContent !== existingPost.content?.trim();
    const attachmentsChanged = JSON.stringify(newAttachments) !== JSON.stringify(existingPost.attachments);
    const availabilityChanged = newAvailability !== existingPost.availability;
    const allowCommentsChanged = newAllowComments !== existingPost.allowComments;
    const tagsChanged = JSON.stringify(newTags) !== JSON.stringify(existingPost.tags);

    const anyChanged =
      contentChanged ||
      attachmentsChanged ||
      availabilityChanged ||
      allowCommentsChanged ||
      tagsChanged;

    if (!anyChanged) {
      return { noChanges: true };
    }

    return null;
  };
}

static comment(existingComment?: IComment): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {

    const contentControl = formGroup.get('content');
    const attachmentsControl = formGroup.get('attachments');
    const tagsControl = formGroup.get('tags');

    if (!contentControl || !attachmentsControl) return null;

    const newContent = contentControl.value?.trim() as string;
    const newAttachments = attachmentsControl.value as File[];
    const newTags = tagsControl?.value as string[];

    // Create Mode
    if (!existingComment) {
      const isValid = !!newContent || (newAttachments && newAttachments.length > 0);
      return isValid ? null : { requiredPostData: true };
    }

    // Update Mode 
    const contentChanged = newContent !== existingComment.content?.trim();
    const attachmentsChanged = JSON.stringify(newAttachments) !== JSON.stringify(existingComment.attachment);

    const tagsChanged = JSON.stringify(newTags) !== JSON.stringify(existingComment.tags);

    const anyChanged =
      contentChanged ||
      attachmentsChanged ||
      tagsChanged;
    if (!anyChanged) {
      return { noChanges: true };
    }

    return null;
  };
}


}
