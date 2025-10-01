import { CommonModule, isPlatformBrowser } from '@angular/common';
import { afterNextRender, Component, DOCUMENT, inject, input, model, PLATFORM_ID, signal } from '@angular/core';

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
    <figure class="size-full flex flex-col">
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

      <!-- Figcaption -->
      <figcaption
        [class]="options().figcaption ? (options().figcaptionClass || 'ngText') : 'sr-only'"
      >
        {{ options().figcaption }}
      </figcaption>
    </figure>

    <!-- Fullscreen Preview -->
    @if (preview()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm
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
          class="max-h-[90vh] max-w-[95vw] object-contain rounded shadow-lg cursor-zoom-out
          transition-transform duration-300 ease-out animate-scaleIn"
          (click)="closePreview()"
        />
      </div>
    }
  `,
})
export class NgImage {
  
private document = inject(DOCUMENT);
private platform_id = inject(PLATFORM_ID);
private isBrowser = signal<boolean>(isPlatformBrowser(this.platform_id));


  public options = model.required<ImageOption>();

  isPreview = input<boolean>(false);
  preview = signal<boolean>(false);


  onError(): void {
    this.options.update((prev) => ({
      ...prev,
      src: prev.placeholder || '/placeholder-img.webp',
    }));
  }

openPreview(): void {
  this.preview.set(true);
  this.setBodyOverflow('hidden')
}

closePreview(): void {
  this.preview.set(false)
  this.setBodyOverflow('auto')
}


private setBodyOverflow(value: 'hidden' | 'auto'): void {
  if (this.isBrowser() ) {  
  this.document.body.style.overflow = value;
  }
}


}
