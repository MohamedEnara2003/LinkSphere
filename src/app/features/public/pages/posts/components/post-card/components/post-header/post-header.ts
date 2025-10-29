import { Component, computed, inject, input } from '@angular/core';
import { NgImage } from "../../../../../../../../shared/components/ng-image/ng-image";
import { Router, RouterModule } from '@angular/router';
import { PostService } from '../../../../services/post.service';
import { IPost } from '../../../../../../../../core/models/posts.model';
import { UserProfileService } from '../../../../../profile/services/user-profile.service';
import { ActionType, IMenuAction, NgMenuActions } from "../../../../../../components/navigations/menu-actions/menu-actions";
import { FormatDateService } from '../../../../../../../../core/services/format-date.service';
import { TagsService } from '../../../../../../../../core/services/tags.service';


@Component({
selector: 'app-post-header',
imports: [NgImage, RouterModule, NgMenuActions],
template: `

  <header class="flex justify-between items-center border-b border-brand-color/10 pb-1">
    
    <address class="not-italic flex  gap-2">
      <!-- Profile Image -->
      <app-ng-image  
        [routerLink]="userId() ? ['/public/profile/user', userId()] : []"
        [options]="{
          src:  post()?.author?.picture || '' ,
          placeholder: '/user-placeholder.webp',
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
    {{ post()?.author?.userName || userService.userProfile()?.userName || ''}}
  </h2>

    <time 
          class="text-brand-color badge badge-xs p-1 bg-brand-color/20"
          [attr.datetime]="post()?.createdAt || ''">
          {{ formatDate.format(post()?.createdAt || '') }}
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
})
export class PostHeader {
  tag = inject(TagsService);
  #postService = inject(PostService);
  #router = inject(Router);
  
  userService = inject(UserProfileService);
  formatDate = inject(FormatDateService)

  post = input<IPost>();

  isMyPost = computed<boolean>(() => (this.userService.user()?._id || '') === (this.post()?.createdBy || ''))
  userId = computed<string>(() => this.post()?.author?._id || '');
  

  menuActions = computed<IMenuAction[]>(() => [
  { type: 'edit', label: 'Edit Comment', icon: 'edit', variant: 'info' },
  { type: 'delete', label: 'Delete Comment', icon: 'delete', variant: 'danger' },
  { type: this.post()?.isFreezed ? 'freeze' : 'unFreeze', 
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
  this.#router.navigate(['/public' ,{ outlets: { 'model': ['upsert-post'] } }])
  this.#postService.setPost(post);
  }
  }

  freezPost() : void {
  const post = this.post();
  if(post){
  this.#postService.freezePost(post._id , post).subscribe();
  }
  }

  unFreezPost() : void {
  const post = this.post();
  if(post){
  this.#postService.unfreezePost(post._id , post).subscribe();
  }
  }

  deletePost() : void {
  const postId = this.post()?._id;
  if(postId){
  this.#postService.deletePost(postId).subscribe();
  }
  }

}
