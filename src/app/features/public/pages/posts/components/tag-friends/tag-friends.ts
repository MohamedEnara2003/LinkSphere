import { Component, computed, inject, input, model } from '@angular/core';

import { FormGroup} from '@angular/forms';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { NgImage } from '../../../../../../shared/components/ng-image/ng-image';
import { UserProfileService } from '../../../profile/services/user-profile.service';
import { TagsService } from '../../../../../../core/services/tags.service';
import { IFriend } from '../../../../../../core/models/user.model';




@Component({
selector: 'app-tag-friends',
imports: [SharedModule, NgImage],
template: `

 <section class="size-full ngCard rounded-none md:rounded-2xl border border-brand-color/10 
p-5 z-10 animate-up flex flex-col gap-2">

  <header class="flex justify-between gap-5 border-b-2 border-dark/25 pb-2">
    <button (click)="isOpenTagModel.set(!isOpenTagModel())"
      type="button" class="btn btn-sm btn-circle bg-transparent ngText">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
        stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    </button>

    <h2 class="ngText text-xl">Tag friends</h2>

    <button (click)="isOpenTagModel.set(!isOpenTagModel())"
      type="submit" class="ngBtn btn-sm"
      [disabled]="tagsService.tags.length === 0">
      Add
    </button>
  </header>

  <div>
    <label class="w-full input input-neutral bg-dark/50 border-transparent">
      <label for="Search-people" class="label">    
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" 
          stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" 
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </label>
      <input type="text" id="Search-people" placeholder="Who are you with?" 
        class="placeholder:text-gray-400">
    </label>
  </div>

  <h2 class="badge bage-sm bg-brand-color/20 text-brand-color">Suggestions</h2>

  <ul class="w-full h-full overflow-y-auto  p-1 flex flex-col gap-5 " 
  style="scrollbar-width: none;">
    @for (friend of friends(); track friend._id) {
      <li class="w-full flex items-center justify-between gap-4">
        <label [for]="'Tag-' + friend.userName" 
          class="w-full flex gap-4 font-normal hover:text-brand-color ngCard cursor-pointer p-1 px-2"
          [ngClass]="tagsService.isUserTagged(friend._id) ? 'text-brand-color' : 'ngText'">
          <app-ng-image
            [options]="{
              src : friend.picture || '/user-placeholder.jpg',
              alt :'Profile picture of ' + friend.userName,
              width :  32,
              height : 32,
              class : 'size-8 rounded-full object-cover mb-2'
            }"
          />
          {{friend.userName}}
        </label>

        <input type="checkbox" [name]="'Tag-' + friend.userName" [id]="'Tag-' + friend.userName"
          (change)="tagsService.toggleTag(friend._id || '', $event.target.checked)"
          [checked]="tagsService.isUserTagged(friend._id)"
          class="ng-checkbox">
      </li>
    }

  </ul>
</section>
`,
})
export class TagFriends {
  tagsService = inject(TagsService);
  userService = inject(UserProfileService);

  friends = computed<IFriend[]>(() => (this.userService.user()?.friends || []));

  isOpenTagModel = model<boolean>(false);
  postForm = input.required<FormGroup>();

  ngOnInit() {
  this.tagsService.initForm(this.postForm());
  }

}
