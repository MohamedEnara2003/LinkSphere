import { Component } from '@angular/core';

@Component({
selector: 'app-loading-post',
imports: [],
template: `
<article
  class="w-full h-70 flex flex-col gap-4 p-2 "
  role="status"
  aria-busy="true"
  aria-label="Loading post content"
>
  <header class="flex items-center gap-4">

    <figure class="ng-skeleton size-12 shrink-0 rounded-full" aria-hidden="true"></figure>
    <section class="flex flex-col gap-2">
      <span class="ng-skeleton h-4 w-30" aria-hidden="true"></span>
      <span class="ng-skeleton h-4 w-10" aria-hidden="true"></span>
    </section>
  </header>

  
  <main class="ng-skeleton h-full w-full" aria-hidden="true"></main>

  <p class="sr-only">Loading post, please wait...</p>
</article>


`,

})
export class LoadingPost{}