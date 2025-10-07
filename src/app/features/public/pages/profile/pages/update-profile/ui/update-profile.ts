import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { SharedModule } from '../../../../../../../shared/modules/shared.module';
import { TileEdit } from "../components/title-edit/title-edit";
import { NgImage } from "../../../../../../../shared/components/ng-image/ng-image";
import { BackLink } from "../../../../../../../shared/components/links/back-link";
import { ProfileEditTypes } from '../../../model/profiles.model';
import { UpdateUserInfoComponent } from "../components/update/update-user-info/update-user-info";
import { UpdateUserPictureComponent } from "../components/update/update-user-picture/update-user-picture";
import { UpdateCoverImagesComponent } from "../components/update/update-cover-images/update-cover-images";
import { UserProfileService } from '../../../services/user-profile.service';
import { UserPicture } from "../../../components/user-picture/user-picture";
import { UserAbout } from "../../user-profile/components/user-about/user-about";
import { TranslateModule } from '@ngx-translate/core';


@Component({
selector: 'app-update-profile',
imports: [
    SharedModule,
    TileEdit,
    NgImage,
    BackLink,
    UpdateUserInfoComponent,
    UpdateUserPictureComponent,
    UpdateCoverImagesComponent,
    UserPicture,
    UserAbout,
    TranslateModule
],

template: `
<main class="w-full min-h-[90svh] flex flex-col justify-start  items-center  py-5 p-2 overflow-hidden ">

<article class="w-full max-w-4xl   mb-4 ngCard rounded-none p-6  grid grid-cols-1 gap-8
animate-sideRight">

<header class="w-full  flex items-center  gap-4 border-b border-brand-color/10 pb-2">
<app-back-link />
<h1 class="text-lg md:text-2xl font-bold">{{ 'profile.update.title' | translate }}</h1>
</header>

@if(!editType()) { 

<!-- Section Edit Profile Covers -->
<section class="w-full flex flex-col  items-center gap-5 mt-4">
<app-title-edit 
[title]="'profile.update.cover_images' | translate"
query="cover-images"
class="w-full"
/>

@let coverImages = userProfileService.userProfile()?.coverImages || [] ;

<main class="w-full grid gap-4"
    [ngClass]="coverImages.length <= 1 ? 'grid-cols-1' : 'grid-cols-2'">

    @for (item of coverImages; track item) {
        <app-ng-image
        [options]="{
        src :  item ,
        alt : ('profile.update.cover_image' | translate) + ' ' + userProfileService.userProfile,
        width  : 200,
        height : 200,
        class : 'w-full h-50 object-cover shadow-md   '
        }"
        [isPreview]="true"
        />
    }
</main>
</section>


<!-- Section Edit Profile Picture -->
<section class="w-full flex flex-col  items-center gap-5 mt-4">
<app-title-edit 
[title]="'profile.update.profile_picture' | translate"
query="picture"
class="w-full "
/>
        <app-user-picture 
        styleClass="size-50 rounded-full object-cover border-2  border-brand-color"
        [isPreview]="true"
        />
</section>


<!-- Section: Profile Information -->
    <section
      class="w-full flex flex-col items-start gap-4"
      aria-labelledby="profile-info-title"
    >
    <app-title-edit
        id="profile-info-title"
        [title]="'profile.update.user_profile_information' | translate"
        query="info"
        class="w-full"
    />

    <app-user-about [about]="userProfileService.about()" />
    </section>
}@else {

@switch (editType()) {
@case ('cover-images') {
<app-update-cover-images/>
}
@case ('picture') {
<app-update-user-picture  />
}
@case ('info') {
<app-update-user-info />
}
}

}
</article>
</main>
`,

changeDetection : ChangeDetectionStrategy.OnPush
})
export class UpdateProfile {
#route = inject(ActivatedRoute);
userProfileService = inject(UserProfileService);


editType = toSignal<ProfileEditTypes>(this.#route.queryParamMap.pipe(
map((queryMap) => queryMap.get('edit') as 'cover-images' | 'picture' | 'info')
));


userId = toSignal<string , string>(
this.#route.paramMap.pipe(map((paramMap) => paramMap.get('userId') || '')),
{ initialValue: '' } 
);

constructor(){
effect(() => {
this.getUserProfileById();
})
}

private getUserProfileById() : void {
const userId = this.userId();
if(userId) {
this.userProfileService.getUserProfileById(userId).subscribe();
}
}



}
