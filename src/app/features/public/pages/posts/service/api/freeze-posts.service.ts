import { inject, Injectable } from "@angular/core";
import { IPost } from "../../../../../../core/models/posts.model";
import { Observable, tap } from "rxjs";
import { AppPostsService } from "../app/app-posts.service";
import { PostsStateService } from "../state/posts-state.service";


@Injectable()

export class FreezePostService {
#appPostsService = inject(AppPostsService);
#postsStateService = inject(PostsStateService);


// 🟢 Freeze Post
freezePost(postId: string, post: IPost): Observable<void> {
  return this.#appPostsService.singleTonApi.deleteById<void>(`${this.#appPostsService.routeName}/freeze`, postId).pipe(
    tap(() => this.#postsStateService.freezePostLocally(postId , post))
  );
}

// 🟢 Unfreeze Post
unfreezePost(postId: string, post: IPost): Observable<void> {
  return this.#appPostsService.singleTonApi.patch<void>(`${this.#appPostsService.routeName}/unfreeze/${postId}`).pipe(
  tap(() => this.#postsStateService.unfreezePostLocally(postId , post))
  );
}

}