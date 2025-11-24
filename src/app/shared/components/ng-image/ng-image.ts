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

  <!-- Fullscreen Preview -->
  @if (preview()) {
  <section
  class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm
  transition-opacity duration-300 ease-out animate-fadeIn"
  role="dialog"
  aria-modal="true"
  aria-labelledby="image-preview-title"
  (click)="closePreview()"
>
  
  <div
    class="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ease-out"
    aria-hidden="true"
  ></div>

  <!-- المحتوى -->
  <div
    class="relative z-50 p-4 flex items-center justify-center max-h-[95vh] max-w-[95vw]"
    (click)="$event.stopPropagation()"
  >

    <h2 id="image-preview-title" class="sr-only">Image preview</h2>

    <button
      type="button"
      (click)="closePreview()"
      class="absolute top-4 right-5 btn btn-sm btn-circle ngBtn"
      aria-label="Close image preview"
    >
      <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="size-6">
        <path fill-rule="evenodd"
        d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 
        1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 
        13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 
        5.47 6.53a.75.75 0 0 1 0-1.06Z"
        clip-rule="evenodd" />
      </svg>
    </button>

    
    <img
      [src]="options().src"
      [alt]="options().alt || 'Preview image'"
      [loading]="options().loading || 'lazy'"
      [decoding]="options().decoding || 'async'"
      [attr.fetchpriority]="options().fetchpriority || 'auto'"
      [attr.referrerpolicy]="options().referrerpolicy || 'no-referrer'"
      class="max-h-[95vh] max-w-[95vw] w-auto h-auto object-contain
      rounded-lg shadow-2xl transition-transform duration-300
      ease-out animate-scaleIn cursor-zoom-out"
      (click)="closePreview()"
      (error)="onError()"
    />
  </div>
</section>


    }
  `,
})
export class NgImage {
  #domService = inject(DomService);

  public options = model.required<ImageOption>();
  isPreview = input<boolean>(false);

  isError = signal<boolean>(false);
  preview = signal<boolean>(false);


  onError(): void {
    this.options.update((prev) => ({
      ...prev,
      src: prev.placeholder || 'Image-Not-Found.webp',
    }));
    this.isError.set(true);
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
