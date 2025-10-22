import { Component, input } from '@angular/core';
import { IComment } from '../../../../../../../../../../core/models/comments.model';
import { CommentItem } from "../comment-item/comment-item";
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-comment-list',
  imports: [CommentItem , CommonModule],
  template: `


  <app-comment-item 
  [comment]="comment() || ''" 
  [postId]="postId() || ''"
  />



`,
})
export class CommentList {
comment = input.required<IComment>();
postId = input.required<string>();




}
