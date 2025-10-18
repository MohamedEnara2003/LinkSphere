import { Component, inject} from '@angular/core';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { PostService } from '../../../posts/services/post.service';
import { PostCard } from "../../../posts/components/post-card/ui/post-card";

@Component({
selector: 'app-freeze-posts',
imports: [SharedModule, PostCard],
template: `

<article class="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8" role="region" 
aria-labelledby="frezze-posts-settings-heading">

    <header id="frezze-posts-settings-heading"
    class="mb-6 border-b border-brand-color/10 pb-3">
    <h1  class="text-2xl md:text-3xl font-bold">
    {{ 'settings.posts.title' | translate }}
    </h1>
    <p class="text-sm text-gray-400">{{ 'settings.posts.subtitle' | translate }}</p>
    </header>
    
<main class="size-full grid grid-cols-1 gap-5">
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
        <!-- HeroIcon: Newspaper -->
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

</main>

</article>
`,
})
export class FreezePosts {
postService = inject(PostService)


constructor(){
this.postService.getFreezedPosts().subscribe()
}

}
