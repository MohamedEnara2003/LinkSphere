import { Component, ChangeDetectionStrategy, model, inject, afterNextRender, OnDestroy, input, signal } from '@angular/core';
import { DomService } from '../../../../../../../../../core/services/dom.service';
import { SharedModule } from '../../../../../../../../../shared/modules/shared.module';
import { UpsertComment } from "../components/upsert-comment/upsert-comment";
import { CommentItem } from "../components/comment-item/comment-item";
import { ReplyList } from "../components/reply-list/reply-list";



export interface IReply2 {
  _id: string;
  content?: string;
  image?: string;
  tags?: string[];
  author: string;
  likes: string[];   // 🟢 IDs of users who liked the reply
  createdAt: string;
}

export interface IComment2 {
  _id: string;
  content?: string;
  image?: string;
  tags?: string[];
  author: string;
  likes: string[];   // 🟢 IDs of users who liked the comment
  createdAt: string;
  replies: IReply2[];
}


@Component({
  selector: 'app-post-comments',
  imports: [SharedModule, UpsertComment, CommentItem, ReplyList],
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
        class="relative w-full sm:w-[70%] md:w-[60%] 2xl:w-1/2 h-120 2xl:h-96 
        ngCard rounded-t-2xl shadow-xl animate-up flex flex-col"
        aria-labelledby="comments-title" >

        <!-- Header -->
        <header class="flex items-center justify-between px-4 py-3 border-b border-base-200">
          <h2 id="comments-title" class="text-lg font-semibold ngText">Comments</h2>
          <button 
            class="btn btn-sm btn-ghost" 
            type="button"
            (click)="isOpenComments.set(false)"
            aria-label="Close comments">
            ✕
          </button>
        </header>

        <!-- Comments List -->
        <section class="flex-1 overflow-y-auto px-4 py-2" aria-live="polite" 
        style="scrollbar-width: none;">
          <ul class="space-y-6">
          @for (comment of comments(); track comment._id) {
          @let commentId = comment._id  ;
          <li 
            class="relative flex flex-col gap-2 p-3  rounded-box shadow-sm bg-light/50 dark:bg-dark/50
            after:absolute after:left-2 after:top-0 after:rounded-full 
            after:w-[1px] after:h-full after:bg-brand-color/50
            "
            role="article"
            [attr.aria-labelledby]="'comment-' +  commentId + '-author'"
            [attr.aria-describedby]="'comment-' + commentId + '-content'">
            @if(comment){
            <app-comment-item [comment]="comment" class="relative space-y-1 px-2
            after:absolute after:left-0 after:top-6  after:w-2 after:h-[1px] after:bg-brand-color/50
            " />

    <!-- Replies Button (down like Facebook) -->
<!-- Replies Button (down like Facebook) -->
@if (comment.replies.length > 0 && isOpenReplies() !== commentId) {
  <div class="px-3">
    <button  
      (click)="isOpenReplies.set(isOpenReplies() === commentId ? '' : commentId)"
      type="button" 
      class="flex items-center gap-2 text-xs text-gray-500 hover:text-brand-color transition-colors 
      duration-300 cursor-pointer"
      [attr.aria-expanded]="false"
      [attr.aria-controls]="'replies-' + commentId"
      [attr.aria-labelledby]="'comment-' + commentId + '-author'"
      [attr.aria-describedby]="'comment-' + commentId + '-content'">
      
      <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="currentColor" viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clip-rule="evenodd" />
      </svg>

      <span class="font-medium">
        {{ comment.replies[comment.replies.length - 1].author }} replied
      </span>

      <span>
        {{ comment.replies.length || 0 }} replies
      </span>
    </button>
  </div>
}

    @if(isOpenReplies() === commentId){
      @for (item of comment.replies; track item._id) {
      <app-reply-list [reply]="item" class="relative space-y-1 px-4 py-2  animate-opacity
      after:absolute after:left-0 after:top-6 after:w-3 after:h-[1px] after:bg-brand-color/50
      " />  
      }
    }
    }
    </li>
    }
    </ul>
    </section>

        <!-- Add Comment -->
        <footer class="border-t border-base-200 p-3">
          <app-upsert-comment />
        </footer>
      </article>

      <!-- Backdrop -->
      <div 
        (click)="isOpenComments.set(false)"
        class="size-full bg-dark/50 fixed inset-0 -z-10"
        aria-hidden="true"
        tabindex="-1">
      </div>
    </section>
  `,
})
export class PostComments implements OnDestroy{
    #domService = inject(DomService);
    isOpenComments = model<boolean>(false);

    isOpenReplies = signal<string>('');

  comments = signal<IComment2[]>([
    {
      _id: 'c1',
      content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Id tenetur libero fuga autem, soluta ab impedit temporibus optio necessitatibus   🚀',
      author: 'user1',
      likes: ['user2'],
      createdAt: new Date().toISOString(),
      replies: [
        {
          _id: 'r1',
          content: 'First reply 👋',
          author: 'user2',
          likes: [],
          createdAt: new Date().toISOString(),
          tags: []
        },
        {
          _id: 'r2',
          content: 'Second reply 👋',
          author: 'user3',
          likes: [],
          createdAt: new Date().toISOString(),
          tags: []
        }
      ],
      tags: []
    },
    {
      _id: 'c2',
      content: 'Second comment 💡',
      author: 'user2',
      likes: [],
      createdAt: new Date().toISOString(),
      replies: [],
      tags: []
    },
    {
      _id: 'c3',
      content: 'Second comment 💡',
      author: 'user3',
      likes: [],
      createdAt: new Date().toISOString(),
      replies: [],
      tags: []
    },
    {
      _id: 'c4',
      content: 'Second comment 💡',
      author: 'user4',
      likes: [],
      createdAt: new Date().toISOString(),
      replies: [],
      tags: []
    }
  ]);

    constructor(){
    afterNextRender(() => this.#domService.setBodyOverflow('hidden'))
    }
    
    
    ngOnDestroy(): void {
    this.#domService.setBodyOverflow('auto');
    }

}