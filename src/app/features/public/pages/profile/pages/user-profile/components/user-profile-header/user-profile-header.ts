import { ChangeDetectionStrategy, Component,computed,inject } from '@angular/core';
import { NgImage } from "../../../../../../../../shared/components/ng-image/ng-image";
import { SharedModule } from '../../../../../../../../shared/modules/shared.module';
import { UserProfileService } from '../../../../services/user-profile.service';
import { FriendActionButton } from "../friend-action-button/friend-action-button";

@Component({
  selector: 'app-user-profile-header',
  imports: [NgImage, SharedModule , FriendActionButton],
  template: `


    <!-- Profile Header -->
    <header class="w-full flex flex-wrap justify-center md:justify-start items-start 
    gap-6 ngCard p-4 md:p-6 ">

    
    <picture class="size-40 md:size-50  relative rounded-full border border-brand-color 
    shadow-md overflow-hidden flex  justify-end items-center ">
    <!-- Profile Picture -->
    <app-ng-image
        [options]="{
        src : userProfileService.userProfile()?.picture?.url || '',
        placeholder :  userProfileService.placeHolderUser() ,
        alt : 'Profile picture of '+  userProfileService.userProfile()?.userName,
        width : 300, 
        height : 300,
        loading : 'eager' ,
        decoding : 'async' ,
        fetchpriority : 'high', 
        class : 'object-cover size-full rounded-full  transition-transform duration-500 hover:scale-115'
        }"
      [isPreview]="userProfileService.userProfile()?.picture ? true : false"
    />

    @if(userProfileService.isMyProfile()){
      <a
      title="Update profile image"
      [href]="['/public/profile/user' , (userProfileService.user()?._id || '') ,'update']"     
      [routerLink]="['/public/profile/user' , (userProfileService.user()?._id || '') ,'update']"
      [queryParams]="{edit : 'picture'}"
      class="absolute   ngBtn   btn-circle  transition z-10 "
      >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
    <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
    </svg>
    </a>
    }
    </picture>

    <!-- User Info -->
    <section class="w-full flex flex-col items-center md:items-start gap-4">

        <!-- Hidden title for accessibility/SEO -->
        <h2 id="profile-section-title" class="sr-only">User profile</h2>
        <h3 id="profile-info-title" class="font-bold capitalize text-2xl md:text-3xl
        text-gray-900 dark:text-gray-100">
        {{userProfileService.userProfile()?.userName}}
        </h3>

        <p class="text-sm md:text-base text-gray-500 dark:text-gray-400">
        {{userProfileService.userProfile()?.email}}
        </p>

        <!-- Friends Badge -->
    <span 
    [routerLink]="[]" [queryParams]="{list : 'Friends'}"
    aria-label="Friends count"
    class="px-2 py-1 rounded-full bg-brand-color/10 text-brand-color text-sm font-medium">
    {{userProfileService.userProfile()?.friends?.length || 0}} Friends
    </span>

    <nav class="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">  

    @if(!userProfileService.isMyProfile() && userProfile()){
    <app-friend-action-button
    [relationshipState]="userProfile().flag"
    [userProfile]="userProfile()"
    />
    }
  
<button 
routerLink="/public/chats"
type="button" 
class="w-full ngBtn">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
<path fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clip-rule="evenodd" />
</svg>
Messages
</button>
</nav>


</section>
</header>
`,
changeDetection : ChangeDetectionStrategy.OnPush
})

export class userProfileHeader {
userProfileService = inject(UserProfileService);
userProfile = computed(() =>this.userProfileService.userProfile()!);
}
