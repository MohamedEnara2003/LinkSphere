import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-comments-model-header',
  imports: [RouterLink],
  template: `

    <!-- Header -->
    <header
      class="sticky top-0 z-10 flex items-center justify-between p-3 bg-base-100/90 dark:bg-card-dark/90 backdrop-blur-md border-b border-base-200"
    >
      <h2 id="comments-title" class="text-lg font-semibold ngText flex items-center gap-2">
        <span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
        </svg>
        </span>
        Comments
      </h2>

      <button
        [routerLink]="['/public' ,{ outlets: { 'model': null } }]"
        title="Close comments"
        type="button"
        aria-label="Close comments"
        class="btn btn-ghost btn-sm btn-circle hover:bg-brand-color/10 text-brand-color transition-colors"
      >
        <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-5"
        >
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
    </button>
    </header>

  
  `,

})
export class CommentsModelHeader {

}