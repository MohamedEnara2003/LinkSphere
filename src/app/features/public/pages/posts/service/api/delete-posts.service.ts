import { inject, Injectable } from "@angular/core";
import { Availability } from "../../../../../../core/models/posts.model";
import { Observable, tap } from "rxjs";
import { AppPostsService } from "../app/app-posts.service";
import { PostsStateService } from "../state/posts-state.service";


@Injectable()

export class DeletePostService {
#appPostsService = inject(AppPostsService);
#postsStateService = inject(PostsStateService);


// 🟢 Delete Post
deletePost(postId: string, availability: Availability): Observable<void> {
return this.#appPostsService.singleTonApi.deleteById<void>
(this.#appPostsService.routeName, postId).pipe(
tap(() => this.#postsStateService.removePostFromState(postId, availability)),
);
}


}