import { inject, Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { AppCommentService } from "../app/app-comments.service";
import { CommentsStateService } from "../state/comments-state.service";
import { IComment, IUpdateComment } from "../../../../../../core/models/comments.model";
import { Picture } from "../../../../../../core/models/picture";

export type UpdateCommentFn = (comment: IComment) => IComment;
@Injectable()

export class UpdateCommentService {
    readonly #appCommentsService = inject(AppCommentService);
    readonly #commentsStateService = inject(CommentsStateService);


// 🟢 Update Comment
updateComment(postId: string, commentId: string, data: IUpdateComment, previewImage?: Picture): Observable<void> {
    const formData = this.#appCommentsService.buildCommentFormData(data);

    return this.#appCommentsService.singleTonApi.patch<void>(
    `${this.#appCommentsService.routeName}/${postId}/update/${commentId}`,
    formData
    ).pipe(
        tap(() => {
        const updateCommentData: UpdateCommentFn = (comment) => {
            if (comment._id !== commentId) return comment;
        
            const updatedTags = [
            ...(comment.tags ?? []).filter(tag => !data.removedTags?.includes(tag)),
            ...(data.tags?.filter(tag => !(comment.tags ?? []).includes(tag)) ?? [])
            ];
    
            const updatedAttachment =
                data.removeAttachment
                ? undefined
                : previewImage ?? comment.attachment;
        
            return {
            ...comment,
            content: data.content ?? comment.content,
            tags: updatedTags,
            attachment: updatedAttachment,
            updatedAt: new Date().toISOString()
            };
        };
        
        this.#commentsStateService.updateStateComment(updateCommentData , commentId);
    })
    );
}

}
