import { Component } from '@angular/core';
import { ProfileCard } from "../../profile/components/profile-card/profile-card";

import { btnOpenModelUpsertPost } from "../../posts/components/btn-open-model-upsert-post/btn-open-model-upsert-post";
import { FriendRequests } from "../../profile/components/friend-requests/friend-requests";
import { RouterModule } from '@angular/router';
import { PostsFilterNavComponent } from "../../posts/components/posts-filter-nav/posts-filter-nav";
import { PostsFeed } from "../../posts/ui/posts-feed/posts-feed";



@Component({
  selector: 'app-home',
  imports: [ProfileCard, btnOpenModelUpsertPost, FriendRequests, RouterModule, PostsFilterNavComponent, PostsFeed],
  template: `
  
<section class="relative w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 p-2 py-4 ">
  
  <!-- ProfileCard -->
  <aside class="w-full h-[85svh] hidden md:block sticky  top-[12svh]">
  <app-profile-card  /> 
  </aside>

  <!-- Main Content -->
  <main class="w-full min-h-[85svh] flex flex-col  gap-4 md:col-span-2">
    
  <section class="flex flex-col gap-5 ">
  <app-btn-open-model-upsert-post />
  <app-posts-filter-nav />
  </section>

  <app-posts-feed class="size-full"/>
  </main>
  
  <!-- Right Sidebar -->
  <aside class="hidden h-[85svh]  ngCard  sticky  top-[12svh] lg:inline-block p-2">
  <app-friend-requests class="w-full h-full"/>
  </aside>


</section>
  `,
})
export class Home {

}
