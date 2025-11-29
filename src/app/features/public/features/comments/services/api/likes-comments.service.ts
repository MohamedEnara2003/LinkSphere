import { inject, Injectable } from "@angular/core";
import { catchError, EMPTY, Observable, of, tap } from "rxjs";
import { AppCommentService } from "../app/app-comments.service";
import { IUser } from "../../../../../../core/models/user.model";
import { Pagination } from "../../../../../../core/models/pagination";
import { CommentsStateService } from "../state/comments-state.service";
import { IComment } from "../../../../../../core/models/comments.model";


@Injectable()
export class LikesCommentsService {
    readonly #appCommentsService = inject(AppCommentService);
    readonly #commentsStateService = inject(CommentsStateService);

  // 🟢 Like/Unlike Comment
likeComment(postId: string, commentId: string, userId: string): Observable<void> {
  if (!postId || !commentId || !userId) return EMPTY;
  const toggleLike = (list: IComment[]) =>
    list.map((c) => {
      if (c._id !== commentId) return c;
      const updatedLikes = new Set(c.likes ?? []);
      updatedLikes.has(userId)
        ? updatedLikes.delete(userId)
        : updatedLikes.add(userId);
      return { ...c, likes: Array.from(updatedLikes) };
    });

  this.#commentsStateService.updateToggleLikeComment(toggleLike);

  return this.#appCommentsService.singleTonApi
    .create<void>(`${this.#appCommentsService.routeName}/${postId}/${commentId}/like`)
    .pipe(
      catchError(() => {
        this.#commentsStateService.updatePrevToggleLikeComment();
        return EMPTY;
      })
    );
}

getCommentLikes(postId: string, commentId: string): Observable<{data: {likedUsers: IUser[] , pagination?: Pagination}}> {
    const cacheCommentId = this.#commentsStateService.commentIdLikedUsers().commentId;
    const likedUsers = this.#commentsStateService.commentIdLikedUsers().likedUsers;

    if (cacheCommentId === commentId && likedUsers.length > 0) {
    return of({data: {likedUsers}});
    }

    return this.#appCommentsService.singleTonApi.find<{data: {likedUsers: IUser[] , pagination?: Pagination}}>(
    `${this.#appCommentsService.routeName}/${postId}/${commentId}/liked-users`
    ).pipe(
    tap(({data: {likedUsers}}) => {
    this.#commentsStateService.updateCommentIdLikedUsers(commentId , likedUsers);
    }),
    catchError(() => EMPTY)
    );
}




}
