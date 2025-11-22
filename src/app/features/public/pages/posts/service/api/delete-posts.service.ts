import { inject, Injectable } from "@angular/core";
import { Availability, IPost } from "../../../../../../core/models/posts.model";
import { Observable, tap } from "rxjs";
import { AppPostsService } from "../app/app-posts.service";


@Injectable()

export class DeletePostService {
#appPostsService = inject(AppPostsService);


// 🟢 Delete Post
private removePostFromState(postId: string, availability: Availability) {
const filteringPosts = (posts : IPost[]) : IPost[] => posts.filter((p) => p._id !== postId);

//   this.#postsStateMap.update((state) => {
//     const target = state[availability];
//     return {
//       ...state,
//       [availability]: {
//         ...target,
//         posts: filteringPosts(target.posts),
//       },
//     };
//   });

//   if(this.#userProfilePosts().length > 0){
//   this.#userProfilePosts.update((posts) => filteringPosts(posts))
//   }
}

deletePost(postId: string, availability: Availability): Observable<void> {
return this.#appPostsService.singleTonApi.deleteById<void>
(this.#appPostsService.routeName, postId).pipe(
tap(() => this.removePostFromState(postId, availability)),
);
}


}