import { Component, input } from '@angular/core';
import { SharedModule } from '../../../../../../../shared/modules/shared.module';
import { IPost } from '../../../../../../../core/models/posts.model';
import { PostContent } from "../components/post-content/post-content";
import { PostActions } from "../components/post-action/post-actions";
import { PostHeader } from "../components/post-header/post-header";

@Component({
  selector: 'app-post-card',
  imports: [SharedModule, PostContent, PostActions, PostHeader],
  template: `
<section 
  class="size-full relative  ngCard p-4 grid grid-cols-1  gap-4 "
  [attr.aria-labelledby]="'post-title-' + post()?._id || ''"
  [attr.aria-describedby]="'post-desc-' + post()?._id || ''">

  <!-- Post Header -->

  <app-post-header
  [post]="post()"
  />

  <!-- Post Main Content -->
  <app-post-content
    [postId]="post()?._id || ''"
    [content]="post()?.content || ''"
    [attachments]=" post()?.attachments || []"
  />
  
  <!-- Post Actions (Like/Unlike - BtnComments)-->
  <footer class="w-full flex flex-col justify-start gap-1" aria-label="Post interactions">
  <app-post-actions 
  [post]="post()"
  />
  </footer>
  
</section>

  `,
})
export class PostCard {
  post = input<IPost>();


}


