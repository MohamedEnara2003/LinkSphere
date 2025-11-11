import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { IComment } from '../../../../../../../../../../core/models/comments.model';
import { NgImage } from "../../../../../../../../../../shared/components/ng-image/ng-image";
import { CommentService } from '../../../../../../services/comments.service';
import { SharedModule } from '../../../../../../../../../../shared/modules/shared.module';
import { NgMenuActions } from "../../../../../../../../components/navigations/menu-actions/menu-actions";
import { Router } from '@angular/router';
import { LikeToggle } from "../../../../../like-toggle/like-toggle";
import { TagsService } from '../../../../../../../../../../core/services/tags.service';
import { FeedAutoLoader } from "../../../../../../../../components/navigations/feed-auto-loader/feed-auto-loader";
import { Pagination } from '../../../../../../../../../../core/models/pagination';
import { tap } from 'rxjs';
import { FormatDatePipe } from '../../../../../../../../../../shared/pipes/format-date-pipe';


@Component({
  selector: 'app-comment-item',
  imports: [
  SharedModule, NgImage, NgMenuActions, LikeToggle, FeedAutoLoader , FormatDatePipe],

  template: `
  <main 
    class="flex flex-col gap-2"
    aria-label="User comment"
    >

    <!-- 🧑‍💻 Author Avatar -->
    <article   class="flex gap-2 ">
      <app-ng-image
      [routerLink]="[
        '/public',
        { outlets: { primary: ['profile', 'user', comment().author._id || ''], model: null } }
      ]"
      [options]="{
        src: comment().author.picture || '',
        placeholder:  '/user-placeholder.webp',
        alt: comment().author.userName + ' profile picture',
        width:  100,
        height: 100,
        decoding: 'async',
        fetchpriority: 'high',
        class: comment().flag === 'comment' ? 
        'size-8 rounded-full object-cover border border-base-200 cursor-pointer hover:ring-2 hover:ring-brand-color/50 transition ' 
        : 
        'size-6  rounded-full object-cover border border-base-200 cursor-pointer hover:ring-2 hover:ring-brand-color/50 transition '
      }"
    />

    <!-- 💬 Comment Content -->
    <section class="relative flex-1 space-y-1">

      <!-- Header -->
      <header class="flex  justify-between">

        <div class="flex gap-2">
          <a 
            class="font-semibold text-base-content hover:text-brand-color transition-colors"
            [ngClass]="comment().flag === 'comment' ? 'text-sm sm:text-base ' : 'text-xs sm:text-sm'"
            [routerLink]="[
              '/public',
              { outlets: { primary: ['profile', 'user', comment().author._id || ''], model: null } }
            ]"
            aria-label="View user profile"
          >
            {{ comment().author.userName }}
          </a>

          <time
            class="badge-xs badge bg-brand-color/10 text-brand-color border-transparent"
            [attr.datetime]="comment().createdAt"
            aria-label="Comment creation date"
          >
            {{ comment().createdAt! | formatDate }}
          </time>
        </div>

  
      <app-ng-menu-actions
      title="Comment Menu"
      [actions]="[
      { type: 'edit', label: 'Edit Comment', icon: 'edit', variant: 'info' },
      { type: 'delete', label: 'Delete Comment', icon: 'delete', variant: 'danger' },
      ]"
      (action)="handleCommentMenu($event)"
      [userId]="comment().author._id"
      />
      </header>


      <!-- Comment Text -->
  <article 
  role="article"
  class="text-sm leading-relaxed break-words flex flex-col gap-2">

  <!-- Reply Tag -->
  @if (isReplyTagName()) {
    <span
      class="ngText font-normal"
      role="text"
      [attr.aria-label]="'Replying to ' + isReplyTagName()"
    >
    Replying to  {{isReplyTagName() }}
    </span>
  }

  <p class="flex items-center gap-1"> 
    <!-- Tagged Users -->
  @if (comment().tags.length) {
    @for (tag of comment().tags; track tag) {
      <a 
        [href]="[ '/public', { outlets: { primary: ['profile', 'user', tag], model: null } } ]"
        [routerLink]="[ '/public', { outlets: { primary: ['profile', 'user', tag], model: null } } ]"
        class="link link-hover text-brand-color"
        role="link"
        tabindex="0"
        aria-label="Tagged user"
      >
      {{ tagService.getUserNameById(tag) }}
    </a>
    }
  }
      <!-- Comment Content -->
      <span
      class="text-base-content"
      role="text"
      aria-label="Comment content"
      >
        {{ comment().content }}
      </span> 
      </p>
      </article>

      <!-- 🖼️ Comment Image (optional) -->
      @if(comment().attachment) {
        <figure class="mt-2">
          <app-ng-image
            [options]="{
              src: comment().attachment || '',
              alt: 'Image attached to comment by ' + comment().author.userName,
              width:  600,
              height: 400,
              decoding: 'async',
              class: 'rounded-xl border border-base-200 dark:border-base-content/10 object-cover max-h-80 w-full  cursor-pointer hover:opacity-90 transition'
            }"
            [isPreview]="true"
          />
          <figcaption class="sr-only">Comment image</figcaption>
        </figure>
      }

      <!-- Actions -->
      <nav class="flex items-center gap-3">
      <app-like-toggle
      [postId]="postId()"
      [commentId]="comment()._id || ''"
      [existingLikes]="comment().likes || []"
      />

          <a
            [routerLink]="[]"
            [queryParams]="{ commentId: comment()._id || '', type: 'reply' }"
            queryParamsHandling="merge"
            class="text-xs text-brand-color font-medium hover:underline"
            aria-label="Reply to comment"
          >
            Reply
          </a>
        
      </nav>
</section>

</article>

@if(replies().length && comment().lastReply) {
  <ul class=" flex flex-col gap-4">
    @for (reply of replies(); track reply._id) {
      <li class="p-2 ngCard border-b border-base-200 dark:border-base-content/10">
        @if(reply && comment().lastReply) {
          <app-comment-item
            [comment]="reply"
            [postId]="postId()"
          />
        }
      </li>
    }
  </ul>

  @if(pagination().page < pagination().totalPages) {
  <app-feed-auto-loader
  loadingType="comment"
  (loadData)="loadMore()"
  aria-label="Load more replies"
  />
  }
}

<footer>
  @if(comment().lastReply ) {
  <button
    type="button"
    (click)="toggleReplies()"
    class="btn btn-xs sm:btn-sm btn-link text-neutral-400 link-hover duration-300 transition-all p-0
    flex items-center gap-1"
  >
    @if(this.isShowReplies().includes(comment()._id) || replies().length) {
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke-width="1.5" stroke="currentColor" class="size-3 rotate-180 transition-transform">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 15.75L12 8.25l-7.5 7.5" />
      </svg>
      Hide replies
    } @else {
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke-width="1.5" stroke="currentColor" class="size-3 transition-transform">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 8.25l7.5 7.5 7.5-7.5" />
      </svg>
      View replies
    }
  </button>
}
</footer>



</main>

  `,
})
export class CommentItem {
  tagService = inject(TagsService);
  commentService = inject(CommentService);

  
  comment = input.required<IComment>();
  postId = input.required<string>();
  
