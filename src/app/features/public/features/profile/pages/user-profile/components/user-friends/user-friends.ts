import { Component, input } from '@angular/core';
import { NgImage } from "../../../../../../../../shared/components/ng-image/ng-image";
import { SharedModule } from '../../../../../../../../shared/modules/shared.module';
import { IFriend } from '../../../../../../../../core/models/user.model';



@Component({
  selector: 'app-user-friends',
  imports: [NgImage, SharedModule],
  template: `
    <section 
      class="w-full pb-10" 
      aria-labelledby="friends-title">

    <!-- Section Title -->

      @if(isShowTitle()) {
      <h2 
        id="friends-title" 
        class="text-lg md:text-xl font-bold mb-4 ngText flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="size-6 text-brand-color">
        <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
        {{ 'profile.friends.title' | translate }}
      </h2>
    }

    <!-- Friends List -->
    <ul 
    [ngClass]="ulStyleClass() || 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5'"
    aria-label="User friends list"
    role="list">

    @for (friend of friends(); track friend._id) {
    <li 
    class="w-full flex flex-col items-center ngCard
    rounded-lg p-3 shadow hover:shadow-md transition"
    role="listitem"
    >
    
  <!-- Avatar -->
  <div class="size-18 rounded-full overflow-hidden mb-2 border-2 border-brand-color ">
    <app-ng-image
    [title]="'Your friend ' + friend.firstName.toLowerCase()"
    [routerLink]="[ '/public/profile/user' , friend._id]"
    [options]="{
      src : friend.picture?.url || '',
      placeholder : '/user-placeholder.webp',
      alt :('profile.friends.profile_picture_of' | translate) + ' ' + friend.firstName,
      width : 64,
      height : 64,
      class : 'size-full rounded-full object-cover  duration-500 hover:scale-110 cursor-pointer'
    }"
  />
  </div>
            <!-- Friend Name -->
            <p class="text-sm font-semibold ngText">
              {{ friend.firstName }}
            </p>

            <!-- Username -->
            <span 
              class="text-xs text-gray-500 dark:text-gray-400" 
              aria-label="Username">
              @{{ friend.userName }}
            </span>
          </li>
        }
        @empty {
        <li class="col-span-full flex flex-col items-center justify-center py-10 text-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="size-18">
        <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
            <p class="text-sm md:text-base">{{  'profile.friends.no_friends' | translate }}</p>
          </li>
        }
      </ul>
    </section>
  `,
})
export class UserFriends {
  isShowTitle = input<boolean>(true);
  friends = input<IFriend[]>([]);
  ulStyleClass = input<string>('');
}
