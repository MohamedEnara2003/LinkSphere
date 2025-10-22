import { Component, ChangeDetectionStrategy, inject, afterNextRender, OnDestroy, signal, } from '@angular/core';
import { DomService } from '../../../../../../../../../core/services/dom.service';
import { SharedModule } from '../../../../../../../../../shared/modules/shared.module';
import { UpsertComment } from "../components/upsert-comment/upsert-comment";

import { CommentService } from '../../../../../services/comments.service';
import { PostService } from '../../../../../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';


import { LoadingService } from '../../../../../../../../../core/services/loading.service';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommentList } from "../components/comment-list/comment-list";
import { ReplyList } from "../components/reply-list/reply-list";




@Component({
  selector: 'app-post-comments',
  imports: [SharedModule, UpsertComment, CommentList, ReplyList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `

    <!-- Overlay -->
    <section 
      class="w-full h-svh fixed inset-0 flex justify-center items-end z-20"
      aria-label="Comments Section"
      role="dialog"
      aria-modal="true">

      <!-- Comments Card -->
      <article
    class="relative w-full sm:w-[85%] md:w-[70%] lg:w-1/2  h-[85%] flex flex-col  gap-5
      rounded-t-3xl rounded-b-none ngCard shadow-2xl animate-up overflow-hidden"
    aria-labelledby="comments-title"
  >
    <!-- Header -->
    <header
      class="sticky top-0 z-10 flex items-center justify-between p-3 bg-base-100/90 dark:bg-card-dark/90 backdrop-blur-md border-b border-base-200"
    >
      <h2 id="comments-title" class="text-lg font-semibold ngText flex items-center gap-2">
        <span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
        </svg>
        </span>
        Comments
      </h2>

      <button
        (click)="closeComments()"
        title="Close comments"
        type="button"
        aria-label="Close comments"
        class="btn btn-ghost btn-sm btn-circle hover:bg-brand-color/10 text-brand-color transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </header>

    <!-- Comments List -->
    <section class="w-full h-full flex-1 overflow-y-auto p-2   grid grid-cols-1 ">
      <ul class="list flex flex-col gap-4">
        @for (comment of commentService.comments(); track comment._id) {
        @defer (when !loadingService.isLoading()) {
  
        <li class="p-2 ngCard border-b border-base-200 dark:border-base-content/10  flex flex-col gap-2">
        <app-comment-list
        [comment]="comment!" 
        [postId]="postId() || ''"
        />

        @if(comment.lastReply){
        <app-reply-list
        [commentId]="comment._id || ''"
        [postId]="postId()"
        />
        }
        </li>

        }@placeholder {
        <li class="w-full h-25 min-h-20 flex  p-2 gap-3">
        <div class="size-10 rounded-full bg-neutral-300  animate-pulse"></div>
        <div class="w-full bg-neutral-300 animate-pulse rounded"></div>
        </li>
        }
        }@empty {
    <section
      class="w-full h-full flex flex-col items-center justify-center gap-4  ngCard text-center animate-opacity"
    >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
    class="size-18 text-brand-color">
    <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
    </svg>

      <h2 class="text-lg font-semibold ngText">
        No comment yet
      </h2>
    </section>
      }
      </ul>
    </section>

    <!-- Add Comment -->
    <footer
      class="sticky bottom-0 z-10 bg-base-100/90 dark:bg-card-dark/90 border-t border-base-200  p-1 md:p-3 backdrop-blur-md"
    >
      <app-upsert-comment [postId]="postId()" />
    </footer>
  </article>
      <!-- Backdrop -->
      <div 
        (click)="closeComments()"
        class="size-full bg-dark/50 fixed inset-0 -z-10"
        aria-hidden="true"
        tabindex="-1">
      </div>
    </section>
  `,
})
export class PostComments implements OnDestroy{
    commentService = inject(CommentService);
    loadingService = inject(LoadingService);
    #postService = inject(PostService);
    #domService = inject(DomService);

    #router = inject(Router);
    #route = inject(ActivatedRoute);

    postId = toSignal<string ,string>(this.#route.queryParamMap.pipe(map((query) => query.get('postId') || '')) , {
    initialValue : ''
    })
  
    
    isOpenReplies = signal<string>('');


    constructor(){
    afterNextRender(() => this.#domService.setBodyOverflow('hidden'));
    this.#getComments();
    }
    

    #getComments(): void {
      const post = this.#postService.post() || this.#postService.posts().find((p) => p._id === this.postId());
      if (post && post._id) {
      this.commentService.getPostComment(post._id).subscribe();
      }
    }
    

    closeComments() : void {
    this.#router.navigate(['/public' ,{ outlets: { 'model': null } }]);
    }
    
    ngOnDestroy(): void {
    this.#domService.setBodyOverflow('auto');
    this.#postService.setPost(null);
    }

}