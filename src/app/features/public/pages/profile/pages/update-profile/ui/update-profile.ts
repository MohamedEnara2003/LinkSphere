import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { SharedModule } from '../../../../../../../shared/modules/shared.module';
import { TileEdit } from "../components/title-edit/title-edit";
import { BackLink } from "../../../../../../../shared/components/links/back-link";
import { ProfileEditTypes } from '../../../model/profiles.model';
import { UpdateUserInfoComponent } from "../components/update/update-user-info/update-user-info";
import { UpdateUserPictureComponent } from "../components/update/update-user-picture/update-user-picture";
import { UpdateCoverImagesComponent } from "../components/update/update-cover-images/update-cover-images";
import { UserProfileService } from '../../../services/user-profile.service';
import { UserPicture } from "../../../components/user-picture/user-picture";
import { UserAbout } from "../../user-profile/components/user-about/user-about";
import { coverImage } from "../../user-profile/components/cover-image/cover-image";




@Component({
selector: 'app-update-profile',
imports: [
    SharedModule,
    TileEdit,
    BackLink,
    UpdateUserInfoComponent,
    UpdateUserPictureComponent,
    UpdateCoverImagesComponent,
    UserPicture,
    UserAbout,
    coverImage
],

template: `
 <main class="w-full min-h-[90svh] flex flex-col justify-start items-center py-5 p-2 overflow-hidden">

      <article class="w-full max-w-4xl mb-4 ngCard rounded-none p-6 grid grid-cols-1 gap-8 animate-sideRight">
        <!-- Header -->
        <header class="w-full flex items-center gap-4 border-b border-brand-color/10 pb-2">
          <app-back-link />
          <h1 class="text-lg md:text-2xl font-bold">{{ 'profile.update.title' | translate }}</h1>
        </header>

        @if(userProfileService.userProfile() === null) {
        <div class="w-full h-[90svh] flex items-center justify-center p-4">
        <span class="loading loading-spinner size-20 text-brand-color"></span>
        </div>
        } @else { 

        @if(!editType()) { 
          <!-- Section Edit Profile Covers -->
          <section class="w-full flex flex-col items-center gap-5 mt-4">
            <app-title-edit 
              [title]="'profile.update.cover_images' | translate"
              query="cover-images"
              class="w-full"
            />


              <main class="w-full">
                <app-cover-image 
                  [isNavHide]="true"
                  [coverImage]="coverImage()"
                />
              </main>
            
          </section>

          <!-- Section Edit Profile Picture -->
          <section class="w-full flex flex-col items-center gap-5 mt-4">
            <app-title-edit 
              [title]="'profile.update.profile_picture' | translate"
              query="picture"
              class="w-full"
            />
            <app-user-picture 
              styleClass="size-50 rounded-full object-cover border-2 border-brand-color"
              [isPreview]="true"
            />
          </section>

          <!-- Section: Profile Information -->
          <section class="w-full flex flex-col items-start gap-4">
            <app-title-edit
              [title]="'profile.update.user_profile_information' | translate"
              query="info"
              class="w-full"
            />

            @if(userProfileService.userProfile() && userAbout()) {
              <app-user-about [aboutData]="userAbout()"/>
            }
          </section>
        } @else {
          @switch (editType()) {
            @case ('cover-images') {
              <app-update-cover-images/>
            }
            @case ('picture') {
              <app-update-user-picture/>
            }
            @case ('info') {
              <app-update-user-info/>
            }
          }
        }
        
        }
      </article>
    </main>
`,

changeDetection : ChangeDetectionStrategy.OnPush
})
export class UpdateProfile {
userProfileService = inject(UserProfileService);


#route = inject(ActivatedRoute);


userAbout = computed(() => 
this.userProfileService.userAbout().filter(item => item.title !== 'profile.about.email'));

coverImage = computed(() => this.userProfileService.userProfile()?.coverImage!);

editType = toSignal<ProfileEditTypes>(this.#route.queryParamMap.pipe(
map((queryMap) => queryMap.get('edit') as 'cover-images' | 'picture' | 'info')
));


userId = toSignal<string , string>(
this.#route.paramMap.pipe(map((paramMap) => paramMap.get('userId') || '')),
{ initialValue: '' } 
);

}
