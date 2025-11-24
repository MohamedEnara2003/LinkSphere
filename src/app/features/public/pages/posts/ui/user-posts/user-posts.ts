import { Component, computed, effect, inject, input, untracked} from '@angular/core';
import { PostCard } from "../../components/post-card/ui/post-card";
import { LoadingPost } from "../../components/loading/loading-post/loading-post";
import { EmptyPosts } from "../../components/empty-posts/empty-posts";
import { UserProfileService } from '../../../profile/services/user-profile.service';
import { GetPostsService } from '../../service/api/get-posts.service';
import { PostsStateService } from '../../service/state/posts-state.service';


@Component({
  selector: 'app-user-posts',
  imports: [PostCard, LoadingPost, EmptyPosts],
  template: `
  
      <main class="size-full grid grid-cols-1 gap-5">
            @for (post of userPosts(); track post.id) {
            <article class="w-full min-h-60">
                @defer (on viewport) {
                <app-post-card [post]="post" />
                } @placeholder {
                <app-loading-post class="size-full"/>
                }
            </article>
            } @empty {
            <app-empty-posts [isCreatePost]="userProfile.isMyProfile()" class="w-full h-full"/>
            }
        </main>
`,
providers : [
GetPostsService
]
})

export class UserPosts {

readonly #getPostsService = inject(GetPostsService);
readonly #postsStateService = inject(PostsStateService);
readonly userProfile = inject(UserProfileService);

userPosts = computed(() => this.#postsStateService.userProfilePosts());

userId = input<string>('');

constructor(){
effect(() => {
const id = this.userId();
if (!id) return;
untracked(() => this.#getUserPosts(id));
});
}

#getUserPosts (userId : string) : void {
this.#getPostsService.getUserPosts(userId).subscribe();
}

}
