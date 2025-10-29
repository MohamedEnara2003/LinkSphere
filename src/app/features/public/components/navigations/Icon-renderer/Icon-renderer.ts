import { Component, ElementRef,input, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-icon-renderer',
  template: `
  <span aria-label="Icon" > 
  @switch (fill()) {

  @case ('solid') {
<svg 
  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
  [class]="styleClass()"
  [innerHTML]="trustedSvg()"
  >
</svg>
  }

  @case ('outline') {
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
[class]="styleClass()"
[innerHTML]="trustedSvg()">
</svg>
  }

  }

  </span>
  `,

})
export class IconRenderer {
 
  svgString = input<string>('');
  styleClass= input<string>('');

  fill = input<'outline' | 'solid'>('solid');


  trustedSvg = signal<SafeHtml>('');
  constructor(private sanitizer: DomSanitizer, private el: ElementRef) {}

    ngOnInit(): void {
    this.trustedSvg.set(this.sanitizer.bypassSecurityTrustHtml(this.svgString()|| ''));
    } 


}
