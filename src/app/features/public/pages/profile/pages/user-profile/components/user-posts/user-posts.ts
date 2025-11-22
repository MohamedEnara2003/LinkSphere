import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { UserProfileService } from '../../../../services/user-profile.service';

import { btnOpenModelUpsertPost } from '../../../../../posts/components/btn-open-model-upsert-post/btn-open-model-upsert-post';
import { profileTitleAction } from '../profile-title-action/profile-title-action';
import { UserFriends } from '../user-friends/user-friends';
import { SharedModule } from '../../../../../../../../shared/modules/shared.module';
import { NgImage } from '../../../../../../../../shared/components/ng-image/ng-image';
import { UserPosts } from "../../../../../posts/ui/user-posts/user-posts";


@Component({
selector: 'app-user-profile-posts',
imports: [
    btnOpenModelUpsertPost,
    profileTitleAction,
    UserFriends,
    SharedModule,
    NgImage,
    UserPosts
],
template: `

    <!-- Posts Section -->
    <article
        class="w-full min-h-[80svh]  grid grid-cols-1 md:grid-cols-2 gap-8"
        aria-labelledby="user-posts-title"
    >
        <!-- Sidebar -->
        <aside
        class="w-full md:h-140 flex flex-col justify-center items-center     gap-6 md:sticky md:top-0   "
        role="complementary"
        >

        <section class="w-full h-full ngCard  p-2 flex flex-col gap-5">
        <app-profile-title-action
        [title]="'profile.actions.photos' | translate"
        query="Photos"
        />
        @if (picturesChunks().length > 0) {
        <ul class="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
        @for (item of picturesChunks(); track item) {
            <li class="mb-4">     
            <app-ng-image
            [options]="{
            src: item || '',
            alt: 'Profile photo preview',
            width:  200,
            height: 200,
            class: 'w-full h-40 object-cover rounded hover:scale-105 transition-transform duration-500'
            }"
            />
            </li>
        }
        </ul>
        } 
        </section>

        <section class="w-full  h-full  ngCard  p-2 flex flex-col gap-5">
        <app-profile-title-action
        [title]="'profile.actions.friends' | translate"
        query="Friends" />
        @if (friendsChunks().length > 0) {
        <app-user-friends 
        [isShowTitle]="false"
        [friends]="friendsChunks() || []"
        ulStyleClass="w-full grid grid-cols-2 gap-4"
        />
        }
        </section>
        </aside>

    <!-- Main Posts -->
    <section class="flex flex-col gap-6">
        <header class="flex flex-col gap-4">
            <app-btn-open-model-upsert-post />
            <h2
            id="user-posts-title"
            class="text-xl font-semibold text-base-content p-1"
            >
            {{ 'profile.actions.posts' | translate }}
            </h2>
        </header>

    <app-user-posts [userId]="userId() || ''" />
    </section>

        
    </article>
`,
changeDetection : ChangeDetectionStrategy.OnPush ,
})

export class UserProfilePosts {
userProfileService = inject(UserProfileService);


friends = computed(() => 
this.userProfileService.userProfile()?.friends || []
);

friendsChunks = computed(() => {
const chunkSize = 2;
const friendsList = this.friends();
return friendsList.filter((_, index) => index < chunkSize);
});

picturesChunks = computed(() => {
const chunkSize = 2;
const picturesList = this.userProfileService.pictures() || [];
return picturesList.filter((_, index) => index < chunkSize);
});

userId = input<string>();




}
