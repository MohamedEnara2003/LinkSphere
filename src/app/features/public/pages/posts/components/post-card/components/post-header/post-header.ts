import { Component, computed, inject, input } from '@angular/core';
import { NgImage } from "../../../../../../../../shared/components/ng-image/ng-image";
import { Router, RouterModule } from '@angular/router';
import { IPost } from '../../../../../../../../core/models/posts.model';
import { UserProfileService } from '../../../../../profile/services/user-profile.service';
import { ActionType, IMenuAction, NgMenuActions } from "../../../../../../components/navigations/menu-actions/menu-actions";
import { FormatDatePipe } from '../../../../../../../../shared/pipes/format-date-pipe';
import { TagsService } from '../../../../../../../../core/services/tags.service';

import { PostsStateService } from '../../../../service/state/posts-state.service';
import { FreezePostService } from '../../../../service/api/freeze-posts.service';
import { DeletePostService } from '../../../../service/api/delete-posts.service';


@Component({
selector: 'app-post-header',
imports: [NgImage, RouterModule, NgMenuActions , FormatDatePipe],
template: `

  <header class="flex justify-between items-center border-b border-brand-color/10 pb-1">
    
    <address class="not-italic flex  gap-2">
      <!-- Profile Image -->
      <app-ng-image  
        [routerLink]="userId() ? ['/public/profile/user', userId()] : []"
        [options]="{
          src:  post()?.author?.picture?.url || 'user-placeholder.webp' ,
          alt: 'Profile picture of ' + post()?.author?.userName || '',
          width:  60,
          height: 60, 
          class: 'size-8 sm:size-10 object-cover btn btn-circle btn-outline'
        }" 
      />

      <!-- Author Info -->
<section class="flex flex-col gap-2">

<div class="flex  flex-wrap items-center gap-2">
  <h2  class="text-base sm:text-lg card-title ngText capitalize ">
    {{ post()?.author?.userName}}
  </h2>

    <time 
          class="text-brand-color badge badge-xs p-1 bg-brand-color/20"
          [attr.datetime]="post()?.createdAt || ''">
          {{ post()?.createdAt! | formatDate }}
      </time>
</div>

@if(post()?.tags && post()?.tags?.length){
<p class="text-brand-color badge badge-xs sm:badge-sm  p-1 bg-brand-color/20">
{{tag.initTagText(post()?.tags || [])}}
</p>
}
</section>
</address>


      <app-ng-menu-actions
      title="Post Menu"
      [actions]="menuActions()"
      (action)="handleCommentMenu($event)"
      [userId]="post()?.author?._id || ''"
      />
  
  </header>
    
`,
providers :[
FreezePostService,
DeletePostService
]
})
export class PostHeader {
  tag = inject(TagsService);

  #freezePostService = inject(FreezePostService);
  #deletePostService = inject(DeletePostService);
  #postsState = inject(PostsStateService);

  #router = inject(Router);
  userService = inject(UserProfileService);


  post = input<IPost>();

  isMyPost = computed<boolean>(() => (this.userService.user()?._id || '') === (this.post()?.createdBy || ''))
  userId = computed<string>(() => this.post()?.author?._id || '');
  

  menuActions = computed<IMenuAction[]>(() => [
  {type: 'edit', label: 'Edit Post', icon: 'edit', variant: 'info' },
  {type: 'delete', label: 'Delete Post', icon: 'delete', variant: 'danger' },
  {
  type: this.post()?.isFreezed ? 'unFreeze' : 'freeze', 
  label: this.post()?.isFreezed ? 'UnFreeze Post' : 'Freeze Post', 
  icon: 'freeze', variant: 'warning' 
  }, 
  ])


  handleCommentMenu(type : ActionType) : void {
  switch (type) {
    case 'edit': this.editPost();
    break;
    case 'delete' : this.deletePost();
    break;
    case 'freeze' : this.freezPost();
    break;
    case 'unFreeze' : this.unFreezPost();
  }
  }

  editPost() : void {
  const post = this.post();
  if(post){
  this.#router.navigate(['/public' ,{ outlets: { 'model': ['upsert-post'] } }] , {
    queryParamsHandling : 'merge'
  })
  this.#postsState.setPost(post);
  }
  }

  freezPost() : void {
  const post = this.post();
  if(post){
  this.#freezePostService.freezePost(post._id , post).subscribe();
  }
  }

  unFreezPost() : void {
  const post = this.post();
  if(post){
  this.#freezePostService.unfreezePost(post._id , post).subscribe();
  }
  }

  deletePost() : void {
  const {_id : postId , availability} = this.post()!;
  if(postId){
  this.#deletePostService.deletePost(postId , availability).subscribe();
  }
  }

}
