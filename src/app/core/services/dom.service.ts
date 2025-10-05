import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DomService {
  #platform_id = inject(PLATFORM_ID);
  #document = inject(DOCUMENT);


  // Signal لتحديد إذا كان الكود يعمل على Browser
  isBrowser = signal<boolean>(isPlatformBrowser(this.#platform_id));


  /**
   * Control body scroll
   * @param value 'hidden' | 'auto'
   */
  
  setBodyOverflow(value: 'hidden' | 'auto'): void {
    if (this.isBrowser()) {
      this.#document.body.style.overflow = value;
    }
  }
}
