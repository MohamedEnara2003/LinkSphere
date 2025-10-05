import { CommonModule } from '@angular/common';
import { Component, inject, model, signal } from '@angular/core';
import { NgImage } from "../../../../../../../../../shared/components/ng-image/ng-image";
import { UploadService } from '../../../../../../../../../core/services/upload/upload.service';


@Component({
  selector: 'app-update-user-picture',
  standalone: true,
  imports: [CommonModule, NgImage],
  template: `
    <section class="w-full flex flex-col gap-5 items-center" aria-labelledby="user-picture-title">
      <!-- Title -->
      <h2 id="user-picture-title" class="text-xl font-semibold text-base-content">
        Update Profile Picture
      </h2>

      <!-- Current Picture -->
      <app-ng-image
        [options]="{
          src: currentPicture(),
          alt: 'Current profile picture',
          width: 150,
          height: 150,
          class: 'size-40 rounded-full object-cover border-2 border-brand-color'
        }"
        [isPreview]="true"
      />

      <!-- Upload Input -->
      <label class="ngBtn w-full max-w-xs">
        Choose New Picture
        <input
          type="file"
          accept="image/*"
          hidden
          (change)="onFileSelected($event.target)"
        />
      </label>

      <!-- Preview New Picture -->
      @if (uploadService.previews.length > 0) {
        <div class="flex flex-col gap-3 items-center">
          <span class="text-sm text-gray-500">Preview:</span>
          <app-ng-image
            [options]="{
              src: uploadService.previews[0],
              alt: 'New profile picture preview',
              width: 150,
              height: 150,
              class: 'size-40 rounded-full object-cover border-2 border-dashed border-brand-color'
            }"
            [isPreview]="true"
          />
          <button class="btn btn-primary btn-sm" (click)="savePicture()">Save Picture</button>
          <button class="btn btn-ghost btn-sm" (click)="uploadService.clear()">Cancel</button>
        </div>
      }
    </section>
  `,
})
export class UpdateUserPictureComponent {
  uploadService = inject(UploadService);

  // صورة المستخدم الحالية (ممكن تيجي من API/Supabase)
  currentPicture = model<string>('https://placehold.co/150x150/png?text=User');

    onFileSelected(input: HTMLInputElement) {
    this.uploadService.uploadAttachments(input);
    }

  savePicture() {
    const file = this.uploadService.getFiles();
    if (file instanceof File) {

      // Update UI بعد الحفظ
      this.currentPicture.set(this.uploadService.previews[0]);
      this.uploadService.clear();
    }
  }

ngOnDestroy(): void {
this.uploadService.clear();
}
}
