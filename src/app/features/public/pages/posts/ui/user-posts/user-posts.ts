import { Component, effect, inject, input, untracked} from '@angular/core';
import { PostService } from '../../services/post.service';
import { PostCard } from "../../components/post-card/ui/post-card";
import { LoadingPost } from "../../components/loading/loading-post/loading-post";
import { EmptyPosts } from "../../components/empty-posts/empty-posts";
import { UserProfileService } from '../../../profile/services/user-profile.service';


@Component({
  selector: 'app-user-posts',
  imports: [PostCard, LoadingPost, EmptyPosts],
  template: `
  
      <main class="size-full grid grid-cols-1 gap-5">
            @for (post of postService.userProfilePosts(); track post.id) {
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
})

export class UserPosts {
readonly postService = inject(PostService);
readonly userProfile = inject(UserProfileService);

userId = input<string>('');

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
