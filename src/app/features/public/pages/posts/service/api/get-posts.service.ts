import { inject, Injectable } from '@angular/core';

import { EMPTY,Observable , tap } from 'rxjs';
import { Availability, IPaginatedPostsResponse } from '../../../../../../core/models/posts.model';
import { AppPostsService } from '../app/app-posts.service';
import { PostsStateService } from '../state/posts-state.service';




@Injectable()

export class GetPostsService {
#appPostsService = inject(AppPostsService);
#postsStateService = inject(PostsStateService);



// 🟢 Get Posts (paginated)
getPosts(
availability: Availability ,
): Observable<{ data: IPaginatedPostsResponse }> {

const page = this.#postsStateService.getPostsByState()[availability].page;
return this.#appPostsService.singleTonApi.find<{data: IPaginatedPostsResponse }>(
`${this.#appPostsService.routeName}?page=${page}&limit=${5}`).pipe(

tap(({ data: { posts : newPosts , pagination} }) => {
const filteredPosts = newPosts.filter(p => p.availability === availability);
this.#postsStateService.addPosts(filteredPosts , availability , pagination.totalPages);
}),
);
}


  getUserPosts(
  userId : string ,
  page: number = 1,
  limit: number = 10
  ) : Observable<{data: IPaginatedPostsResponse }>{
  
  const posts = this.#postsStateService.userProfilePosts();
  
  const cachedPosts = posts.filter((p) => p.createdBy === (userId || ''));
  if (cachedPosts.length > 0)  return EMPTY
  
  return this.#appPostsService.singleTonApi.find<{data :IPaginatedPostsResponse}>
  (`${this.#appPostsService.routeName}/user/${userId}?page=${page}&limit=${limit} `).pipe(
  tap(({data : {posts}}) =>  this.#postsStateService.addUserPosts(posts))
  )
  }



}
