import { Component, inject } from '@angular/core';
import { UserProfileService } from '../../services/user-profile.service';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { UserPicture } from "../user-picture/user-picture";


@Component({
selector: 'app-profile-card',
imports: [SharedModule, UserPicture],
template: `
<article class="size-full  overflow-y-auto ngCard p-4 flex flex-col  items-center gap-10 "
    role="region" 
    [attr.aria-label]="'profile.profile_card.user_profile_card' | translate"
    >
  
        <app-user-picture         
        [path]="'/public/profile/user/' +  userProfileService.user()?._id "
        styleClass="size-50 object-cover  rounded-full shadow-md hover:scale-105 
        transition-transform duration-300 cursor-pointer"
        styleClassFigure="w-full flex flex-col  gap-4 "
        styleClassFigcaption="ngText capitalize text-2xl text-center"
        />
  
        <button 
        type="button" 
        [routerLink]="['/public/profile/user', userProfileService.user()?._id ]"
        class="w-full ngBtn">
        {{'navigation.my_profile' | translate}}
        </button>


</article>


`,
})
export class ProfileCard {
userProfileService = inject(UserProfileService);


}
