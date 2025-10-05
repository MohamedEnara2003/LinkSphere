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
    aria-label="User Profile Card"
    >
  
 
        <app-user-picture         
        [routerLink]="['/public/', 'profile', userProfileService.user()?._id ]"
        styleClass="size-50 object-cover  rounded-full border-2 border-brand-color shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer"
        
        />

      <!-- بيانات المستخدم -->
      <address class="card-body  text-center items-center ">
        <h2 
          class="card-title text-2xl font-bold ngText" 
          aria-label="Full name"
        >
          {{ userProfileService.user()?.firstName }} {{ userProfileService.user()?.lastName }}
        </h2>

        <p class="text-sm text-base-content/70" aria-label="Username">
          @{{ userProfileService.user()?.userName }}
        </p>
        <p 
          class="text-sm mt-3 text-base-content/80" 
          aria-label="Email address"
        >
          📧 {{ userProfileService.user()?.email }}
        </p>

        @if (userProfileService.user()?.phone) {
          <p aria-label="Phone number">
            📞 {{ userProfileService.user()?.phone }}
          </p>
        }
      </address>
   
</article>


`,
})
export class ProfileCard {
userProfileService = inject(UserProfileService);


}
