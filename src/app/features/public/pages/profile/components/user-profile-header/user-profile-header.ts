import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { NgImage } from "../../../../../../shared/components/ng-image/ng-image";
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { UserProfileService } from '../../services/user-profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile-header',
  imports: [NgImage , SharedModule],
  template: `

  
    <!-- Profile Header -->
    <header class="w-full flex flex-wrap justify-center md:justify-start items-start 
    gap-6 bg-light dark:bg-card-dark backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg">

    <!-- Profile Picture -->
    <app-ng-image
        [options]="{
        src : userProfileService.userProfile()?.picture || '',
        placeholder : userProfileService.userProfile()?.placeholder,
        alt : 'Profile picture of '+  userProfileService.userProfile()?.userName,
        width : 300, 
        height : 300,
        loading : 'eager' ,
        decoding : 'async' ,
        fetchpriority : 'high', 
        class : 'object-cover size-36 md:size-44 rounded-full border-2 border-brand-color shadow-md transition-transform duration-300 hover:scale-105'
        }"
      [isPreview]="userProfileService.userProfile()?.picture ? true : false"
    />

    <!-- User Info -->
    <section class="w-full flex flex-col items-center md:items-start gap-2">

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
    aria-label="Friends count"
    class="px-2 py-1 rounded-full bg-brand-color/10 text-brand-color text-sm font-medium">
    {{userProfileService.userProfile()?.friends?.length || 0}} Friends
    </span>



<button 
type="button" 
class="ngBtn"
(click)="onUserAction() "
>

@if(isMyProfile()){
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
<path fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clip-rule="evenodd" />
</svg>
Messages
}@else {
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
<path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
</svg>
Add Friend
}

</button>

</section>
</header>
`,
changeDetection : ChangeDetectionStrategy.OnPush
})

export class userProfileHeader {
userProfileService = inject(UserProfileService);
#router = inject(Router);

isMyProfile = input.required<boolean>();

onUserAction() : void {
if(this.isMyProfile()){
this.#router.navigate(['/public/chats']);
return
}
}

}
