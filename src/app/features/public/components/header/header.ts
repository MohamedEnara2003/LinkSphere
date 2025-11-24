import { afterRenderEffect, Component, DestroyRef, inject, signal } from '@angular/core';
import { Logo } from "../../../../shared/components/logo/logo";
import { MainLinks } from "../navigations/main-links";
import { ResponsiveNavLinks } from "../navigations/responsive-nav-links/responsive-nav-links";
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LinkUserProfile } from "../navigations/link-user-profile/link-user-profile";
import { fromEvent, map, pairwise, tap } from 'rxjs';
import { SharedModule } from '../../../../shared/modules/shared.module';
import { SearchService } from '../../pages/search/service/search.service';




@Component({
  selector: 'app-header',
  imports: [Logo, MainLinks, ResponsiveNavLinks, LinkUserProfile, SharedModule],
  template: `


@if(!isHide()){ 
  
<header aria-label="Header" role="heading"
class="w-full h-[8svh] sm:h-[10svh] ngCard rounded-none  px-4  grid  grid-cols-2 md:grid-cols-3
items-center z-50 border-b border-b-brand-color/10 sticky top-0 ">


  <nav  role="navigation" class="w-ful">
  <app-logo />
  </nav>

  <nav  role="navigation" class="w-full  hidden md:block">
  <app-main-links />
  </nav>
 

<nav  role="navigation" class="w-full flex justify-end   gap-4 "> 
    <button 
    routerLink="/public/search"
    type="button" aria-label="Button search page" class="ngBtnIcon">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
    </button>

  <app-link-user-profile [isProfile]="isProfile()" 
  />
  

</nav>


</header>
@if(isScroll()){
<app-responsive-nav-links  class="md:hidden"
/>
}

}
  `,

})
export class Header {
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  


  isProfile = signal<boolean>(false);
  isHide = signal<boolean>(false);
  isScroll = signal(true);
constructor(){
this.getRouteChildData();
  this.handleScrolling();
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



  private handleScrolling() : void {
  afterRenderEffect(() => {
  fromEvent(window , 'scroll').pipe(
  map(() => window.scrollY),
  pairwise(),
  tap(([a , b]) => this.isScroll.set(a > b || a < 50 && b < 50 ? true : false)),
  takeUntilDestroyed(this.#destroyRef)
  ).subscribe();
  })
  }

}
