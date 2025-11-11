import { ChangeDetectionStrategy, Component, computed, effect, inject, input, untracked } from '@angular/core';
import { UserProfileService } from '../../../../services/user-profile.service';
import { PostService } from '../../../../../posts/services/post.service';

import { btnOpenModelUpsertPost } from '../../../../../posts/components/btn-open-model-upsert-post/btn-open-model-upsert-post';
import { profileTitleAction } from '../profile-title-action/profile-title-action';
import { UserFriends } from '../user-friends/user-friends';
import { SharedModule } from '../../../../../../../../shared/modules/shared.module';
import { PostCard } from '../../../../../posts/components/post-card/ui/post-card';
import { NgImage } from '../../../../../../../../shared/components/ng-image/ng-image';
import { EmptyPosts } from '../../../../../posts/components/empty-posts/empty-posts';
import { LoadingPost } from "../../../../../posts/components/loading/loading-post/loading-post";


@Component({
selector: 'app-user-posts',
imports: [
    btnOpenModelUpsertPost,
    profileTitleAction,
    UserFriends,
    SharedModule,
    PostCard,
    NgImage,
    EmptyPosts,
    LoadingPost
],
template: `

    <!-- Posts Section -->
    <article
        class="w-full grid grid-cols-1 md:grid-cols-2 gap-8"
        aria-labelledby="user-posts-title"
    >
        <!-- Sidebar -->
        <aside
        class="w-full md:h-120 grid grid-cols-1 gap-6 md:sticky md:top-[25svh]   "
        role="complementary"
        >

        <section class="w-full ngCard  p-2 flex flex-col gap-5">

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
            [isPreview]="true"
            />
            </li>
        }
        </ul>
        } 
        </section>

        <section class="w-full ngCard  p-2 flex flex-col gap-5">
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

        <main class="grid grid-cols-1 gap-5">
            @for (post of postService.userProfilePosts(); track post.id) {
            <article class="w-full min-h-60">
                @defer (on viewport) {
                <app-post-card [post]="post" />
                } @placeholder {
                <app-loading-post class="size-full"/>
                }
            </article>
            } @empty {
            <app-empty-posts [isCreatePost]="userProfileService.isMyProfile()" />
            }
        </main>
        </section>
    </article>
`,
changeDetection : ChangeDetectionStrategy.OnPush ,
})

export class UserPosts {
userProfileService = inject(UserProfileService);
postService = inject(PostService);



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

  constructor(){
  effect(() => {
  const id = this.userId();
  if (!id) return;
  untracked(() => this.#getUserPosts(id));
  });
  }

  #getUserPosts (userId : string) : void {
  this.postService.getUserPosts(userId).subscribe();
  }


}
