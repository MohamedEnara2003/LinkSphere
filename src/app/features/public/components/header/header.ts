import { Component, inject, signal } from '@angular/core';
import { Logo } from "../../../../shared/components/logo/logo";
import { SharedModule } from '../../../../shared/modules/shared.module';
import { MainLinks } from "../navigations/main-links";
import { ResponsiveNavLinks } from "../responsive-nav-links/responsive-nav-links";
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  imports: [Logo, SharedModule, MainLinks, ResponsiveNavLinks],
  template: `
@if(!isHide()){ 
<header  class="w-full ngCard  px-4 py-2 md:py-4 flex justify-between  items-center z-20   
md:sticky md:top-0 ">
  <app-logo styleClass="size-12" />

  <nav class="w-md lg:w-xl hidden md:block">
  <app-main-links />
  </nav>

<div></div>
</header>

<app-responsive-nav-links  class="md:hidden"/>
}
  `,

})
export class Header {
  isHide = signal<boolean>(false);
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  

  constructor(){
  this.getRouteChildData();
  }

private getRouteChildData(): void {
  this.isHide.set(this.#route.snapshot.firstChild?.data['isHide'] || false);

  this.#router.events
    .pipe(takeUntilDestroyed())
    .subscribe(() => {
      this.isHide.set(this.#route.snapshot.firstChild?.data['isHide'] || false);
    });
}



}
