import { ChangeDetectionStrategy, Component, effect, inject, untracked } from '@angular/core';
import { coverImage } from "../components/cover-image/cover-image";
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
import { PostService } from '../../../../posts/services/post.service';
import { PostCard } from "../../../../posts/components/post-card/ui/post-card";
import { NgImage } from "../../../../../../../shared/components/ng-image/ng-image";


@Component({
selector: 'app-user-profile',
imports: [
    coverImage,
    btnOpenModelUpsertPost,
    profileTitleAction,
    profileLinks,
    UserFriends,
    UserAbout,
    SharedModule,
    userProfileHeader,
    UserPictures,
    PostCard,
    NgImage
],
template: `


<section class="relative w-full grid grid-cols-1 gap-2 p-2  xl:p-10 xl:px-20 animate-up " 
aria-labelledby="profile-section-title">


<app-cover-image  
[coverImages]="userProfileService.userProfile()?.coverImages || []"
[userId]="userId()"
/>

<!-- Profile Info -->
<article 
class="w-full grid grid-cols-1 md:grid-cols-2  -mt-10  gap-4"
aria-labelledby="profile-info-title">
<app-user-profile-header />
</article>

<nav class="w-full h-12 sticky top-0 md:top-[10svh] flex justify-center md:justify-start items-center  
z-10 bg-dark">
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
<article class="relative w-full grid grid-cols-1 md:grid-cols-2 gap-4 ">

<section class="w-full  flex flex-col gap-5 md:h-100 md:sticky md:top-[20svh]">
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

<nav class="flex flex-col gap-2">
<app-profile-title-action [title]="'profile.actions.photos' | translate" query="Photos"/>

@if(userProfileService.userProfile()?.coverImages?.length! > 0){
<app-ng-image
              [options]="{
                src : userProfileService.userProfile()?.coverImages![0] || '',
                alt : '',
                width  : 200,
                height : 200,
                class : 'object-cover rounded-b-2xl transition-transform duration-500 hover:scale-105',
              }"
              [isPreview]="true"
            />
}
</nav>

<app-profile-title-action [title]="'profile.actions.friends' | translate" query="Friends"/>
</section>


<!-- Posts Section -->
<section class="w-full flex flex-col gap-4   " aria-labelledby="user-posts-title">

    <app-btn-open-model-upsert-post />
    <header class="w-full flex justify-between items-center">
    <h2 id="user-posts-title" class="ngText text-lg md:text-2xl">{{ 'profile.actions.posts' | translate }}</h2>
    </header>
    

<main class="size-full grid grid-cols-1 gap-5">
@for (post of postService.userProfilePosts(); track post.id) {
<article class="w-full min-h-60">
@defer (on viewport) {
<app-post-card [post]="post" class="size-full"/>
}@placeholder {
<div class="size-full bg-neutral-300 animate-pulse ngCard"></div>
}
</article>
}@empty {
  <section
      class="w-full h-100 flex flex-col items-center justify-center gap-4  ngCard text-center animate-opacity"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="size-16 text-info"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
      <h2 class="text-lg font-semibold ngText">
        No posts yet
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400">
      Content from this user will appear here once available.     Be the first to share something with your friends!
      </p>
    </section>
}
</main>

</section>
</article>

}

</section>

`,
changeDetection : ChangeDetectionStrategy.OnPush
})

export class UserProfile {
userProfileService = inject(UserProfileService);
postService = inject(PostService);

#route = inject(ActivatedRoute);

listType = toSignal<ProfileListTypes | null>(
this.#route.queryParamMap.pipe(map((queryMap) => queryMap.get('list') as ProfileListTypes)),
{ initialValue: null } 
);


userId = toSignal<string , string>(
this.#route.paramMap.pipe(map((paramMap) => paramMap.get('userId') || '')),
{ initialValue: '' } 
);

constructor(){
effect(() => {
untracked(() => this.#getUserPosts());
})
}

#getUserPosts () : void {
const userId = this.userId();
if(userId) {
this.postService.getUserPosts(userId).subscribe();
};

}


}
