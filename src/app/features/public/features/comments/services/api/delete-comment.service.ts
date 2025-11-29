import {inject, Injectable, } from '@angular/core';
import { AppCommentService } from '../app/app-comments.service';
import { CommentsStateService } from '../state/comments-state.service';
import { Observable, tap } from 'rxjs';


@Injectable()
export class DeleteCommentService {

    readonly #appCommentsService = inject(AppCommentService);
    readonly #commentsStateService = inject(CommentsStateService);

    // 🟢 Delete Comment
    deleteComment(postId: string, commentId: string): Observable<void> {
    return this.#appCommentsService.singleTonApi.deleteById<void>
    (`${this.#appCommentsService.routeName}/${postId}/delete`, commentId)
    .pipe(
    tap(() => this.#commentsStateService.updateDeleteComment(commentId))
    );
}

}
