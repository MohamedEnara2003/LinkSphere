import { Component, input } from '@angular/core';
import { NgImage } from "../../../../../../shared/components/ng-image/ng-image";
import { IUser } from '../../../../../../core/models/user.model';

@Component({
  selector: 'app-user-profile-header',
  imports: [NgImage],
  template: `
    <!-- Profile Header -->
    <header class="w-full flex flex-wrap justify-center md:justify-start items-start 
    gap-6 bg-light dark:bg-card-dark backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg">

    <!-- Profile Picture -->
    <app-ng-image
        [options]="{
        src : user().picture!,
        placeholder : (user().gender === 'male' ?
        '/man-empty-avatar-photo.webp' : '/woman-empty-avatar-photo.webp'), 
        alt : 'Profile picture of '+  user().userName,
        width : 300, 
        height : 300,
        class : 'object-cover size-36 md:size-44 rounded-full border-4 border-white dark:border-dark shadow-md transition-transform duration-300 hover:scale-105'
        }"
    />

    <!-- User Info -->
    <div class="w-full flex flex-col items-center md:items-start gap-2">

        <!-- Hidden title for accessibility/SEO -->
        <h2 id="profile-section-title" class="sr-only">User profile</h2>
        <h3 id="profile-info-title" class="font-bold capitalize text-2xl md:text-3xl
        text-gray-900 dark:text-gray-100">
        {{user().userName}}
        </h3>

        <p class="text-sm md:text-base text-gray-500 dark:text-gray-400">
        {{user().email}}
        </p>

        <!-- Friends Badge -->
    <span 
      aria-label="Friends count"
      class="px-2 py-1 rounded-full bg-brand-color/10 text-brand-color text-sm font-medium">
      {{user().friends?.length}} Friends
      </span>

<button 
type="button" 
class="ngBtn ">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
<path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
</svg>
Add Friend
</button>

</div>
</header>
  `
})
export class userProfileHeader {
    user = input.required<IUser>(); 
}
