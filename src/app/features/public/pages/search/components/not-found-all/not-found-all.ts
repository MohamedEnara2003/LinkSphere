import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found-all',
  imports: [],
  template: `
    <section
      role="alert"
      aria-labelledby="no-users-title"
      aria-describedby="no-users-description"
      class="size-full flex flex-col items-center justify-center py-12 text-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-12 md:size-16 mb-4 text-brand-color"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round"
          d="m21 21-4.35-4.35m1.1-5.4a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M10 8h.01M8 12h.01M12 12h.01M10 16h.01" />
      </svg>

      <h2 id="no-users-title" class="text-xl font-semibold ngText">
      No Content Found
      </h2>

      <p id="no-users-description" class="text-sm text-gray-500 dark:text-gray-400 mt-2">
      Try searching with a different name or keyword.
      </p>
    </section>
  `
})
export class NotFoundAll {
  
}
