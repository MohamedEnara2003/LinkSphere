import { Component } from '@angular/core';

@Component({
selector: 'app-loading-post',
imports: [],
template: `
<article
  class="w-full h-full flex flex-col gap-4 p-4 bg-card"
  role="status"
  aria-busy="true"
  aria-label="Loading post content"
>
  <header class="flex items-center gap-4">
    <!-- صورة البروفايل -->
    <figure class="ng-skeleton size-12 shrink-0 rounded-full" aria-hidden="true"></figure>

    <!-- معلومات المستخدم -->
    <section class="flex flex-col gap-2">
      <span class="ng-skeleton h-4 w-30" aria-hidden="true"></span>
      <span class="ng-skeleton h-4 w-10" aria-hidden="true"></span>
    </section>
  </header>

  <!-- محتوى المنشور -->
  <main class="ng-skeleton h-full w-full" aria-hidden="true"></main>

  <!-- نص توضيحي للشاشة فقط -->
  <p class="sr-only">Loading post, please wait...</p>
</article>


`,

})
export class LoadingPost{}