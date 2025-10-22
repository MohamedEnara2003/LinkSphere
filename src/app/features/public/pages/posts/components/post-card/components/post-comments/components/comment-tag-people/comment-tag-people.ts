import { Component, computed, inject, input, model } from '@angular/core';
import { NgImage } from '../../../../../../../../../../shared/components/ng-image/ng-image';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { UserProfileService } from '../../../../../../../profile/services/user-profile.service';
import { IFriend } from '../../../../../../../../../../core/models/user.model';
import { SharedModule } from '../../../../../../../../../../shared/modules/shared.module';

@Component({
  selector: 'app-comment-tag-people',
  imports: [SharedModule, NgImage, ],
  template: `

<section class="relative w-full ngCard rounded border border-brand-color/50 p-2 z-10 animate-up">
  <!-- Header -->
  <header class="flex items-center justify-between mb-2 border-b border-brand-color/30 pb-1">

    <h3 class="text-sm sm:text-base font-medium text-brand-color">
      Tag Friends
    </h3>

    <button
      type="button"
      (click)="isVisible.set(false)"
      class="p-1 text-gray-500 hover:text-red-500 transition-colors"
      title="Close"
    >
       &times;
    </button>
  </header>

  <!-- Friends List -->
  <ul class="w-full h-40 max-h-48 overflow-y-auto flex flex-col gap-1 scrollbar-colored">
    @for (friend of friends(); track friend._id) {
      <li
        class="w-full flex items-center gap-2 hover:bg-brand-color/60 p-1 rounded cursor-pointer transition-colors"
        (click)="createTag(friend)"
      >
        <app-ng-image
          [options]="{
            src: friend.picture || '/user-placeholder.jpg',
            alt: friend.userName,
            width: 32,
            height: 32,
            class: 'size-8 rounded-full object-cover'
          }"
        />
        <span class="ngText text-sm">{{ friend.userName }}</span>
      </li>
    }@empty {
     <li class="flex flex-col items-center justify-center gap-2 py-8 text-gray-500 dark:text-gray-400">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
</svg>

        <p class="text-sm text-center">No friends available to tag</p>
      </li>
    }
  </ul>
</section>

    

`
})
export class CommentTagPeople {
  userService = inject(UserProfileService);
  commentForm = input<FormGroup>();
  isVisible = model<boolean>(false);


    friends = computed<IFriend[]>(() => (this.userService.user()?.friends || []));


    public get tags(): FormArray {
    return this.commentForm()?.get('tags') as FormArray;
    }

  createTag(friend: IFriend): void {
    const alreadyExists = this.tags.controls.some(control => control.value === friend._id);
    if (alreadyExists) return;

    this.tags.push(new FormControl(friend._id));
    this.isVisible.set(false);  
  }


}