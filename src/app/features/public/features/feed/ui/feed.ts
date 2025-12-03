import { Component, inject } from '@angular/core';
import { ProfileCard } from "../../profile/components/profile-card/profile-card";
import { btnOpenModelUpsertPost } from "../../posts/components/btn-open-model-upsert-post/btn-open-model-upsert-post";
import { FriendRequests } from "../../profile/components/friend-requests/friend-requests";
import { PostsFilterNavComponent } from "../../posts/components/posts-filter-nav/posts-filter-nav";
import { PostsFeed } from "../../posts/ui/posts-feed/posts-feed";
import { MetaService } from '../../../../../core/services/meta/meta.service';
import { FriendsList } from "../../profile/components/friends-list/friends-list";



@Component({
  selector: 'app-feed',
  imports: [
  ProfileCard, 
  btnOpenModelUpsertPost, 
  FriendRequests, 
  PostsFilterNavComponent, 
  PostsFeed, 
  FriendsList],
  template: `

<section aria-label="Home feed" role="region"
class="w-full min-h-[90svh] relative  grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 px-2   ">

  <!-- Profile Aside -->
  <aside class="w-full h-[90svh] hidden md:block sticky  top-[10svh]" role="complementary" aria-label="User profile card">
    <app-profile-card  /> 
  </aside>

  <!-- Main Content -->
  <main role="main" aria-labelledby="feed-heading" 
  class="w-full min-h-full  flex flex-col  gap-4 md:col-span-2 overflow-hidden">
    <header id="feed-heading" class="flex flex-col gap-4">
      <h1 class="sr-only">Feed</h1>
      <app-friends-list aria-label="Friends list"/>
      <app-btn-open-model-upsert-post aria-label="Create a new post"/>
      <app-posts-filter-nav aria-label="Filter posts"/>
    </header>
    <section aria-label="Posts" class="w-full" role="region">
      <app-posts-feed class="size-full"/>
    </section>
  </main>
  
  <!-- Friend-Requests Aside -->
  <aside class="w-full h-[90svh] hidden md:block sticky  top-[10svh]  ngCard" role="complementary" aria-label="Friend requests">
    <app-friend-requests class="w-full h-full"/>
  </aside>

</section>
  `,
})
export class FeedComponent {
readonly #metaService = inject(MetaService);

ngOnInit() {
  this.#metaService.setMeta({
    title: `Your Social Feed | Link Sphere Social`,
    description: `Discover the latest posts from friends and the community, share updates, and stay connected on your personalized home feed in Link Sphere Social.`,
    image: "",
    url: "feed",
  });
}



}
