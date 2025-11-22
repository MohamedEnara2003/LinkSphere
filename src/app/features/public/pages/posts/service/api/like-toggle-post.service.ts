import { inject, Injectable } from "@angular/core";
import { AppPostsService } from "../app/app-posts.service";
import { PostsStateService } from "../state/posts-state.service";
import { catchError, EMPTY, Observable } from "rxjs";


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


}