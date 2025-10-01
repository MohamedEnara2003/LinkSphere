import { Component } from '@angular/core';
import { ProfileCard } from "../../profile/components/profile-card/profile-card";
import { Posts } from "../../posts/ui/posts/posts";
import { btnOpenModelUpsertPost } from "../../posts/components/btn-open-model-upsert-post/btn-open-model-upsert-post";



@Component({
  selector: 'app-home',
  imports: [ProfileCard, Posts, btnOpenModelUpsertPost],
  template: `
  
<section class="relative w-full grid grid-cols-1 md:grid-cols-4 gap-5 p-1">
  
  <!-- ProfileCard -->
  <app-profile-card 
    class="w-full h-[85svh] hidden md:block sticky  top-[15svh]" />
  
  <!-- Main Content -->
  <main class="w-full grid grid-cols-1 gap-10 md:col-span-2 mt-5">
    <app-btn-open-model-upsert-post />
    <app-posts />
  </main>
  
  <!-- Right Sidebar -->
  <div class="hidden h-[85svh] md:block ngCard rounded sticky  top-[15svh]"></div>
</section>



  `,
})
export class Home {

}
