import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgImage } from "../../../../../../../../../shared/components/ng-image/ng-image";
import { UploadService } from '../../../../../../../../../core/services/upload/upload.service';
import { UserProfileService } from '../../../../../services/user-profile.service';
import { tap } from 'rxjs';


@Component({
  selector: 'app-update-user-picture',
  standalone: true,
  imports: [CommonModule, NgImage],
  template: `
    <section class="w-full flex flex-col gap-5 items-center" aria-labelledby="user-picture-title">
    @let userPicture =  userProfileService.user()?.picture  || '';

    <header class="w-full flex justify-between items-center">
        <h2 id="user-picture-title" class="text-xl font-semibold text-base-content">
        Update Profile Picture
      </h2>

    @if(userPicture){
    <button
          title="Remove profile image"
          role="button"
          type="button"
          (click)="removeProfileImage()"
          class=" bg-dark/60  btn btn-sm sm:btn-md  text-error hover:text-error/50
          group-hover:opacity-100 transition z-10"
          aria-label="Remove cover image">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
          <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
          </svg>
          <span class="hidden sm:inline"> Remove</span>
      </button>
    }
    </header>

      <!-- Current Picture -->
        <app-ng-image
        [options]="{
          src: userPicture,
          placeholder: userProfileService.user()?.placeholder || '',
          alt: 'Profile picture',
          width:  200,
          height: 200,
          loading : 'eager' ,
          decoding : 'async' ,
          fetchpriority : 'high', 
          class: 'size-50 object-cover  rounded-full  border-2 border-brand-color'
        }"
        [isPreview]="userPicture ? true : false"
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
      <article class="flex flex-col gap-3 items-center">
      <span class="text-sm text-gray-500">Preview:</span>
      @if(this.uploadService.isLoading()){
      <div class="size-40 rounded-full  border-2 border-dashed border-brand-color 
      flex justify-center items-center">
      <span class="loading loading-spinner text-brand-color size-20"></span>
      </div>
      }
      @else if (uploadService.previews().length > 0) {
          <app-ng-image
            [options]="{
              src: uploadService.previews()[0].url || '',
              alt: 'New profile picture preview',
              width: 150,
              height: 150,
              loading : 'eager' ,
              decoding : 'async' ,
              fetchpriority : 'high', 
              class: 'size-40 rounded-full object-cover border-2 border-dashed border-brand-color'
            }"
            [isPreview]="true"
          />
          <button class="btn btn-primary btn-sm" (click)="savePicture()">Save Picture</button>
          <button class="btn btn-ghost btn-sm" (click)="uploadService.clear()">Cancel</button>
      }
    </article>
    </section>
  `,
})
export class UpdateUserPictureComponent {

  uploadService = inject(UploadService);
  userProfileService = inject(UserProfileService);


  onFileSelected(input: HTMLInputElement) {
  this.uploadService.uploadAttachments(input , 1 , 0.75 , 900 , 900);  
  }

  savePicture() {
    const files = this.uploadService.files();
    const previews = this.uploadService.previews();

    if ((files && files.length === 1) && (previews && previews.length === 1)) {
    const file = files[0]; 
    const preview = previews[0]; 
    this.uploadService.isLoading.set(true);
    this.userProfileService.uploadProfilePicture(file).pipe(
    tap(() => {
    this.userProfileService.setUser(
    {...this.userProfileService.user()! , picture : preview.url }
    )
    this.uploadService.isLoading.set(false);
    this.uploadService.clear();
    })
    ).subscribe()
    }
  }

  removeProfileImage() : void {
  this.userProfileService.deleteProfilePicture().pipe(
  tap(() => {
    const user = this.userProfileService.user() ;
    const userProfile = this.userProfileService.userProfile() ;
    if(!user || !userProfile) return;

    this.userProfileService.setUser({...user , picture : 'user-placeholder.jpg'});

    if(this.userProfileService.isMyProfile()){
    this.userProfileService.setUserProfile({...userProfile , picture :''});
    }

  this.uploadService.clear();
  })
  ).subscribe()
  }

ngOnDestroy(): void {
this.uploadService.clear();
}
}
