  import { Component} from '@angular/core';
  import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { FreezedPosts } from "../../../posts/ui/freezed-posts/freezed-posts";

  @Component({
  selector: 'app-archived-posts',
  imports: [SharedModule, FreezedPosts],
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
  <app-freezed-posts />
  </main>

  </article>
  `,
  })
  export class ArchivedPosts  {

  }
