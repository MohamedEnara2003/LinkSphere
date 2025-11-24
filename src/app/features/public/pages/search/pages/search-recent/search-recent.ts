import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from './../../service/search.service';
import { SharedModule } from '../../../../../../shared/modules/shared.module';

@Component({
  selector: 'app-search-recent',
  imports: [SharedModule],
  template: `
    <section class="w-full flex flex-col gap-4">
      @if(searchService.recentSearches().length > 0) {
        <header class="flex items-center justify-between">
          <h2 class="card-title ngText">Recent Searches</h2>
          <button
            type="button"
            (click)="clearAll()"
            class="btn btn-sm btn-ghost hover:dark:bg-dark/50 hover:dark:border-dark/50"
            aria-label="Clear all recent searches"
          >
            Clear all
          </button>
        </header>

        <ul class="flex flex-col gap-2" role="list">
          @for(searchTerm of searchService.recentSearches(); track searchTerm) {
            <li
              class="flex items-center justify-between p-3 ngCard rounded-lg hover:opacity-80 transition-opacity cursor-pointer group"
              role="listitem"
            >
              <button
                type="button"
                (click)="searchAgain(searchTerm)"
                class="flex items-center gap-3 flex-1 text-left"
                aria-label="Search for {{ searchTerm }}"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-5 text-gray-500 dark:text-gray-400"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <span class="ngText flex-1">{{ searchTerm }}</span>
              </button>
   <button
  type="button"
  (click)="deleteSearch(searchTerm)"
  class="opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer 
  p-1.5 rounded-full  bg-card-light dark:bg-card-dark hover:bg-red-200
dark:hover:bg-red-900 text-text-light dark:text-text-dark hover:text-red-600 dark:hover:text-red-400   shadow-sm"
  aria-label="Delete {{ searchTerm }} from recent searches"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="2"
    stroke="currentColor"
    class="size-4"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M6 18 18 6M6 6l12 12"
    />
  </svg>
</button>

            </li>
          }
        </ul>
      } @else {
        <div class="flex flex-col items-center justify-center py-12 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-16 text-brand-color mb-4"
          >
            <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <p class="ngText text-gray-500 dark:text-gray-400">
            No recent searches yet
          </p>
          <p class="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Start searching to see your recent searches here
          </p>
        </div>
      }
    </section>
  `,
})
export class SearchRecent {
  readonly searchService = inject(SearchService);
  readonly #router = inject(Router);

  searchAgain(searchTerm: string): void {
    this.#router.navigate(['/public/search'], {
      queryParams: { result: 'all', keywords: searchTerm },
    });
  }

  deleteSearch(searchTerm: string): void {
    this.searchService.deleteRecent(searchTerm);
  }

  clearAll(): void {
    this.searchService.clearRecent();
  }
}

