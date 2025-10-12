import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { coverImage } from "../components/cover-image/cover-image";
import { Posts } from "../../../../posts/ui/posts/posts";
import { btnOpenModelUpsertPost } from "../../../../posts/components/btn-open-model-upsert-post/btn-open-model-upsert-post";
import { profileTitleAction } from "../components/profile-title-action/profile-title-action";
import { profileLinks } from "../components/profile-links/profile-links";
import { UserFriends } from "../components/user-friends/user-friends";
import { UserAbout } from "../components/user-about/user-about";
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ProfileListTypes } from '../../../model/profiles.model';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '../../../../../../../shared/modules/shared.module';
import { UserProfileService } from '../../../services/user-profile.service';
import { userProfileHeader } from "../components/user-profile-header/user-profile-header";
import { UserPictures } from "../components/user-pictures/user-pictures";
import { TranslateModule } from '@ngx-translate/core';


@Component({
selector: 'app-user-profile',
imports: [
    coverImage,
    Posts,
    btnOpenModelUpsertPost,
    profileTitleAction,
    profileLinks,
    UserFriends,
    UserAbout,
    SharedModule,
    userProfileHeader,
    UserPictures,
    TranslateModule
],
template: `

<section class="relative w-full grid grid-cols-1 gap-4 p-2  xl:p-10 xl:px-20 animate-up " 
aria-labelledby="profile-section-title">

<app-cover-image  
[coverImages]="userProfileService.userProfile()?.coverImages || []"
[userId]="userId()"
/>

<!-- Profile Info -->
<article 
class="w-full grid grid-cols-1 md:grid-cols-2  -mt-15 z-10 gap-4"
aria-labelledby="profile-info-title">
<app-user-profile-header />
</article>

<nav class="w-full h-10 md:sticky md:top-25  z-10">
<app-profile-links [listType]="listType()!"/>
</nav>


@if (listType() === 'Friends') {
<!-- User Friends -->
<app-user-friends />
}

@else if (listType() === 'Photos') {
<!-- User Pictures -->
<app-user-pictures [pictures]="userProfileService.pictures()" />
}


@else if (listType() === 'About' && userProfileService.about()) {
<!-- User About -->
<app-user-about  [about]="userProfileService.about()"/>
}

@else if (listType() === 'Posts' || !listType()) {
<!-- Profile Details -->
<article class="relative w-full grid grid-cols-1 md:grid-cols-2 gap-4">

<section class="w-full  flex flex-col gap-5 md:h-100 md:sticky md:top-40">

@if(userProfileService.isMyProfile()){
<button [routerLink]="['/public/profile/user', userProfileService.userProfile()?._id, 'update']"
type="button" 
class="ngBtn ">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
<path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
</svg>
{{ 'profile.actions.edit_profile' | translate }}
</button>
}

<app-profile-title-action [title]="'profile.actions.photos' | translate" query="Photos"/>
<app-profile-title-action [title]="'profile.actions.friends' | translate" query="Friends"/>
</section>


<!-- Posts Section -->
<section class="w-full  grid grid-cols-1 gap-4  " aria-labelledby="user-posts-title">
    <app-btn-open-model-upsert-post />

    <header class="w-full flex justify-between items-center">
    <h2 id="user-posts-title" class="ngText text-lg md:text-2xl">{{ 'profile.actions.posts' | translate }}</h2>
    <button type="button" class="btn btn-link text-brand-color">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
    <path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
    </svg>
    {{ 'profile.actions.filters' | translate }}
    </button>
    </header>
    

    <app-posts/>

</section>
</article>

}

</section>

`,
changeDetection : ChangeDetectionStrategy.OnPush
})
export class userProfile {
userProfileService = inject(UserProfileService);
#route = inject(ActivatedRoute);

listType = toSignal<ProfileListTypes | null>(
this.#route.queryParamMap.pipe(map((queryMap) => queryMap.get('list') as ProfileListTypes)),
{ initialValue: null } 
);


userId = toSignal<string , string>(
this.#route.paramMap.pipe(map((paramMap) => paramMap.get('userId') || '')),
{ initialValue: '' } 
);


}
