import { Component, inject} from '@angular/core';
import { PostService } from '../../services/post.service';
import { PostCard } from "../../components/post-card/ui/post-card";
import { SharedModule } from '../../../../../../shared/modules/shared.module';


@Component({
  selector: 'app-freezed-posts',
  imports: [PostCard , SharedModule],
  template: `
  @for (post of postService.userFreezedPosts(); track post._id) {

<article class="w-full min-h-60">

@defer (on viewport) {
<app-post-card [post]="post" class="size-full"/>
}@placeholder {
<div class="size-full bg-neutral-300 animate-pulse ngCard"></div>
}

</article>
}@empty {
  <!-- Empty State Section -->
  <div class="flex flex-col items-center justify-center py-12 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" 
        fill="none" viewBox="0 0 24 24" 
        stroke-width="1.5" stroke="currentColor" 
        class="size-12 md:size-16 mb-4 text-gray-400">
        <path stroke-linecap="round" stroke-linejoin="round"
        d="M12 7.5h6m-6 3H9m3 3h3m-3 3H9m9 3H6a2.25 2.25 0 01-2.25-2.25V6.75A2.25 2.25 0 016 4.5h12a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0118 19.5z" />
        </svg>

        <h2 class="text-xl font-semibold ngText">
        {{ 'settings.posts.no_frozen_posts' | translate }}
        </h2>
        <p class="text-gray-500 mt-2">
        {{ 'settings.posts.you_have_not_frozen_any_posts' | translate }}
        </p>
</div>

}

  
`,
})

export class FreezedPosts {
postService = inject(PostService)


constructor(){
this.postService.getFreezedPosts().subscribe()
}

  
}
