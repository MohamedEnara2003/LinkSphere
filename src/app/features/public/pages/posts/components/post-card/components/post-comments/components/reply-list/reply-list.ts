import { Component, inject, input, linkedSignal } from "@angular/core";
import { CommentService } from "../../../../../../services/comments.service";
import { IComment } from "../../../../../../../../../../core/models/comments.model";
import { SharedModule } from "../../../../../../../../../../shared/modules/shared.module";
import { CommentItem } from "../comment-item/comment-item";


@Component({
  selector: 'app-reply-list',
  imports: [SharedModule, CommentItem],
  template : `

    @if(replies().length > 0){
    <ul class="list flex flex-col gap-4">
    @for (reply of replies(); track reply._id) {
    <li class="p-2 ngCard border-b border-base-200 dark:border-base-content/10 ">
    <app-comment-item
    [comment]="reply"
    [postId]="postId()"
    />
    </li>
    }
    </ul>
    }
`
})
export class ReplyList {
    #commentService = inject(CommentService);
    postId    = input.required<string>();   
    commentId = input.required<string>();   
    


replies = linkedSignal<IComment[]>(() => 
this.#commentService.replies().filter((r) => r.commentId === this.commentId()))



ngOnInit(): void {
this.#loadReplies()
}


#loadReplies() : void {
const  commentId = this.commentId();
const postId = this.postId();

if(postId && commentId && this.replies().length === 0){
this.#commentService.getCommentReplies(postId , commentId).subscribe();
}
}

}
