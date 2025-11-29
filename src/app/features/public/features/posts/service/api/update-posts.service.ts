import { inject, Injectable } from "@angular/core";
import { FormPost, IPost, IUpdatePostAttachments, IUpdatePostContent } from "../../../../../../core/models/posts.model";
import {  EMPTY, Observable, tap } from "rxjs";
import { AppPostsService } from "../app/app-posts.service";
import { PostsStateService } from "../state/posts-state.service";


@Injectable()

export class UpdatePostService {
    
    #appPostsService = inject(AppPostsService);
    #postsStateService = inject(PostsStateService);

    // 🟢 Update Post Content
    updatePostContent(postId: string, data: FormPost): Observable<{ data: { postId: string } }> {
      const existingPost = this.#postsStateService.post();
      if (!existingPost) return EMPTY;


      const payload: Partial<IUpdatePostContent> = {};
    
      if (data.content !== undefined && data.content !== existingPost.content) {
        payload.content = data.content;
      }
    
      if (data.availability !== undefined && data.availability !== existingPost.availability) {
        payload.availability = data.availability;
      }
    
      if (data.allowComments !== undefined && data.allowComments !== existingPost.allowComments) {
        payload.allowComments = data.allowComments;
      }
    
      // tags
      if (data.tags) {
        const newTags = data.tags.filter(id => !existingPost.tags.includes(id));
        if (newTags.length) payload.addToTags = newTags;
      }
    
      if (data.removedTags?.length) {
        payload.removeFromTags = data.removedTags;
      }
    
      if (Object.keys(payload).length === 0) return EMPTY;
    
      return this.#appPostsService.singleTonApi.patch<{ data: { postId: string } }>(
        `${this.#appPostsService.routeName}/update-content/${postId}`,
        payload
      ).pipe(
        tap(() => {
          this.#postsStateService.UpdatePostsStateMap(postId, payload, [] , data.availability);
        }),
      );
    }
    


  updatePostAttachments(postId: string, data : FormPost )
  : Observable<{ data: { post :IPost} }> {


    
   const payload: Partial<IUpdatePostAttachments> = {};

    if (data.attachments && data.attachments.length > 0) {
      payload.addToAttachments = data.attachments;
    }

    if (data.removedAttachments && data.removedAttachments.length > 0) {
      payload.removeFromAttachments = data.removedAttachments;
    }

    // nothing to update
    if (!payload.addToAttachments && !payload.removeFromAttachments) {
    return EMPTY;
    }

    const formData = new FormData();

    // 🟢 Attachments 
    if (payload.addToAttachments && payload.addToAttachments.length > 0) {
      payload.addToAttachments.forEach((file: File) => formData.append('addToAttachments', file));
    }

    // 🟢 Removed Attachments 
    if (payload.removeFromAttachments && payload.removeFromAttachments.length > 0) {

      payload.removeFromAttachments.forEach((att, index) => {
        formData.append(`removeFromAttachments[${index}]`, att);
      });
    }
    return this.#appPostsService.singleTonApi.patch<{ data: { post: IPost} }>(
    `${this.#appPostsService.routeName}/update-attachments/${postId}`,
    formData
    ).pipe(
    tap(({data : {post}}) =>     
    this.#postsStateService.UpdatePostsStateMap(postId , {} , post.attachments , data.availability))
    )
  }

}