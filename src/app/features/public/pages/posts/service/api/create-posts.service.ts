import { inject, Injectable } from "@angular/core";

import { Observable, tap } from "rxjs";
import { Availability, FormPost, ICreatePost, IPost } from "../../../../../../core/models/posts.model";
import { Picture } from "../../../../../../core/models/picture";
import { AppPostsService } from "../app/app-posts.service";
import { PostsStateService } from "../state/posts-state.service";


@Injectable()

export class CreatePostService {
  #appPostsService = inject(AppPostsService);
  #postsStateService = inject(PostsStateService);


// 🟢 Create Post
  createPost(data: FormPost)
  : Observable<{data : {postId : string , attachments : Picture[]} }> {

    // Preload Post
    const post = data as FormPost;

    const createdPost: ICreatePost = {
    ...post,
    allowCommentsEnum: post.allowComments || 'allow',
    };

    const formData = new FormData();

    // 🟢 Attachments (optional, max 2)
    if (createdPost.attachments && createdPost.attachments.length > 0) {
    createdPost.attachments.forEach(file => formData.append('attachments', file));
    }

    // 🟢 Content (optional)
    if (createdPost.content) {
      formData.append('content', createdPost.content);
    }

    // 🟢 Availability (default = public)
    formData.append('availability', createdPost.availability || 'public');
    formData.append('allowCommentsEnum', createdPost.allowCommentsEnum|| 'allow');
  
    // 🟢 Tags (optional array)
    if (createdPost.tags && createdPost.tags.length > 0) {
    createdPost.tags.forEach((tagId, index) => {
    formData.append(`tags[${index}]`, tagId);
    });
    }

    // 🟢 Add Request
    return this.#appPostsService.singleTonApi.create<{data : {postId : string , attachments : Picture[]} }>
    (`${this.#appPostsService.routeName}/create-post`, formData).pipe(
    tap(({data : {postId , attachments }}) => {

    const availability = data.availability || 'public';
    const user = this.#appPostsService.userService.user();
    if(!user) return ;

    const newPost : IPost = {
      _id: postId,
      id: postId,
      content: createdPost.content || '',
      availability,
      attachments,
      likes : [],
      tags: createdPost.tags || [],
      createdBy: user._id ?? '',
      author: user,
      allowComments: createdPost.allowCommentsEnum|| 'allow' ,
      lastComment : undefined,
      commentsCount : 0 ,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } 

    this.#appPostsService.closeUpsertModelPost(availability);;
    this.#postsStateService.addPost(newPost);
    })
    );
  }
  
}