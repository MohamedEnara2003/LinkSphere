import { inject, Injectable } from "@angular/core";
import { IPaginatedPostsResponse, IPost } from "../../../../../../core/models/posts.model";
import { EMPTY, Observable, tap } from "rxjs";
import { AppPostsService } from "../app/app-posts.service";
import { PostsStateService } from "../state/posts-state.service";
import { Author } from "../../../../../../core/models/user.model";


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

  getFreezedPosts(
    page: number = 1,
    limit: number = 10
  ) : Observable<{data: IPaginatedPostsResponse }>{

    const cachedPosts = this.#postsStateService.userFreezedPosts();
    if (cachedPosts.length > 0) return EMPTY

    return this.#appPostsService.singleTonApi.find<{data : IPaginatedPostsResponse}>
    (`${this.#appPostsService.routeName}/freezed?page=${page}&limit=${5}`) .pipe(
    tap(({data : {posts}}) => {
    const user  = this.#appPostsService.userService.user();
    if(!user) return;
    const freezePosts : IPost[] = posts.map((post) => ({...post ,author : user}))
    this.#postsStateService.addFreezePosts(freezePosts)
    })
    )
    }
}