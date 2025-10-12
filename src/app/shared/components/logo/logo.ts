import { Component, input } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';


@Component({
  selector: 'app-logo',
  imports: [SharedModule],
  template: `
  <h1 aria-label="Logo">
    
  <span routerLink="/"    
  class="text-brand-color  cursor-pointer  italic font-bold
  hover:text-brand-color/50 duration-300 transition-all"
  [ngClass]="styleClass() || 'text-lg'"> 
  Link Sphere
  </span>

  </h1>
  `,
})
export class Logo {
  styleClass = input<string>('');
}
