import { Component } from '@angular/core';
import { ProfileCard } from "../../profile/components/profile-card/profile-card";
import { Posts } from "../../posts/ui/posts/posts";
import { btnOpenModelUpsertPost } from "../../posts/components/btn-open-model-upsert-post/btn-open-model-upsert-post";
import { FriendRequests } from "../../profile/components/friend-requests/friend-requests";
import { RouterModule } from '@angular/router';
import { PostsFilterNavComponent } from "../../posts/components/posts-filter-nav/posts-filter-nav";



@Component({
  selector: 'app-home',
  imports: [ProfileCard, Posts, btnOpenModelUpsertPost, FriendRequests, RouterModule, PostsFilterNavComponent],
  template: `
  
<section class="relative w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 p-2 py-4 ">
  
  <!-- ProfileCard -->
  <aside class="w-full h-[85svh] hidden md:block sticky  top-[12svh]">
  <app-profile-card  /> 
  </aside>

  <!-- Main Content -->
  <main class="w-full min-h-[90svh] flex flex-col  gap-10 md:col-span-2">
    
  <section class="flex flex-col gap-5 ">
  <app-btn-open-model-upsert-post />
  <app-posts-filter-nav />
  </section>

  <app-posts />
  </main>
  
  <!-- Right Sidebar -->
  <aside class="hidden h-[85svh]  ngCard  sticky  top-[12svh] lg:flex flex-col gap-2 p-2">
  <header class="w-full flex p-2">
    <h2 class="ngText text-xl font-semibold flex items-center gap-2">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
    </svg>
    Recent Activity
    </h2>
  </header>
  <app-friend-requests />
  </aside>


</section>
  `,
})
export class Home {

}
