import { Component, input } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';


@Component({
  selector: 'app-logo',
  imports: [SharedModule],
  template: `
  <h1 routerLink="/" aria-label="Logo"
  class="text-brand-color  cursor-pointer hover:scale-105 italic font-bold
  hover:text-brand-color/50 duration-300 transition-all"
  [ngClass]="styleClass() || 'text-lg'">
  Link Sphere
  </h1>
  `,
})
export class Logo {
  styleClass = input<string>('');
}
