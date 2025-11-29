import { inject, Injectable } from "@angular/core";
import { IComment, ICreateComment, IReplyComment, IUpdateComment } from "../../../../../../core/models/comments.model";
import { Observable, tap } from "rxjs";
import { AppCommentService } from "../app/app-comments.service";
import { CommentsStateService } from "../state/comments-state.service";
import { Author } from "../../../../../../core/models/user.model";


@Injectable()

export class CreateCommentService {
    readonly #appCommentsService = inject(AppCommentService);
    readonly #commentsStateService = inject(CommentsStateService);

    #getAuthor() : Author  {
        const user =  this.#appCommentsService.userService.user();
        if(!user) return {} as Author;  
        return {
        _id: user._id ,
            id: user._id ,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            picture : {
            url : user.picture?.url || '' ,
            public_id : user.picture?.public_id || '' ,
        }
    }
    }


createComment(postId: string, data: ICreateComment)
: Observable<{ data: {comment : IComment} }> {
    const formData = this.#appCommentsService.buildCommentFormData(data);
    return this.#appCommentsService.singleTonApi.create<{ data: {comment : IComment} }>(
    `${this.#appCommentsService.routeName}/${postId}/create-comment`,
    formData
    ).pipe(
    tap(({ data: {comment} }) => {

    const newComment :IComment = { ...comment , author : this.#getAuthor()};
    this.#commentsStateService.updateCreateComment(newComment);
    }

)
);
}

// 🟢 Reply on Comment
replyComment(postId: string, commentId: string, data: IReplyComment ) : Observable<{ data: IComment}> {
    const formData = this.#appCommentsService.buildCommentFormData(data);

    return this.#appCommentsService.singleTonApi.create<{ data: IComment}>(
    `${this.#appCommentsService.routeName}/${postId}/${commentId}/create-reply`,
    formData
    ).pipe(
    tap(({data}) => {
    
    const newReplyComment : IComment = {
    ...data ,
    author : this.#getAuthor()
    }

    this.#commentsStateService.updateCreateReplyComment(newReplyComment , commentId);
    })
  );
}


}
