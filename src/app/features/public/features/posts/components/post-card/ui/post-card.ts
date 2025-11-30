import { Component, input } from '@angular/core';
import { SharedModule } from '../../../../../../../shared/modules/shared.module';
import { IPost } from '../../../../../../../core/models/posts.model';
import { PostContent } from "../components/post-content/post-content";
import { PostActions } from "../components/post-action/post-actions";
import { PostHeader } from "../components/post-header/post-header";
import { PostAttachments } from "../components/post-attachments/post-attachments";
import { LoadingPost } from "../../loading-post/loading-post";

@Component({
  selector: 'app-post-card',
  imports: [SharedModule, PostContent, PostActions, PostHeader, PostAttachments, LoadingPost],
  template: `
@defer (on viewport) { 
<article 
  class="w-full min-h-70 relative  ngCard p-5 grid grid-cols-1  "
  [attr.aria-labelledby]="'post-title-' + post()._id || ''"
  [attr.aria-describedby]="'post-desc-' + post()._id || ''">

  <!-- Post Header -->
  <app-post-header
  [post]="post()"
  />

  <main class="w-full flex flex-col  gap-2  "
    [id]="'post-desc-' +  (post()._id || '')"
    [attr.aria-labelledby]="'post-title-' +  (post()._id || '')" 
    [attr.aria-describedby]="'post-desc-' +  (post()._id || '')" 
    role="main"
    >

   <!-- Post  Attachments -->
    <app-post-attachments 
    [attachments]=" post().attachments || []"
    />

  <!-- Post  Content -->
  <app-post-content [content]="post().content || ''" />
  </main>
  
  <!-- Post Actions (Like/Unlike - BtnComments)-->
  <footer class="w-full flex flex-col justify-start gap-1" aria-label="Post interactions">
  @if(!post().isFreezed){
  <app-post-actions 
  [post]="post()"
  />
  }
  </footer>
  
</article>
}@placeholder {
<app-loading-post />
}

  `,
})
export class PostCard {
  post = input.required<IPost>();
}


