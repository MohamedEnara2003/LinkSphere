import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { NgImage } from "../../../../../../../../../shared/components/ng-image/ng-image";
import { UploadService } from '../../../../../../../../../core/services/upload/upload.service';
import { UserProfileService } from '../../../../../services/user-profile.service';
import { tap } from 'rxjs';
import { IUser } from '../../../../../../../../../core/models/user.model';

@Component({
  selector: 'app-update-cover-images',
  imports: [CommonModule, NgImage],
  template: `
    <section class="w-full flex flex-col gap-5" aria-labelledby="cover-images-title">
    @let coverImages = userProfileService.user()?.coverImages || [] ;

    
    <header class="flex justify-between items-center">
    <h2 id="cover-images-title" class="text-xl font-semibold text-base-content">
      Update Cover Images
    </h2>
    @if(coverImages.length > 0){
    <button
          title="Remove cover images "
          role="button"
          type="button"
          (click)="removeAllCoverImage()"
          class=" bg-dark/60  btn btn-sm sm:btn-md  text-error hover:text-error/50
          group-hover:opacity-100 transition z-10"
          aria-label="Remove cover image">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
          <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
          </svg>
          <span class="hidden sm:inline"> Remove all</span>
      </button>
    }
    </header>

  
      <!-- Current Covers -->
      <article class="grid gap-4" 
      [ngClass]="coverImages.length <= 1 ? 'grid-cols-1' : 'grid-cols-2'">
        @for (cover of coverImages || []; let i = $index ; track cover) {
          <app-ng-image
            [options]="{
              src: cover,
              alt: 'Current cover image',
              width:  200,
              height: 200,
              class: 'w-full h-50  object-cover rounded-md border border-base-300 shadow-sm'
            }"
            [isPreview]="true"
          />
        } @empty {
        <p class="text-gray-500">No cover images uploaded yet.</p>
        }
      </article>

      <!-- Upload Input -->
      <label class="ngBtn w-full max-w-xs">
        Choose New Cover Images
        <input
          type="file"
          accept="image/*"
          multiple
          hidden
          (change)="onFileSelected($event.target)"
        />
      </label>

      <!-- Preview New Covers -->
      @if (uploadService.previews().length > 0) {
        <article class="flex flex-col gap-4 items-center w-full">
          <span class="text-sm text-gray-500">Preview:</span>
          <div class="grid gap-4 w-full" [ngClass]="uploadService.previews().length <= 1 ? 'grid-cols-1' : 'grid-cols-2'">
            @for (preview of uploadService.previews(); track preview) {
              <figure class="relative group">
                <app-ng-image
                  [options]="{
                    src: preview,
                    alt: 'Cover preview',
                    width: 200,
                    height: 200,
                    class: 'w-full h-50 object-cover rounded-md border-2 border-dashed border-brand-color'
                  }"
                  [isPreview]="true"
                />

                <button
                  type="button"
                  class="absolute top-2 right-2 bg-black/60 text-white btn btn-xs btn-circle opacity-0 group-hover:opacity-100 transition"
                  (click)="removePreview(preview)"
                  aria-label="Remove cover image">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                </button>

              </figure>
            }
          </div>

          <div class="flex gap-3">
            <button class="btn btn-primary btn-sm" (click)="saveCovers()">Save</button>
            <button class="btn btn-ghost btn-sm" (click)="uploadService.clear()">Cancel</button>
          </div>
        </article>
      }
    </section>
  `,
})
export class UpdateCoverImagesComponent {
  uploadService = inject(UploadService);
  userProfileService = inject(UserProfileService);


  onFileSelected(input: HTMLInputElement) : void {
    this.uploadService.uploadAttachments(input);
  }

  removePreview(preview: string) : void {
    const files = this.uploadService.files();
    const previews = this.uploadService.previews();

    const index = previews.indexOf(preview);
    if (index > -1) {
      const newPreviews = previews.filter((_, i) => i !== index);
      const newFiles = files.filter((_, i) => i !== index);

      this.uploadService.setFiles = newFiles;
      this.uploadService.setPreviews = newPreviews;
    }
  }

  saveCovers(): void {
    const files = this.uploadService.files();
    const previews = this.uploadService.previews();

    if (!Array.isArray(files) || ( files.length > 3 && files.length === 0 )) return;

    this.userProfileService.uploadProfileCoverImages(files)
      .pipe(
        tap(() => {
        const user = this.userProfileService.user() ;
        if(!user) return ;
        const prevCoverImages = user.coverImages || [];

        const newUserData : IUser = { ...user, coverImages: [...prevCoverImages , ...previews] }
          this.userProfileService.setUser(newUserData);
          if(this.userProfileService.isMyProfile()){
          this.userProfileService.setUserProfile(newUserData);
          }
          this.uploadService.clear();
        })
      ).subscribe()
  }

  removeAllCoverImage () : void {
  this.userProfileService.deleteProfileCoverImages().pipe(
  tap(() => {
    const user = this.userProfileService.user() ;
    const userProfile = this.userProfileService.userProfile() ;
    if(!user || !userProfile) return;
    this.userProfileService.setUser({...user , coverImages : []});

    if(this.userProfileService.isMyProfile()){
    this.userProfileService.setUserProfile({...userProfile , coverImages : []});
    }

    this.uploadService.clear();
  })
  ).subscribe();
  }

  ngOnDestroy(): void {
    this.uploadService.clear();
  }
}
