import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserProfileService } from '../../services/user-profile.service';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { UserPicture } from "../user-picture/user-picture";


@Component({
selector: 'app-profile-card',
imports: [ RouterModule, SharedModule, UserPicture],
template: `
<article class="size-full  overflow-y-auto ngCard p-4 flex flex-col  items-center  "
    role="region" 
    [attr.aria-label]="'profile.profile_card.user_profile_card' | translate"
    >
  
        <app-user-picture         
        title="{{ userProfileService.user()?.firstName }} {{ userProfileService.user()?.lastName }}"
        [routerLink]="['/public/profile/user', userProfileService.user()?._id ]"
        styleClass="size-50 object-cover  rounded-full shadow-md hover:scale-105 
        transition-transform duration-300 cursor-pointer"
        />

      <!-- بيانات المستخدم -->
      <address class="card-body  text-center items-center ">
        <h2 
          class="card-title text-2xl font-bold ngText" 
          [attr.aria-label]="'profile.profile_card.full_name' | translate"
        >
          {{ userProfileService.user()?.firstName }} {{ userProfileService.user()?.lastName }}
        </h2>

        <p class="text-sm text-base-content/70" [attr.aria-label]="'profile.profile_card.username' | translate">
          @{{ userProfileService.user()?.userName }}
        </p>

        <button 
        type="button" 
        [routerLink]="['/public/profile/user', userProfileService.user()?._id ]"
        class="w-full ngBtn">
        {{'navigation.my_profile' | translate}}
        </button>

      </address>

</article>


`,
})
export class ProfileCard {
userProfileService = inject(UserProfileService);


}
