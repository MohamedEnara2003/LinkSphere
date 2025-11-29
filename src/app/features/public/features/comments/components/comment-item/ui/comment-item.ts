import { Component, inject, input, linkedSignal, signal } from '@angular/core';
import { IComment } from '../../../../../../../core/models/comments.model';
import { NgImage } from "../../../../../../../shared/components/ng-image/ng-image";
import { SharedModule } from '../../../../../../../shared/modules/shared.module';
import { CommentsHeader } from "../components/comment-header/comment-header";
import { CommentContent } from "../components/comment-content/comment-content";
import { CommentAttachment } from "../components/comment-attachment/comment-attachment";
import { ToggleRepliesBtn } from "../components/toggle-replies-btn/toggle-replies-btn";
import { FeedAutoLoader } from "../../../../../components/navigations/feed-auto-loader/feed-auto-loader";
import { tap } from 'rxjs';
import { commentActions } from "../components/comment-actions/comment-actions";
import { LoadingComment } from "../../loading-comment/loading-comment";
import { GetCommentsService } from '../../../services/api/get-comments.service';
import { CommentsStateService } from '../../../services/state/comments-state.service';


@Component({
  selector: 'app-comment-item',
  imports: [
    NgImage,
    SharedModule,
    CommentsHeader,
    CommentContent,
    CommentAttachment,
    ToggleRepliesBtn,
    FeedAutoLoader,
    commentActions,
    LoadingComment
],
  template: `

@defer (on viewport) {
<article
role="article"
[title]="'Comment-' + comment()._id"
[attr.aria-label]="'Comment-' + comment()._id"
class="w-full flex flex-col gap-1 p-2 ngCard"
[ngClass]="comment().flag === 'comment' ? '' : 'rounded-[16px]'"
>

<main class="flex gap-2">
  <!-- Avatar -->
  <figure class="border border-brand-color rounded-full overflow-hidden "
    [ngClass]="comment().flag === 'comment' ? 'size-8' : 'size-6'">

    <app-ng-image
      [routerLink]="[
        '/public',
        { outlets: { primary: ['profile', 'user', comment().author._id], model: null } }
      ]"
      [options]="{
        src: comment().author.picture?.url || '/user-placeholder.webp',
        placeholder: '/user-placeholder.webp',
        alt: comment().author.userName + ' profile picture',
        width: 100,
        height: 100,
        decoding: 'async',
        fetchpriority: 'high',
        class: 'size-full rounded-full object-cover hover:scale-105 duration-300 transition-transform cursor-pointer '
      }"
    />

    <figcaption class="sr-only">{{ comment().author.userName }}</figcaption>
  </figure>

  <!-- Content -->
  <section class="relative flex-1 space-y-2">

    <!-- Header -->
    <app-comment-header
      [comment]="comment()"
      [postId]="postId()"
    />

    <!-- Comment Body -->
    <section>
      <app-comment-content [comment]="comment()" />
    </section>

    <!-- Attachment -->
    @if(comment().attachment) {
      <section>
        <app-comment-attachment [attachment]="comment().attachment!" />
      </section>
    }

    <!-- Actions -->
    <section>
      <app-comment-actions
        [postId]="postId()"
        [commentId]="comment()._id"
        [commentLikes]="comment().likes"
      />
    </section>

  </section>
</main>


<!--Replies -->
<footer class="flex flex-col gap-2 mt-2">

  @if(comment().lastReply && postId()) {


    <!-- Replies List -->
    @if(replies().length > 0) {

      <ul class="w-full flex flex-col gap-2">
        @for(reply of replies() ; track reply._id) {
          <li>
            <app-comment-item
              [comment]="reply"
              [postId]="postId()"
            />
          </li>
        }

        <!-- Load More Replies -->
        @if(hasMoreReplies()) {
          <li>
            <app-feed-auto-loader
              loadingType="comment"
              aria-label="Load more replies"
              (loadData)="loadMoreReplies()"
            />
          </li>
        }
      </ul>
    }

    <!-- Toggle Replies Button -->
    <app-toggle-replies-btn
      [comment]="comment()"
      [postId]="postId()"
      (toggleReplies)="toggleReplies()"
      [isShowReplies]="isShowReplies()"
    />
  }
</footer>

</article>
  }@placeholder {
  <app-loading-comment />
  }
  `
})
export class CommentItem {

  readonly #getCommentService = inject(GetCommentsService);
  readonly commentsState = inject(CommentsStateService);

 
  comment = input.required<IComment>();
  postId = input.required<string>();


  isShowReplies = signal<boolean>(false);
  page = signal<number>(1);
  hasMoreReplies = signal<boolean>(false);

  replies = linkedSignal<IComment[]>(() =>
    this.commentsState
      .replies().filter(r => r.commentId === this.comment()._id)
  );


  #getCommentsReplies(page: number): void {
    const commentId = this.comment()._id;
    const postId = this.postId();
    const limit = 5;

    if (!postId || !commentId) return;

    this.#getCommentService
      .getCommentReplies(postId, commentId, page, limit)
      .pipe(
        tap(({ data: { replies, pagination: { totalPages } } }) => {

          const isLastPage = page >= totalPages;

          if (!replies.length || isLastPage) {
            this.hasMoreReplies.set(false);
            return;
          }

          this.hasMoreReplies.set(true);
          this.page.update(p => p + 1);
        })
      )
      .subscribe();
  }


  toggleReplies(): void {
    const willOpen = !this.isShowReplies();

    if (willOpen) {

    this.page.set(1);
    this.#getCommentsReplies(1);

    const replies = this.commentsState
    .replies()
    .filter(r => r.commentId === this.comment()._id);

    this.replies.set(replies);
    this.isShowReplies.set(true);

    } else {
    this.replies.set([]);
    this.page.set(1);
    this.hasMoreReplies.set(false);
    this.isShowReplies.set(false);
    }
  }

  loadMoreReplies(): void {
    this.#getCommentsReplies(this.page());
  }
}
