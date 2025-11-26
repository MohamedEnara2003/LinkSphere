import { computed, Injectable, signal } from '@angular/core';
import { IUser, RelationshipState } from '../../../../../core/models/user.model';


@Injectable({
  providedIn: 'root'
})
export class CommentsStateService {


  #commentIdLikedUsers = signal<{commentId: string, likedUsers: IUser[]}>({commentId: '', likedUsers: []});
  commentIdLikedUsers = computed<{commentId: string, likedUsers: IUser[]}>(() => this.#commentIdLikedUsers());


updatePostLikerFlag(userId: string, flag: RelationshipState) : void {
  if(!userId) return;
  this.#commentIdLikedUsers.update(({commentId, likedUsers}) => ({
    commentId,
    likedUsers: likedUsers.map((user) =>
      user._id === userId ? { ...user, flag } : user
    )
  }));
  }



updateCommentIdLikedUsers(commentId : string , likedUsers : IUser[] ) : void {
this.#commentIdLikedUsers.set({commentId, likedUsers});
}

}
