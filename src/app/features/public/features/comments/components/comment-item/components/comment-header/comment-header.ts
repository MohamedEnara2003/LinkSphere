import { Component, inject, input } from '@angular/core';
import { FormatDatePipe } from '../../../../../../../../shared/pipes/format-date-pipe';
import { SharedModule } from '../../../../../../../../shared/modules/shared.module';
import { NgMenuActions } from "../../../../../../components/navigations/menu-actions/menu-actions";
import { IComment } from '../../../../../../../../core/models/comments.model';
import { Router } from '@angular/router';
import { DeleteCommentService } from '../../../../services/api/delete-comment.service';



@Component({
  selector: 'app-comment-header',
  imports: [FormatDatePipe, SharedModule, NgMenuActions],
  template: `
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
`,
providers : [DeleteCommentService],
})
export class CommentsHeader {
    readonly #deleteCommentService = inject(DeleteCommentService);
    readonly #router = inject(Router);
    comment = input.required<IComment>();
    postId = input.required<string>();


handleCommentMenu(type : string) : void {
switch (type) {
case 'edit':  this.openUpsertPostModel();
break;
case 'delete' : this.deleteComment();
}
}

deleteComment(): void {
    const { _id: commentId } = this.comment();
    const postId = this.postId();
    if (commentId && postId) {
    this.#deleteCommentService.deleteComment(postId, commentId).subscribe();
    }
}

openUpsertPostModel() : void {
this.#router.navigate([], {
queryParams : {type : 'edit' , commentId : this.comment()._id || null} ,
queryParamsHandling : 'merge'})
}

}


