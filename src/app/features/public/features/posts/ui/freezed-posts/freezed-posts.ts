import { Component, computed, inject} from '@angular/core';

import { PostCard } from "../../components/post-card/ui/post-card";
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { FreezePostService } from '../../service/api/freeze-posts.service';
import { PostsStateService } from '../../service/state/posts-state.service';


@Component({
  selector: 'app-freezed-posts',
  imports: [PostCard, SharedModule],
  template: `
<ul class="w-full grid grid-cols-1 gap-5">
@for (post of freezePosts(); track post._id) {
<li >
<app-post-card [post]="post" class="size-full"/>
</li>
}@empty {
  <li class="flex flex-col items-center justify-center py-12 text-center">
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
</li>

}
</ul>

`,
providers : [
FreezePostService
]
})

export class FreezedPosts {
#freezedPosts = inject(FreezePostService);
#postsState = inject(PostsStateService);

freezePosts = computed(() => this.#postsState.userFreezedPosts())

ngOnInit(): void {
this.#freezedPosts.getFreezedPosts().subscribe();
}

  
}
