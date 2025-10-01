import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-logo',
  imports: [RouterModule],
  template: `
  <h1 routerLink="/"
  class="italic font-bold text-brand-color text-lg cursor-pointer hover:scale-105
  hover:text-brand-color/50 duration-300 transition-all">
  Link Sphere
  </h1>
  `,
})
export class Logo {
  styleClass = input<string>('');
}
