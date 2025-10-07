import { Component, computed, inject, signal } from '@angular/core';
import { Logo } from "../../../../shared/components/logo/logo";
import { SharedModule } from '../../../../shared/modules/shared.module';
import { MainLinks } from "../navigations/main-links";
import { ResponsiveNavLinks } from "../responsive-nav-links/responsive-nav-links";
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserPicture } from "../../pages/profile/components/user-picture/user-picture";
import { UserProfileService } from '../../pages/profile/services/user-profile.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [Logo, SharedModule, TranslateModule, MainLinks, ResponsiveNavLinks, UserPicture],
  template: `
@if(!isHide()){ 
<header  
class="relative w-full h-[10svh] ngCard rounded-none  px-4  grid grid-cols-2 md:grid-cols-3  
items-center z-20 border-b border-b-brand-color/10
md:sticky md:top-0 ">

  <nav class="w-full">
    <app-logo />
  </nav>

  <nav class="w-full  hidden md:block ">
  <app-main-links />
  </nav>

<nav class="w-full flex justify-end"> 
    <a 
        [href]="profileLink()" 
        [routerLink]="profileLink()" 
        class="flex items-center gap-2 ngText text-sm font-normal ">
        <app-user-picture styleClass="size-8 object-cover rounded-full" />
        <span class="text-xs text-brand-color">{{ 'navigation.hello' | translate }}</span> Mohamed 

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
        class="size-4 duration-300 transition-transform"
        [ngClass]="isProfile() ? 'rotate-180' : ''">
          <path fill-rule="evenodd" 
          d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z" 
          clip-rule="evenodd" />
        </svg>
      </a>
  </nav>
</header>

<app-responsive-nav-links  class="md:hidden"/>
}
  `,

})
export class Header {
userProfileService = inject(UserProfileService);

isProfile = signal<boolean>(false);

profileLink = computed(() => {
  const userId = this.userProfileService.user()?._id || '' ;

  return (!this.isProfile() && userId)
    ? '/public/profile/user/' + userId
    : '/public';     
});


  isHide = signal<boolean>(false);
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  

constructor(){
this.getRouteChildData();
}

private getRouteChildData(): void {
  this.isHide.set(this.#route.snapshot.firstChild?.data['isHide'] || false);
  this.isProfile.set(this.#route.snapshot.firstChild?.data['isProfile'] || false);

  this.#router.events
    .pipe(takeUntilDestroyed())
    .subscribe(() => {
      this.isHide.set(this.#route.snapshot.firstChild?.data['isHide'] || false);
      this.isProfile.set(this.#route.snapshot.firstChild?.data['isProfile'] || false);
    });
}



}
