import { CommonModule,  } from '@angular/common';
import { Component, inject, input, model, signal } from '@angular/core';
import { DomService } from '../../../core/services/dom.service';

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
        (click)="isPreview() ? openPreview() : null"
        (error)="onError()"
        [class]="isPreview() ? 'cursor-zoom-in' : '' "
      />
    
    <!-- Fullscreen Preview -->
    @if (preview()) {
      <section
        class="fixed top-0 inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm
        transition-opacity duration-300 ease-out animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-label="Image preview"
        (click)="closePreview()"
      >
        <!-- Close Button -->
        <button
          type="button"
          (click)="closePreview()"
          class="absolute top-4 right-4 btn btn-circle btn-sm bg-white text-black hover:bg-gray-200"
          aria-label="Close preview"
        >
          ✕
        </button>

        <!-- Preview Image -->
        <img
          [src]="options().src"
          [alt]="options().alt"
          [loading]="options().loading || 'lazy'"
          [decoding]="options().decoding || 'async'"
          [attr.fetchpriority]="options().fetchpriority || 'auto'"
          [attr.referrerpolicy]="options().referrerpolicy || 'no-referrer'"
          class="max-h-[90vh] max-w-[95vw] object-contain rounded shadow-lg cursor-zoom-out
          transition-transform duration-300 ease-out animate-scaleIn "
          (click)="closePreview()"
          (error)="onError()"
        />
      </section>
    }
  `,
})
export class NgImage {
  #domService = inject(DomService);
  public options = model.required<ImageOption>();

  isPreview = input<boolean>(false);
  preview = signal<boolean>(false);


  onError(): void {
    this.options.update((prev) => ({
      ...prev,
      src: prev.placeholder || '/17316704336156_Event-Image-Not-Found.jpg',
    }));
  }

openPreview(): void {
  this.preview.set(true);
  this.#domService.setBodyOverflow('hidden')
}

closePreview(): void {
  this.preview.set(false)
  this.#domService.setBodyOverflow('auto')
}



}
