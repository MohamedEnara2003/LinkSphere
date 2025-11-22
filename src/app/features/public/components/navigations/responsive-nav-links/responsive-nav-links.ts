import { Component } from '@angular/core';

import { MainLinks } from "../main-links";

@Component({
  selector: 'app-responsive-nav-links',
  imports: [MainLinks],
  template: `
  <nav aria-label="Responsive Navigation Links" role="navigation"
  class="w-full fixed bottom-0 left-0  bg-dark p-1 animate-up z-20 ">
  <app-main-links />
  </nav>
  `,
})
export class ResponsiveNavLinks {

}
