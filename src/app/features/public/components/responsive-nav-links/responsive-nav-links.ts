import { afterRenderEffect, Component, DestroyRef, inject, signal } from '@angular/core';
import { fromEvent, map, pairwise, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MainLinks } from "../navigations/main-links";

@Component({
  selector: 'app-responsive-nav-links',
  imports: [MainLinks],
  template: `
  @if (isScroll()) {
  <nav aria-label="Responsive Navigation Links" role="navigation"
  class="w-full fixed bottom-0 left-0  bg-dark p-1 animate-up z-20 ">
  <app-main-links />
  </nav>
  }
  `,
})
export class ResponsiveNavLinks {
  #destroyRef = inject(DestroyRef);
  isScroll = signal(true);
  
  constructor(){
  this.handleScrolling();
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
