import { inject, Injectable } from "@angular/core";
import { AppCommentService } from "../app/app-comments.service";
import { CommentsStateService } from "../state/comments-state.service";
import { Observable, of, tap } from "rxjs";
import { IPaginatedCommentsRepliesRes, IPaginatedCommentsRes } from "../../../../../../core/models/comments.model";



@Injectable()
export class GetCommentsService {
    readonly #appCommentsService = inject(AppCommentService);
    readonly #commentsStateService = inject(CommentsStateService);


    getPostComment(
        postId: string,
        limit: number = 5
      ): Observable<IPaginatedCommentsRes> {
        
        const page = this.#commentsStateService.commentsPage() ;
        if(!this.#commentsStateService.hasMoreComments() && page > 1) return of({
        data : {comments : []}
        });
  
        return this.#appCommentsService.singleTonApi
          .find<IPaginatedCommentsRes>(
          `${this.#appCommentsService.routeName}/${postId}/comments?page=${page}&limit=${limit}`
          )
          .pipe(
            tap(({ data: { comments  , pagination} }) => {
            const {totalPages} = pagination!;
            
            this.#commentsStateService.updateGetComments(comments , totalPages);
            })
          );
      }
    
  
    getCommentReplies(
      postId: string,
      commentId: string,
      page: number = 1,
      limit: number = 2
    ): Observable<IPaginatedCommentsRepliesRes> {
      return this.#appCommentsService.singleTonApi.find<IPaginatedCommentsRepliesRes>(
        `${this.#appCommentsService.routeName}/${postId}/${commentId}/replies?page=${page}&limit=${limit}`
        )
        .pipe(
        tap(({ data: { replies } }) => this.#commentsStateService.updateGetReplies(replies))
        );
    }
  
}
