import { Component, computed, inject } from '@angular/core';
import { ImageFullscreenService } from '../../../../core/services/style/image-fullscreen.service';


@Component({
  selector: 'app-ng-image-fullscreen',
  imports: [],
  template: `
  <section
  class="w-full h-svh fixed inset-0 z-[100] flex items-center  justify-center backdrop-blur-sm
  transition-opacity duration-300 ease-out"
  role="dialog"
  aria-modal="true"
  [aria-hidden]="isLoad()"
  aria-labelledby="image-preview-title"
  (click)="closePreview()"
>
  
  <div
    class="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ease-out"
   [aria-hidden]="isLoad()"
  ></div>

  <div
    class="relative z-50 p-4 flex items-center justify-center max-h-[95vh] max-w-[95vw]"
    (click)="$event.stopPropagation()"
  >

    <h2 id="image-preview-title" class="sr-only">Image preview</h2>

    <img
      [src]="previewSrc()"
      alt="Preview image"
      loading="lazy"
      decoding="async"
      fetchpriority="auto"
      referrerpolicy="no-referrer"
      class="max-h-[95vh] max-w-[95vw] w-auto h-auto object-contain animate-opacity
      rounded-lg shadow-2xl transition-transform duration-300
      ease-out animate-scaleIn cursor-zoom-out"
      (click)="closePreview()"
      (error)="onError()"
    />
  </div>
</section>

  `,
})
export class NgImageFullscreen {
  readonly #imageFullscreen = inject(ImageFullscreenService);
  previewSrc = computed(() => this.#imageFullscreen.previewSrc());
  isLoad = computed(() => this.#imageFullscreen.isLoad());
  
  onError(): void {
  this.closePreview();
  }

  public closePreview() : void {
  this.#imageFullscreen.closePreview();
  }


}
