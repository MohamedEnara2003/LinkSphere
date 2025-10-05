import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MockUsersService } from '../../../../../../../core/services/testing/mock-users.service';
import { IUser } from '../../../../../../../core/models/user.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { SharedModule } from '../../../../../../../shared/modules/shared.module';
import { TileEdit } from "../components/title-edit/title-edit";
import { NgImage } from "../../../../../../../shared/components/ng-image/ng-image";
import { BackLink } from "../../../../../../../shared/components/links/back-link";
import { ProfileEditTypes } from '../../../model/profiles.model';
import { UpdateUserInfoComponent } from "../components/update/update-user-info/update-user-info";
import { UpdateUserPictureComponent } from "../components/update/update-user-picture/update-user-picture";
import { UpdateCoverImagesComponent } from "../components/update/update-cover-images/update-cover-images";


@Component({
selector: 'app-update-profile',
imports: [SharedModule, TileEdit, NgImage, BackLink, UpdateUserInfoComponent, UpdateUserPictureComponent, UpdateCoverImagesComponent],
template: `
<main class="w-full min-h-svh  flex flex-col justify-start   items-center  py-5 p-2 ">

<article class="w-full max-w-4xl   mb-4 ngCard rounded-none p-6  grid grid-cols-1 gap-8">


<header class="w-full  flex items-center  gap-4 border-b border-brand-color/10 pb-2">
<app-back-link />
<h1 class="text-lg md:text-2xl font-bold">Update Profile</h1>
</header>

@if(!editType()) { 
    
<!-- Section Edit Profile Covers -->
<section class="w-full flex flex-col  items-center gap-5 mt-4">
<app-title-edit 
title="Cover images"
query="cover-images"
class="w-full"
/>

<main class="w-full grid gap-4"
    [ngClass]="user()?.coverImages?.length! <= 1 ? 'grid-cols-1' : 'grid-cols-2'">

    @for (item of user()?.coverImages; track item) {
        <app-ng-image
        [options]="{
        src :  item ,
        alt : 'Cover Image ' + user()?.userName,
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
title="Profile Picture"
query="picture"
class="w-full "
/>
        @let userPicture = user()?.picture! ;

        <app-ng-image
        [options]="{
        src :  userPicture ,
        alt : 'Profile Picture ' + user()?.userName,
        width  : 200,
        height : 200,
        class : 'size-50 rounded-full object-cover border-2  border-brand-color'
        }"
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
        title="User profile information"
        query="info"
        class="w-full"
    />

    <h1
        id="profile-title"
        class="text-2xl font-bold text-base-content"
    >
        {{ user()?.userName }}
    </h1>

    <ul class="space-y-2 text-base text-base-content/80">
        <li>
        <span class="font-medium">📱 Phone:</span>
        <span>{{ user()?.phone }}</span>
        </li>
        <li>
        <span class="font-medium">📧 Email:</span>
        <span>{{ user()?.email }}</span>
        </li>
        <li>
        <span class="font-medium">⚥ Gender:</span>
        <span>@{{ user()?.gender }}</span>
        </li>
    </ul>
    </section>
}@else {

@switch (editType()) {
@case ('cover-images') {
<app-update-cover-images [coverImages]="user()?.coverImages || []"/>
}
@case ('picture') {
<app-update-user-picture [currentPicture]="user()?.picture || ''" />
}
@case ('info') {
<app-update-user-info />
}
}

}

</article>

</main>
`,
})
export class UpdateProfile {
#route = inject(ActivatedRoute);
#mockUsersService = inject(MockUsersService);


editType = toSignal<ProfileEditTypes>(this.#route.queryParamMap.pipe(
map((queryMap) => queryMap.get('edit') as 'cover-images' | 'picture' | 'info')
));

user = toSignal<IUser | null>(
this.#route.paramMap.pipe(switchMap((paramMap) => {
const userId = paramMap.get('userId')!
return this.#mockUsersService.getUserById(userId)
})),
{ initialValue: null } 
);



}
