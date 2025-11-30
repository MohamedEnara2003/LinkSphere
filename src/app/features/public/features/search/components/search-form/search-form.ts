import { Component,ElementRef,inject, linkedSignal, signal, viewChild } from '@angular/core';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { SearchService } from '../../service/search.service';
import { Router } from '@angular/router';
import { BackLink } from "../../../../../../shared/components/links/back-link";
import { SearchFilters } from "./components/search-filters/search-filters";


@Component({
	selector: 'app-search-form',
	imports: [SharedModule, BackLink, SearchFilters],
	template: `

<form role="search" aria-label="Form search" (ngSubmit)="onSubmit()"
class="w-full flex items-center gap-2">
<app-back-link [path]="searchService.searchValue() ? '/public/search' : '/'" />

  <label for="search-input" class="sr-only">Search</label>

      <label class="w-full input input-neutral bg-dark/50 border-transparent">

      <button type="submit" class="label cursor-pointer">    
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" 
          stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" 
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </button>

      <input #searchInput
        type="search"
        id="search-input"
        autocomplete="off"
        value="{{searchValue()}}"
        (input)="onSearch($event.target.value)"
        [placeholder]="'Search ' + (searchService.searchResult() || 'people,post' )+ '...'"
        class="placeholder:text-gray-400">
    </label>
  
@if(searchService.searchResult()){
  <button type="button" (click)="isFilter.set(!isFilter())"> 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 ngText ngBtnIcon">
  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
  </svg>
  </button>

  @if(isFilter()){
  <app-search-filters 
  [isFilter]="isFilter()"
  (isFilterChange)="isFilter.set($event)"
  />
  }
}


</form>

	`
})
export class SearchForm {

  readonly searchService = inject(SearchService);
  readonly #router = inject(Router);

  public searchInput = viewChild<ElementRef<HTMLElement>>('searchInput');
  public searchValue = linkedSignal<string>(() => this.searchService.searchValue() || '');
  
  isFilter = signal<boolean>(false);

  onSearch(value: string): void {
    if((value.length < 150)){
    this.searchValue.set(value);
    }
  }

  onSubmit(): void {
  const search = this.searchValue();
  if(!search) return;

  // Add to recent searches
  this.searchService.addRecent(search);

  this.#router.navigate(['/public/search'] , {queryParams : {
    result : 'all' ,
    keywords : search
  } });
  this.searchInput()?.nativeElement.blur();
  }


}
