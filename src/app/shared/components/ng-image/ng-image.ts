import { CommonModule,  } from '@angular/common';
import { Component, inject, input, model, signal } from '@angular/core';
import { ImageFullscreenService } from '../../../core/services/style/image-fullscreen.service';

export interface ImageOption {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  class?: string;
  placeholder?: string;

  figcaption?: string;
  figcaptionClass?: string;

  loading?: 'lazy' | 'eager' | null;
  decoding?: 'async' | 'sync' | 'auto';
  fetchpriority?: 'high' | 'low' | 'auto';
  referrerpolicy?: ReferrerPolicy;
  srcset?: string;
  sizes?: string;
}

@Component({
  selector: 'app-ng-image',
  imports: [CommonModule],
  template: `

      <!-- Normal Image -->
      @if(options().src){ 
      <img
        [src]="options().src"
        [srcset]="options().srcset || ''"
        [sizes]="options().sizes || ''"
        [alt]="options().alt"
        role="img"
        [width]="options().width"
        [height]="options().height"
        [ngClass]="options().class"
        [loading]="options().loading || 'lazy'"
        [decoding]="options().decoding || 'async'"
        [attr.fetchpriority]="options().fetchpriority || 'auto'"
        [attr.referrerpolicy]="options().referrerpolicy || 'no-referrer'"
        (click)="(isPreview() && !isError()) ? openPreview() : null"
        (error)="onError()"
        [class]="(isPreview() && !isError() )? 'cursor-zoom-in' : '' "
      />
    }@else {
    <div [ngClass]="options().class" class="ng-skeleton"></div>
    }


  `,
})
export class NgImage {
  readonly #imageFullscreen = inject(ImageFullscreenService);
  public options = model.required<ImageOption>();
  isPreview = input<boolean>(false);
  isError = signal<boolean>(false);


  onError(): void {
    this.options.update((prev) => ({
      ...prev,
      src: prev.placeholder || 'Image-Not-Found.webp',
    }));
    this.isError.set(true);
  }

  public closePreview() : void {
  this.#imageFullscreen.closePreview();
  }

public openPreview(): void {
const src = this.options().src;
const isPreview = this.isPreview();
if(isPreview && src){
this.#imageFullscreen.openPreview(src);
}
}




}
