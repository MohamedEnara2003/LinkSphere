import { computed, Injectable, signal } from '@angular/core';
import { IUser, RelationshipState } from '../../../../../../core/models/user.model';
import { IComment } from '../../../../../../core/models/comments.model';
import { UpdateCommentFn } from '../api/update-comment.service';



@Injectable({
  providedIn: 'root'
})
export class CommentsStateService {

  // Post Comments State

  // Private
  #_comments = signal<IComment[]>([]);
  #_replies = signal<IComment[]>([]);
  #_comment = signal<IComment | null>(null);
  #_reply= signal<IComment | null>(null);
  #_commentIdLikedUsers = signal<{commentId: string, likedUsers: IUser[]}>({commentId: '', likedUsers: []});

  // Public

  comments = computed<IComment[]>(() => this.#_comments());
  replies = computed<IComment[]>(() => this.#_replies());
  comment = computed<IComment | null>(() => this.#_comment());
  reply = computed<IComment | null>(() => this.#_reply());
  commentIdLikedUsers = computed<{commentId: string, likedUsers: IUser[]}>(() => this.#_commentIdLikedUsers());

  // Pagination
  commentsPage = signal<number>(1);
  hasMoreComments = signal<boolean>(false);
  
// ________________________________________________

// Update post comments state:

// 1- Update toggle likes
updateToggleLikeComment(updatedComments : (list: IComment[]) => IComment[]) : void {
this.#_comments.update(updatedComments);
this.#_replies.update(updatedComments);
}

updatePrevToggleLikeComment() : void {
  const prevComments = this.#_comments();
  const prevReplies = this.#_replies();
  this.#_comments.set(prevComments);
  if(prevReplies.length){
  this.#_replies.set(prevReplies);
  }
}

// 2- Update Users Likes
updatePostLikerFlag(userId: string, flag: RelationshipState) : void {
  if(!userId) return;
  this.#_commentIdLikedUsers.update(({commentId, likedUsers}) => ({
    commentId,
    likedUsers: likedUsers.map((user) =>
      user._id === userId ? { ...user, flag } : user
    )
  }));
  }
updateCommentIdLikedUsers(commentId : string , likedUsers : IUser[] ) : void {
this.#_commentIdLikedUsers.set({commentId, likedUsers});
}
//_____________________________________________________________


// Update comments state after delete
updateDeleteComment(commentId : string) : void {
  this.#_comments.update(comments => comments.filter(c => c._id !== commentId));

  // Delete the reply comment 
  if (this.#_replies().length > 0) {

  const deletedReply = this.#_replies().find(r => r._id === commentId);
  const parentCommentId = deletedReply?.commentId;

  const commentReplies = this.#_replies().filter((r) => r._id === parentCommentId);

  this.#_replies.update(replies =>
  replies
  .map(r =>
  (r._id === parentCommentId && commentReplies.length === 0) ? {...r, lastReply: null } : r
  )
  .filter(r => r._id !== commentId)
  );
  }
}
//_____________________________________________________________

// Update (comments && replies) state after create
updateCreateComment(newComment : IComment) : void {
this.#_comments.update((c) =>  [{...newComment}, ...c])
}

updateCreateReplyComment(newReplies : IComment , commentId : string) : void {
    this.#_replies.update((replies) => 
    [{...newReplies }, ...replies].map((r) =>
    r._id === commentId ? ({...r , lastReply : 'new Reply'}) : r
    )
    );

    this.#_comments.update((comments) => comments.map((c) => 
    c._id === commentId ? ({...c , lastReply : 'new Reply'}) : c
    ))
}
//_____________________________________________________________

// Update (comment & reply) state after update comment
updateStateComment(updateFn: UpdateCommentFn , commentId : string): void {
  this.#_comments.update((comments) =>
  comments.map((c) => c._id === commentId ? updateFn(c): c)
  );
  this.#_replies.update((replies) =>
  replies.map((c) => c._id === commentId ? updateFn(c): c)
  );
}
//_____________________________________________________________

// Update (comments & replies) state after update comment
updateGetComments(newComments : IComment[] , totalPages : number) : void {
  if(!newComments.length &&  this.commentsPage() >= totalPages){
  return this.hasMoreComments.set(false)
  }
  
  this.#_comments.update((comments) => [...comments ,...newComments]);
  this.commentsPage.update((p) => p + 1);
  this.hasMoreComments.set(true);
}


updateGetReplies(newReplies : IComment[]) : void {
  this.#_replies.update(existing => {
    const filterReplies = newReplies.filter(r => !existing.some(e => e._id === r._id));
    return [...existing, ...filterReplies];
  });
}
//_____________________________________________________________


}
