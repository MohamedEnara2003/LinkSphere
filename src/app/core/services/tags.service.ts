import { inject, Injectable } from '@angular/core';
import { UserProfileService } from '../../features/public/pages/profile/services/user-profile.service';
import { FormArray, FormGroup, NonNullableFormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class TagsService {

  #userService = inject(UserProfileService);
  #fb = inject(NonNullableFormBuilder);

  form!: FormGroup;

  initForm(form: FormGroup) {
    this.form = form;
  }

get tags(): FormArray {
  return this.form.get('tags') as FormArray;
}

 removeTag(index: number): void {
    if (index < 0 || index >= this.tags.length) return;

    const userId = this.tags.at(index).value;
    this.tags.removeAt(index);

    const existing: string[] = this.form.get('existingTags')?.value || [];
    if (existing.includes(userId)) {
      const removedCtrl = this.form.get('removedTags');
      const current = removedCtrl?.value || [];
      if (!current.includes(userId)) {
        removedCtrl?.setValue([...current, userId]);
      }
    }
  }

  isUserTagged(userId: string): boolean {
    return this.tags.value.includes(userId);
  }

  toggleTag(userId: string, checked: boolean) {
    if (!this.form) return;

    const tagsArray = this.tags;
    const id = String(userId);

    if (checked && !tagsArray.value.includes(id)) {
      tagsArray.push(this.#fb.control(id));
    } else if (!checked) {
      const index = tagsArray.controls.findIndex(c => c.value === id);
      if (index !== -1) tagsArray.removeAt(index);
    }
  }

getUserNameById(userId: string): string {
    return (
    this.#userService
        .user()
        ?.friends?.find((f) => f._id === userId)?.userName || userId
    );
}


generateTagText(): string {
  if (!this.form) return '';
  
  const tagsArray = this.form.get('tags') as FormArray;
  if (!tagsArray) return '';

  const taggedIds: string[] = tagsArray.value ?? [];

  if (taggedIds.length === 0) return '';
  return this.initTagText(taggedIds);
}


initTagText(taggedIds : string[]) : string {
  const taggedNames = taggedIds
  .map(id => this.getUserNameById(id))
  .filter(name => !!name);

  const count = taggedNames.length;

  if (count === 1) return `is with ${taggedNames[0]}`
  else if (count === 2) return `is with ${taggedNames[0]} and ${taggedNames[1]}`;
  return `is with ${taggedNames[0]} and ${count - 1} others`;
}


}
