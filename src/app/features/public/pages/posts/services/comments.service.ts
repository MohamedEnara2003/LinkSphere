import { inject, Injectable } from '@angular/core';
import { SingleTonApi } from '../../../../../core/services/api/single-ton-api.service';
import { Observable } from 'rxjs';
import { ICreateComment, IReplyComment, IUpdateComment } from '../../../../../core/models/comments.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  #singleTonApi = inject(SingleTonApi);
  #routeName: string = "posts";

// 🟢 Create Comment
createComment(postId: string, data: ICreateComment): Observable<any> {
    const formData = new FormData();
    if (data.content) formData.append('content', data.content);
    if (data.image) formData.append('image', data.image);
    if (data.tags) {
    data.tags.forEach((tag, index) => formData.append(`tags[${index}]`, tag));
    }
    return this.#singleTonApi.create<any>(`${this.#routeName}/${postId}/comment`, formData);
}

// 🟢 Update Comment
updateComment(postId: string, commentId: string, data: IUpdateComment): Observable<any> {
    const formData = new FormData();
    if (data.content) formData.append('content', data.content);
    if (data.image) formData.append('image', data.image);
    if (data.tags) {
      data.tags.forEach((tag, index) => formData.append(`tags[${index}]`, tag));
    }
    if (data.removedTags) {
      data.removedTags.forEach((tag, index) => formData.append(`removedTags[${index}]`, tag));
    }
    if (data.removeAttachment) {
      formData.append('removeAttachment', 'true');
    }
  
    return this.#singleTonApi.patch<any>(
      `${this.#routeName}/${postId}/update/${commentId}`,
      formData
    );
  }
  

// 🟢 Reply on Comment
replyComment(postId: string, commentId: string, data: IReplyComment): Observable<any> {
    const formData = new FormData();
    if (data.content) formData.append('content', data.content);
    if (data.image) formData.append('image', data.image);
    if (data.tags) {
      data.tags.forEach((tag, index) => formData.append(`tags[${index}]`, tag));
    }
  
    return this.#singleTonApi.create<any>(
      `${this.#routeName}/${postId}/${commentId}/reply`, 
      formData
    );
  }
  

// 🟢 Delete Comment
deleteComment(postId: string, commentId: string): Observable<void> {
    return this.#singleTonApi.deleteById<void>(
    `${this.#routeName}/${postId}/delete`,
    commentId
    );
}

    // 🟢 Get Comment By Id
    getCommentById(postId: string, commentId: string): Observable<any> {
        return this.#singleTonApi.find<any>(`${this.#routeName}/${postId}/comment/${commentId}`);
    }
    
      // 🟢 Like/Unlike Comment
    likeComment(postId: string, commentId: string): Observable<any> {
    return this.#singleTonApi.create<any>(`${this.#routeName}/${postId}/${commentId}/like`, null);
    }
}