  #router = inject(Router);

  isReplyTagName = computed(() => {
  const comment = this.comment();
  if (comment.flag !== 'reply') return '';

  const allComments = [
    ...this.commentService.comments(),
    ...this.commentService.replies()
  ];
  const parent = allComments.find(c => c._id === comment.commentId);
  return parent?.author.userName || '';
});

replies = linkedSignal<IComment[]>(() => 
this.commentService.replies().filter((r) => r.commentId === this.comment()._id)
);

pagination = signal<Pagination>({
  page: 1,
  limit: 5,
  totalPages: 2,
  total: 0,
});

isShowReplies = signal<string[]>([]);

  handleCommentMenu(type : string) : void {
  switch (type) {
    case 'edit':  this.#router.navigate([], {
    queryParams : {type : 'edit' , commentId : this.comment()._id || null} ,
    queryParamsHandling : 'merge'})
    break;
    case 'delete' : this.deleteComment();
  }
  }


  deleteComment(): void {
    const { _id: commentId } = this.comment();
    const postId = this.postId();
    if (commentId && postId) {
      this.commentService.deleteComment(postId, commentId).subscribe();
    }
  }

  toggleReplies(): void {
    const { _id: commentId , lastReply } = this.comment();
    const postId = this.postId();

    const isReply = this.replies().length === 0 &&
    !this.isShowReplies().includes(commentId);

    if (postId && commentId && lastReply) {
      if (isReply) {
        this.commentService.getCommentReplies(postId, commentId).subscribe({
          next: ({data : {pagination}}) => {
          this.pagination.set(pagination);
          this.isShowReplies.update((ids) => [...ids , commentId]);
          }
        });
      } else {
        this.replies.set([]);
        this.isShowReplies.update((ids) => ids.filter((id) => id !== commentId));
      }
    }
  }


loadMore() : void {
  const { _id: commentId , lastReply } = this.comment();
  const postId = this.postId();
  const { page, totalPages } = this.pagination();

  if (!postId || !commentId || !lastReply) return;
  if (page >= totalPages) return;
  
  const nextPage = (+page + 1);

  this.commentService.getCommentReplies(postId, commentId , nextPage).pipe(
  tap(({data : {replies  , pagination}}) => {

    this.replies.update(existing => {
            const newReplies = replies.filter(r => 
            !existing.some(e => e._id === r._id)
            );
            return [...existing, ...newReplies];
          });
  this.pagination.set(pagination);
  })
  ).subscribe();
    
}
    
}


