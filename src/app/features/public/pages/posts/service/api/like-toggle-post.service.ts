import { inject, Injectable } from "@angular/core";
import { AppPostsService } from "../app/app-posts.service";
import { PostsStateService } from "../state/posts-state.service";
import { catchError, EMPTY, Observable, of, tap } from "rxjs";
import { IUser } from "../../../../../../core/models/user.model";
import { Pagination } from "../../../../../../core/models/pagination";


@Injectable()

export class ToggleLikePost {
#appPostsService = inject(AppPostsService);
#postsStateService = inject(PostsStateService);


// 🟢 Like / Unlike Post
toggleLikePost(postId: string, userId: string): Observable<void> {
    if (!postId || !userId) return EMPTY;
    this.#postsStateService.updatePostLikes(postId, userId);

    return this.#appPostsService.singleTonApi
    .create<void>(`${this.#appPostsService.routeName}/like/${postId}`)
    .pipe(
        catchError(() => {
        this.#postsStateService.updatePostLikes(postId, userId);
        return EMPTY;
        })
    );
}


getLikedUsers(postId: string) : Observable<{data : {likedUsers : IUser[] , pagination? : Pagination}}> {
    const cachePostId = this.#postsStateService.postLikers().postId;
    const likedUsers = this.#postsStateService.postLikers().likedUsers;
    
    if (cachePostId === postId && likedUsers.length > 0) {
        return of({
        data: {likedUsers}
        });
    }

    return this.#appPostsService
    .singleTonApi.find<{ data : {likedUsers : IUser[] , pagination : Pagination}}>
    (`${this.#appPostsService.routeName}/${postId}/liked-users`)
    .pipe(
        tap(({data : {likedUsers}}) => {
        this.#postsStateService.addPostLikedUsers(likedUsers , postId);
        }),
        catchError(() => {
        return EMPTY;
        })
    );
}




}