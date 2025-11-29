import { Component, computed, inject } from '@angular/core';
import { NgImage } from '../../../../../../shared/components/ng-image/ng-image';
import { UserProfileService } from '../../services/user-profile.service';
import { IFriend } from '../../../../../../core/models/user.model';
import { SharedModule } from '../../../../../../shared/modules/shared.module';


@Component({
  selector: 'app-friends-list',
  imports: [NgImage, SharedModule],
  template: `
    <section 
    class="w-full ngCard " 
    aria-labelledby="friends-title">

    <!-- Friends List -->
    <ul 
    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 "
    role="list">
    @for (friend of friends(); track friend._id) {
    <li 
    class="flex flex-col items-center rounded-lg p-2 "
    role="listitem"
    >
    
    <!-- Avatar -->
    <app-ng-image
    [routerLink]="['/public/profile/user/' , friend._id]"
    [options]="{
    src : friend.picture?.url || '',
    placeholder : 'user-placeholder.jpg',
    alt :('profile.friends.profile_picture_of' | translate) + ' ' + friend.firstName,
    width :  48,
    height : 48,
    class : 'size-12 rounded-full object-cover border-2 border-brand-color mb-1  cursor-pointer '
    }"
    />
        <!-- Username -->
        <span 
        class="text-xs text-gray-500 dark:text-gray-400" 
        aria-label="Username">
        {{ friend.userName }}
        </span>
        </li>

        }@empty {
        <div 
        class="flex flex-col items-center justify-center w-full py-6 text-gray-500 dark:text-gray-400"
        >
        <span class="text-sm">
        {{ 'profile.friends.no_friends' | translate }}
        </span>
        </div>
        }
    </ul>
    </section>
`,
})
export class FriendsList {
    #userService = inject(UserProfileService);
    friends = computed<IFriend[]>(() => this.#userService.user()?.friends || []);

}
