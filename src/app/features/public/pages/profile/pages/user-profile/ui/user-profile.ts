import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { coverImage } from "../components/cover-image/cover-image";
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
import { UserPosts } from "../components/user-posts/user-posts";


@Component({
selector: 'app-user-profile',
imports: [
    coverImage,
    profileLinks,
    UserFriends,
    UserAbout,
    SharedModule,
    userProfileHeader,
    UserPictures,
    UserPosts
],
template: `
<section 
  class="relative w-full flex flex-col gap-6 p-2 xl:p-10 xl:px-20 animate-up"
  aria-labelledby="profile-section-title"
>

  <!-- Cover Image -->
  <app-cover-image
    [coverImages]="userProfileService.userProfile()?.coverImages || []"
    [userId]="userId()"
    aria-label="User cover image"
  />

  <!-- Profile Info -->
  <article
    class="w-full grid grid-cols-1 md:grid-cols-2 -mt-10"
    aria-labelledby="profile-info-title"
  >
    <h2 id="profile-info-title" class="sr-only">Profile Information</h2>
    <app-user-profile-header />
  </article>

  <!-- Navigation Tabs -->
  <nav
    class="md:sticky top-0 md:top-[10svh] z-40 ngCard md:h-[12svh]
    flex flex-col md:flex-row justify-between items-center gap-4 p-2"
    aria-label="Profile navigation"
  >
    <app-profile-links
      [listType]="listType()!"
      class="w-full"
    />

    @if (userProfileService.isMyProfile()) {
      <section class="w-full flex justify-end p-2">
        <button
          [routerLink]="['/public/profile/user', userProfileService.userProfile()?._id, 'update']"
          type="button"
          class="btn btn-outline ngBtn w-full md:w-auto "
          aria-label="Edit profile"
          [title]="'profile.actions.edit_profile' | translate "
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
          {{ 'profile.actions.edit_profile' | translate }}
        </button>
      </section>
    }
  </nav>

  <!-- Dynamic Sections -->
  @switch (listType()) {
    @case ('Friends') {
      <app-user-friends 
      [isShowTitle]="true"
      [friends]="friends() || []"
      />
    }
    @case ('Photos') {
      <app-user-pictures
        [pictures]="userProfileService.pictures()"
        aria-label="User photos"
      />
    }
    @case ('About') {
      @if (userProfileService.userAbout()) {
        <app-user-about
          [aboutData]="userProfileService.userAbout()"
          aria-label="About user section"
        />
      }
    }
    @default {
    <!-- Posts Section -->
    <app-user-posts 
    [userId]="userId()"
    />
    }
  }
</section>


`,
changeDetection : ChangeDetectionStrategy.OnPush ,
})

export class UserProfile {
userProfileService = inject(UserProfileService);
postService = inject(PostService);

#route = inject(ActivatedRoute);

listType = toSignal<ProfileListTypes | null>(
this.#route.queryParamMap.pipe(map((queryMap) => queryMap.get('list') as ProfileListTypes)),
{ initialValue: null } 
);

friends = computed(() => 
this.userProfileService.userProfile()?.friends || []
);

friendsChunks = computed(() => {
const chunkSize = 2;
const friendsList = this.friends();
return friendsList.filter((_, index) => index < chunkSize);
});

userId = toSignal<string , string>(
this.#route.paramMap.pipe(map((paramMap) => paramMap.get('userId') || '')),
{ initialValue: '' } 
);



}
