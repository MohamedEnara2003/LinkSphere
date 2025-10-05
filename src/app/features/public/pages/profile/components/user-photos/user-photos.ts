import { Component, signal } from '@angular/core';

import { NgImage } from "../../../../../../shared/components/ng-image/ng-image";

@Component({
  selector: 'app-user-photos',
  imports: [NgImage],
  template: `
    <section class="w-full" aria-labelledby="photos-title">
      <!-- Section Title -->
      <h2 
        id="photos-title" 
        class="text-lg md:text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Photos
      </h2>

      <!-- Photos Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        @for (photo of photos(); track photo.id) {
          <figure class="relative group overflow-hidden rounded-xl shadow hover:shadow-lg transition">
            <app-ng-image
              [options]="{
                src : photo.src,
                alt : photo.alt,
                width : 1200,
                height : 600,
                class : 'w-full h-40 sm:h-48 object-cover rounded-xl transition-transform duration-500 group-hover:scale-105'
              }"
              [isPreview]="true"
            />
            <figcaption class="sr-only">
              {{ photo.alt }}
            </figcaption>
          </figure>
        }
      </div>
    </section>
  `
})
export class UserPhotos {
  photos = signal(
    Array.from({ length: 8 }).map((_, i) => ({
      id: i + 1,
      src: `/cover-image.jpg`, // تقدر تبدل بـ صور مختلفة
      alt: `Photo ${i + 1} of Mohamed Enara`
    }))
  );
}
