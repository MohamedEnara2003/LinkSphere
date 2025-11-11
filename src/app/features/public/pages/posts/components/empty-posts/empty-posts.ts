import { Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserProfileService } from '../../../profile/services/user-profile.service';

@Component({
selector: 'app-empty-posts',
imports: [RouterModule],
template: `
  <section
      class="w-full h-100 flex flex-col items-center justify-center gap-4  ngCard text-center animate-opacity"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="size-16 text-info"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    <h2 class="text-lg font-semibold ngText">
    No posts yet
    </h2>

    <p class="text-sm text-gray-500 dark:text-gray-400">
    Be the first to share something with your friends!
    </p>
    
    @if(isCreatePost()){
    <button class="ngBtn mt-2"
    [routerLink]="['/public' ,{ outlets: { 'model': ['upsert-post'] } }]" >
    Create Post
    </button>
    }


    </section>
`,

})
export class EmptyPosts{
    userService = inject(UserProfileService);
    isCreatePost = input<boolean>(true);
}