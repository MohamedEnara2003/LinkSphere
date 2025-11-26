import { Component, inject, input } from '@angular/core';
import { IPost } from '../../../../../../../../core/models/posts.model';
import { Router, RouterModule } from '@angular/router';
import { LikeToggle } from "../../../like-toggle/like-toggle";
import { PostsStateService } from '../../../../service/state/posts-state.service';


@Component({
  selector: 'app-post-actions',
  imports: [RouterModule, LikeToggle],
  template: `
    <nav class="w-full flex items-center gap-4 border-b border-b-brand-color py-3 font-semibold ngText">
      
      <!-- Likes -->
      <app-like-toggle
      [postId]="post()?._id || ''"
      [existingLikes]="post()?.likes || []"
      />

      <!-- Comments -->
      <button 
        (click)="openPostComments()"
        [title]="post()?.allowComments === 'deny' ? 'Disabled comments' : 'Comments'"
        type="button"
        [disabled]="post()?.allowComments === 'deny'"
        class="flex items-center gap-1 ngBtnIcon disabled:text-gray-600 disabled:cursor-not-allowed">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3
            7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74
            1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969
            5.969 0 0 0 6 21c1.282 0 2.47-.402
            3.445-1.087.81.22 1.668.337 2.555.337Z" />
        </svg>
        {{post()?.commentsCount || 0}}
      </button>
    </nav>
  `
})
export class PostActions {
  postsStateService = inject(PostsStateService);
  #router = inject(Router);

  post = input<IPost | null>(null);


  openPostComments(): void {
    const post = this.post();
    if (post) {
      this.#router.navigate(['/public', { outlets: { model: ['comments'] } }], {
        queryParams: { postId: post._id || '' },
        queryParamsHandling :'merge'
      });
      this.postsStateService.setPost(post);
    }
  }
}
