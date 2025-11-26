import { Component, ChangeDetectionStrategy, inject, OnDestroy, signal, OnInit } from '@angular/core';
import { DomService } from '../../../../../../../../../core/services/dom.service';
import { SharedModule } from '../../../../../../../../../shared/modules/shared.module';
import { UpsertComment } from "../components/upsert-comment/upsert-comment";

import { CommentService } from '../../../../../services/comments.service';
import { ActivatedRoute, Router } from '@angular/router';


import { LoadingService } from '../../../../../../../../../core/services/loading.service';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { CommentItem } from "../components/comment-item/comment-item";
import { CommentsHeader } from "../components/comments-header/comments-header";
import { EmptyComments } from "../components/empty-comments/empty-comments";
import { FeedAutoLoader } from "../../../../../../../components/navigations/feed-auto-loader/feed-auto-loader";
import { LoadingComment } from "../../../../loading/loading-comment/loading-comment";
import { PostsStateService } from '../../../../../service/state/posts-state.service';




@Component({
  selector: 'app-post-comments',
  imports: [
  SharedModule, 
  UpsertComment, 
  CommentItem, 
  CommentsHeader, 
  EmptyComments, 
  FeedAutoLoader, 
  LoadingComment
  ],
  template: `

    <!-- Overlay -->
  <section 
    class="fixed inset-0 flex items-end justify-center  z-[50]"
    role="dialog"
    aria-modal="true"
    aria-labelledby="postDialogTitle"
    aria-describedby="postDialogDescription"
    role="dialog">
    
    <!-- Comments Card -->
    <article
    class="relative w-full sm:w-[85%] md:w-[80%] lg:w-1/2 h-[80%]  flex flex-col z-50  gap-5
    rounded-t-3xl rounded-b-none ngCard shadow-2xl animate-up overflow-hidden"
    aria-labelledby="comments-title" >

    <!-- Header -->
    <app-comments-header />

    <!-- Comments List -->
    <section class="w-full h-full flex-1 overflow-y-auto p-2 flex flex-col "
    style="scrollbar-width: none;">

      <ul class="size-full list flex flex-col gap-4">
        @for (comment of commentService.comments(); track comment._id) {
        @defer (on viewport) {
        <li class="p-2 ngCard ">
        <app-comment-item
        [comment]="comment!" 
        [postId]="postId() || ''"
        />
        </li>
        }@placeholder {
        <app-loading-comment class="size-full"/>
        }
        }@empty {
      <app-empty-comments class="size-full"/>
      }

      @if(commentService.hasMoreComments()){
      <li >
      <app-feed-auto-loader
      loadingType="comment"
      (loadData)="loadMore()"
      aria-label="Load more comments"
      />
      </li>
      }
      </ul>
  

  </section>

  <!-- Add Comment -->
  <footer
      class="sticky bottom-0 z-10   p-1 md:p-2 ">
      <app-upsert-comment [postId]="postId()" />
    </footer>
    
  </article>

      <!-- Backdrop -->
      <div 
        (click)="closeComments()"
        class="size-full bg-dark/50 fixed inset-0 z-40"
        aria-hidden="true"
        tabindex="-1">
      </div>

    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComments implements OnDestroy, OnInit{
    commentService = inject(CommentService);
    loadingService = inject(LoadingService);

    #postsState = inject(PostsStateService);
    #domService = inject(DomService);

    #router = inject(Router);
    #route = inject(ActivatedRoute);

    postId = toSignal<string ,string>(this.#route.queryParamMap.pipe(map((query) => query.get('postId') || '')) , {
    initialValue : ''
    })
  
    
    isOpenReplies = signal<string>('');

    ngOnInit(): void {
    this.#domService.setBodyOverflow('hidden');
    this.#getComments();
    }
    

    #getComments(): void {
      const post = this.#postsState.post() ;
      if (post && post._id) {
      this.commentService.getPostComment(post._id).subscribe();
      }
    }
  
  closeComments(): void {
  this.#router.navigate(
    ['/public', { outlets: { model: null }}],
    {
    queryParamsHandling: 'merge'
    }
  );
}

    loadMore() : void {
    this.#getComments();
    }

    ngOnDestroy(): void {
    this.#domService.setBodyOverflow('auto');
    this.#postsState.setPost(null);
    this.commentService.clearData();
    }

}