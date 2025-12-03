import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-logo',
  imports: [CommonModule],
  template: `
  <a 
  aria-label="Logo" title="Logo" routerLink="/public/feed"  
  class="text-brand-color  cursor-pointer  italic font-bold
  hover:text-brand-color/50 duration-300 transition-all"
  [ngClass]="styleClass() || 'text-lg'">
  Link Sphere
  </a>
  `,
})
export class Logo {
  styleClass = input<string>('');
}
