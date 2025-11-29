import { inject, Injectable, signal } from '@angular/core';
import { DomService } from '../document/dom.service';



@Injectable({
  providedIn: 'root'
})
export class ImageFullscreenService {
  #domService = inject(DomService);
  previewSrc = signal<string>('');
  isLoad = signal<boolean>(false);


  openPreview(src : string): void {
    this.isLoad.set(true);
    this.#domService.setBodyOverflow('hidden');
    this.previewSrc.set(src);
  }
  
  closePreview(): void {
    this.isLoad.set(false);
    this.#domService.setBodyOverflow('auto');
    this.previewSrc.set('');
  }
  
}
