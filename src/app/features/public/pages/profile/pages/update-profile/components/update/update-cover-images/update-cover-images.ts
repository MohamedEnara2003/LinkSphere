import { CommonModule } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { NgImage } from "../../../../../../../../../shared/components/ng-image/ng-image";
import { UploadService } from '../../../../../../../../../core/services/upload/upload.service';

@Component({
  selector: 'app-update-cover-images',
  standalone: true,
  imports: [CommonModule, NgImage],
  template: `
    <section
      class="w-full flex flex-col gap-5"
      aria-labelledby="cover-images-title"
    >
      <!-- Title -->
      <h2
        id="cover-images-title"
        class="text-xl font-semibold text-base-content"
      >
        Cover Images
      </h2>

      <!-- Images Grid -->
      <div
        class="w-full grid  gap-4"
        [ngClass]="uploadService.previews.length <= 1 ? 'grid-cols-1' : 'grid-cols-2'"
      >
        @for (preview of uploadService.previews; track preview) {
          <figure class="relative group">
            <app-ng-image
            [options]="{
                src :  preview,
                alt : 'Uploaded Cover Image',
                width  : 200,
                height : 200,
                class : 'w-full h-50 object-cover shadow-md rounded-md'
            }"
            [isPreview]="true"
            />

            <!-- Remove Button -->
            <button
            type="button"
            class="absolute top-2 right-2 bg-black/60 text-white btn btn-xs btn-circle opacity-0 group-hover:opacity-100 transition"
            aria-label="Remove cover image"
            (click)="removePreview(preview)"
            >
            ✕
            </button>
        </figure>
        }@empty {
        <p class="text-gray-500">No cover images uploaded yet.</p>
        }
    </div>

    <!-- Upload Input -->
    <div class="flex items-center gap-3">
        <input
        type="file"
        multiple
        accept="image/*"
        class=" file-input file-input-info bg-brand-color/50 w-full max-w-xs"
        (change)="onFileSelect($event.target)"
        aria-label="Upload new cover images"
        />
    </div>
    </section>
`,
})
export class UpdateCoverImagesComponent {
uploadService = inject(UploadService);
coverImages = input<string[]>([]);


constructor(){
effect(() => {
this.setExistingCovers();
});
}

private setExistingCovers(){
if(this.coverImages().length > 0){
this.uploadService.setPreviews = this.coverImages();
}
}

onFileSelect(input: HTMLInputElement) {
this.uploadService.uploadAttachments(input);
}

removePreview(preview: string) {
    // ببساطة نعمل فلترة للـ previews والـ files
    const files = this.uploadService.files;
    const previews = this.uploadService.previews;

    const index = previews.indexOf(preview);
    if (index > -1) {
    const newPreviews = previews.filter((_, i) => i !== index);
    const newFiles = files.filter((_, i) => i !== index);

    this.uploadService.setFiles = newFiles;
    this.uploadService.setPreviews = newPreviews;
    }
}

ngOnDestroy(): void {
this.uploadService.clear();
}

}
