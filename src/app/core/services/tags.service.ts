import { inject, Injectable } from '@angular/core';
import { UserProfileService } from '../../features/public/pages/profile/services/user-profile.service';
import { FormArray, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { PostsStateService } from '../../features/public/pages/posts/service/state/posts-state.service';


@Injectable({
  providedIn: 'root',
})
export class TagsService {

  #postsStateService = inject(PostsStateService);
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
  this.tags.removeAt(index);
  }

  isUserTagged(userId: string): boolean {
  return this.tags.value.includes(userId);
  }
  

  #removedTags(id : string) : void {
    const removedTagsCtrl = this.form.get('removedTags');
        if (removedTagsCtrl && removedTagsCtrl instanceof FormArray) {
          const current : string[] = removedTagsCtrl.value || [];
          if (!current.includes(id)) {
            removedTagsCtrl.push(this.#fb.control(id));
          }else{
          const index = removedTagsCtrl.controls.findIndex((tId ) => (tId.value) === id);
          if(index < -1) return;
          removedTagsCtrl.removeAt(index);
          }
        }
  }

  toggleTag(userId: string, checked: boolean): void {
    if (!this.form) return;

    const tagsArray = this.tags;
    if (!tagsArray) return; // Guard: ensure FormArray exists

    const id = String(userId);
    const existingPost = this.#postsStateService.post();


    if (checked && !tagsArray.value.includes(id)) {

      // Add tag if checked and not already tagged
      tagsArray.push(this.#fb.control(id));
    
    } else if (!checked) {
      // Remove tag if unchecked
      const index = tagsArray.controls.findIndex(c => c.value === id);
      if (index !== -1) {
        tagsArray.removeAt(index);
      }
    }

      // If this was an existing tag, add to removedTags
      if (existingPost && existingPost.tags.includes(id)) {
      this.#removedTags(id);
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


clearForm() : void {
  this.form = this.#fb.group({
    content: this.#fb.control(''),
    tags: this.#fb.array([]),
    existingTags: this.#fb.array([]),
    removedTags: this.#fb.array([]),
  });
}

}
