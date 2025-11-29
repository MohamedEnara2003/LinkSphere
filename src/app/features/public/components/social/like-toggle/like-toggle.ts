import { Component, computed, DestroyRef, inject, input, signal} from '@angular/core';
import { SharedModule } from '../../../../../shared/modules/shared.module';

import { UserProfileService } from '../../../features/profile/services/user-profile.service';
import { debounceTime, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { UsersLikesModel } from "../users-likes-model/users-likes-model";
import { IUser } from '../../../../../core/models/user.model';

import { PostsStateService } from '../../../features/posts/service/state/posts-state.service';
import { ToggleLikePost } from '../../../features/posts/service/api/like-toggle-post.service';
import { CommentsStateService } from '../../../features/comments/services/state/comments-state.service';
import { LikesCommentsService } from '../../../features/comments/services/api/likes-comments.service';


@Component({
selector: 'app-like-toggle',
imports: [SharedModule, UsersLikesModel],
template: `
     <button 
     [attr.aria-label]="'Button ' + (commentId() ? 'like comment' : 'like post')" role="button"
     (click)="onClickLike()" type="button" class="flex items-center gap-1 ngBtnIcon">

        @if (!isLiked()) {
          <span title="Like">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597
                1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1
                3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </span>
        } @else {
          <span title="unLike">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
            class="size-6 text-brand-color animate-iconShake">
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247
            0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688
            15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688
            3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973
            0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739
            9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247
            0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752
            0 0 1-.704 0l-.003-.001Z" />
            </svg>
        </span>
        }

        <span 
        title="Show users likes"
        (click)="openUsersLikes($event)" 
        aria-label="Likes count"
        >
        {{ existingLikes().length || 0 }}
        </span>
    </button>
    
    @if(isOpenUserLikes()){
    <app-users-likes-model  
    [likedUsers]="displayLikedUsers() || []"
    [isLoad]="isOpenUserLikes()"
    (isLoadChange)="isOpenUserLikes.set($event)"
    /> 
    }

`,
providers : [
ToggleLikePost,
LikesCommentsService
]
})
export class LikeToggle {

  readonly #userService = inject(UserProfileService);

  readonly #commentsState = inject(CommentsStateService);
  readonly #likesComments= inject(LikesCommentsService);

  readonly #postsState = inject(PostsStateService);
  readonly #toggleLikePost = inject(ToggleLikePost);
  
  readonly #destroyRef = inject(DestroyRef);

  
  postId = input.required<string>();
  commentId = input<string>();
  existingLikes = input<string[]>([]);

  //  Streams
  #likeClick$ = new Subject<void>();

  isOpenUserLikes = signal<boolean>(false)



  // Computed signal for comment likes that reads from service
  commentLikedUsers = computed<IUser[]>(() => {
    const commentId = this.commentId();
    if (!commentId) return [];
    
    const cached = this.#commentsState.commentIdLikedUsers();
    if (cached.commentId === commentId) {
      return cached.likedUsers;
    }
    return [];
  });

  postLikedUsers = computed<IUser[]>(() => {
    const postId = this.postId();
    if (!postId) return [];
    const cached = this.#postsState.postLikers();
    if (cached.postId === postId) {
      return cached.likedUsers;
    }
    return [];
  });

  // Combined liked users - use service cache for comments, input for posts
  displayLikedUsers = computed<IUser[]>(() => {
    if (this.commentId()) {
      return this.commentLikedUsers();
    }
    return this.postLikedUsers();
  });

  ngOnInit() {
    this.#likeClick$
    .pipe(debounceTime(200), takeUntilDestroyed(this.#destroyRef))
    .subscribe(() => this.#onToggleLike());
  }


  isLiked = computed<boolean>(() => {
    const userId = this.#userService.user()?._id || '';
    return userId ? this.existingLikes().includes(userId) : false;
  });

  // 👇 called from the template
  onClickLike(): void {
  this.#likeClick$.next();
  }

  #onToggleLike(): void {
    const postId = this.postId() || '';
    const commentId = this.commentId() || '';
    const userId = this.#userService.user()?._id || '';
    if (!userId) return;
    if (commentId) {
      this.#likesComments.likeComment(postId, commentId, userId).subscribe();
    } else {
      this.#toggleLikePost.toggleLikePost(postId, userId).subscribe();
    }
  }

openUsersLikes(event: Event) : void {
event.stopPropagation();
const postId = this.postId() || '';
const commentId = this.commentId() || '';
this.isOpenUserLikes.set(true);

if(postId && !commentId) {
this.#toggleLikePost.getLikedUsers(postId).subscribe();
}

if(postId && commentId) {
this.#likesComments.getCommentLikes(postId, commentId).subscribe();
}


}


}
