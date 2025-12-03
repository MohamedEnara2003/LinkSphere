import { Component, computed, inject, input } from '@angular/core';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { UserPicture } from "../../../features/profile/components/user-picture/user-picture";
import { UserProfileService } from '../../../features/profile/services/user-profile.service';



@Component({
  selector: 'app-link-user-profile',
  imports: [SharedModule, UserPicture],
  template: `

    <a 
        [href]="profileLink()" 
        [routerLink]="profileLink()" 
        [queryParams]="{list : profileLink() === '/public' ? null : 'Posts'} "
        class="indicator  group relative flex items-center  p-1 duration-300 transition-all ">

        <app-user-picture styleClass="size-8 sm:size-8 object-cover rounded-full" />

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
        class="size-4 duration-300 transition-transform"
        [ngClass]="isProfile() ? 'rotate-180' : ''">
        <path fill-rule="evenodd" 
        d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z" 
        clip-rule="evenodd" />
        </svg>
        
        @if(userName()){ 
        <span class="indicator-item indicator-start  mt-12   badge bg-brand-color 
        text-dark opacity-0 group-hover:opacity-100  transition-opacity duration-400 ">
        {{userName() }}
        </span>
        }
    </a>
`,

})
export class LinkUserProfile {
#userProfileService = inject(UserProfileService);

userName = computed<string>(() => this.#userProfileService.user()?.userName || '');
isProfile = input.required<boolean>();

profileLink = computed(() => {
const userId = this.#userProfileService.user()?._id || '' ;
return (!this.isProfile() && userId)
    ? '/public/profile/user/' + userId
    : '/public';     
});




}
