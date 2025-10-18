import { Component, inject, input, signal } from '@angular/core';
import { IComment } from '../../../../../../../../../../core/models/comments.model';
import { CommentItem } from "../comment-item/comment-item";
import { CommentService } from '../../../../../../services/comments.service';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs';


@Component({
  selector: 'app-comment-list',
  imports: [CommentItem , CommonModule],
  template: `

  <li class="p-2 ngCard border-b border-base-200 dark:border-base-content/10 ">

  <app-comment-item 
  [comment]="comment() || ''" 
  [postId]="postId() || ''"
  />

    @if(replies().length > 0){
    <ul class="list flex flex-col gap-4">
    @for (reply of replies(); track reply._id) {
    <li class="p-2 ngCard border-b border-base-200 dark:border-base-content/10">
    <app-comment-item 
    [comment]="reply!" 
    [postId]="postId() || ''"
    />

    </li>
    }
    </ul>
    }

    @if(comment().lastReply){
        <nav class="p-1">
        <button type="button" class="btn btn-sm sm:btn-md text-neutral-500  btn-link "
        (click)="getCommentReplies() ">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="size-3 duration-300 transition-transform"
        [ngClass]="replies().length === 0 ? '' : 'rotate-180'">
        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>

        {{replies().length === 0  ? 'View replies' : 'Less replies'}}
    
        </button>
        </nav>
    }

</li>
`,
})
export class CommentList {
#commentService = inject(CommentService);

comment = input.required<IComment>();
postId = input.required<string>();


replies = signal<IComment[]>([])

getCommentReplies() : void {
const {_id : commentId} = this.comment()
const postId = this.postId()
if(postId && commentId && this.replies().length === 0){
this.#commentService.getCommentReplies(postId , commentId).pipe(
  tap(({data : {replies}}) => {
  this.replies.set(replies);
  }) 
).subscribe();
}

else if(this.replies().length > 0){
this.replies.set([]);
}

}

}
