import { Component, input } from '@angular/core';
import { SharedModule } from '../../../../../../../shared/modules/shared.module';
import { IPost } from '../../../../../../../core/models/posts.model';
import { PostHeader } from "../components/post-header/post-header";
import { PostContent } from "../components/post-content/post-content";
import { PostActions } from "../components/post-action/post-actions";

@Component({
  selector: 'app-post-card',
  imports: [SharedModule, PostHeader, PostContent, PostActions],
  template: `
<article 
  class="relative w-full min-h-60 ngCard p-4 grid grid-cols-1  gap-4 "
  [attr.aria-labelledby]="'post-title-' + post().id"
  [attr.aria-describedby]="'post-desc-' + post().id">

  <!-- Post Header -->
  <app-post-header
  [postId]="post().id" 
  [createdBy]="post().createdBy"
  [createdAt]="post().createdAt"
  />

  <!-- Post Main Content -->
  <app-post-content
    [postId]="post().id"
    [content]="post().content || ''"
    [attachments]=" post().attachments || []"
  />
  


  <!-- Post Actions (Like/Unlike - BtnComments)-->
  <footer class="w-full flex flex-col justify-start gap-1" aria-label="Post interactions">
  <app-post-actions 
  [post]="post()"
  />
  </footer>
</article>

  `,
})
export class PostCard {
  post = input.required<IPost>();


}


