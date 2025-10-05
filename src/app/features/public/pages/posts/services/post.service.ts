import { inject, Injectable } from '@angular/core';
import { SingleTonApi } from '../../../../../core/services/api/single-ton-api.service';
import { Observable } from 'rxjs';
import { ICreatePost, IPost, IUpdatePost } from '../../../../../core/models/posts.model';

@Injectable({
  providedIn: 'root'
})

export class PostService {
  #singleTonApi = inject(SingleTonApi);
  #routeName: string = "posts";

  // 🟢 Create New Post
  createPost(data: ICreatePost): Observable<ICreatePost> {
    if (data.attachments && data.attachments.length > 0) {
      // إرسال attachments كـ FormData
      const formData = new FormData();
      data.attachments.forEach(file => formData.append('attachments', file));
      return this.#singleTonApi.create(`${this.#routeName}/create-post`, formData);
    }

    // باقي البيانات → JSON
    const payload: any = {
      content: data.content,
      availability: data.availability,
      tags: data.tags
    };
    return this.#singleTonApi.create(`${this.#routeName}/create-post`, payload);
  }

  // 🟢 Update Post
  updatePost(postId: string, data: IUpdatePost): Observable<IUpdatePost> {

    if (data.attachments && data.attachments.length > 0) {
      const formData = new FormData();
      data.attachments.forEach(file => formData.append('attachments', file));
      return this.#singleTonApi.patch(`${this.#routeName}/update-post/${postId}`, formData);
    }

    const payload = {
      content: data.content,
      tags: data.tags,
      removedTags: data.removedTags
    };

    return this.#singleTonApi.patch(`${this.#routeName}/update-post/${postId}`, payload);
  }

  // 🟢 Delete Post
  deletePost(postId: string): Observable<void> {
    return this.#singleTonApi.deleteById<void>(`${this.#routeName}`, postId);
  }

  // 🟢 Get Posts (paginated)
  getPosts(page: number = 1, limit: number = 10): Observable<any> {
    return this.#singleTonApi.find<any>(`${this.#routeName}/?page=${page}&limit=${limit}`);
  }

  // 🟢 Get Post By Id
  getPostById(postId: string): Observable<IPost> {
    return this.#singleTonApi.findById<any>(`${this.#routeName}`, postId);
  }

  // 🟢 Like / Unlike Post
  toggleLike(postId: string): Observable<void> {
    return this.#singleTonApi.create<void>(`${this.#routeName}/like/${postId}`, {});
  }

  // 🟢 Freeze Post
  freezePost(postId: string): Observable<void> {
    return this.#singleTonApi.deleteById<void>(`${this.#routeName}/freez`, postId);
  }

  // 🟢 Unfreeze Post
  unfreezePost(postId: string): Observable<void> {
    return this.#singleTonApi.patchById<void>(`${this.#routeName}/unfreez`, {}, postId);
  }
}
