import { Component,effect,ElementRef,inject, linkedSignal, viewChild } from '@angular/core';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { SearchService } from '../../service/search.service';
import { BackLink } from "../../../../../../shared/components/links/back-link";

import { Router } from '@angular/router';



@Component({
	selector: 'app-search-form',
	imports: [SharedModule, BackLink],
	template: `

<form role="search" aria-label="Form search" (ngSubmit)="onSubmit()"
class="w-full flex items-end gap-2">

  <app-back-link   class="md:hidden"/>

  <label for="search-input" class="sr-only">Search</label>
    <label class="w-full input dark:bg-dark bg-light rounded-2xl input-sm sm:input-md">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" 
    stroke="currentColor" class="size-5">
    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
      <input #searchInput
        id="search-input"
        type="search"
        autocomplete="off"
        value="{{searchValue()}}"
        (focus)="onFocusSearch()"
        (blur)="onBlurSearch()"
        (input)="onSearch($event.target.value)"
        aria-autocomplete="list"
        aria-controls="search-results"
        aria-describedby="search-help"
        class="grow"
        [placeholder]="searchService.searchType() === 'people' ? 'Search people...' : 'Search posts...'"
      />
    </label>
</form>

	`
})
export class SearchForm {
  readonly searchService = inject(SearchService);

  readonly #router = inject(Router);

  public searchInput = viewChild<ElementRef<HTMLElement>>('searchInput');
  public searchValue = linkedSignal<string>(() => this.searchService.querySearchValue() || '');
  

  constructor(){
  effect(() => {
  if(this.searchService.isFocusSearch()){
  this.searchInput()?.nativeElement.focus();
  }
  })
  }

  onFocusSearch(): void {
  this.searchService.isFocusSearch.set(true);
  }

  onBlurSearch() : void {
  this.searchService.isFocusSearch.set(false);
  } 

  onSearch(value: string): void {
    if((value.length < 150)){
    this.searchValue.set(value);
    }
  }

  onSubmit(): void {
  const search = this.searchValue();
  if(!search) return;

  this.#router.navigate(['/public/search/all'] , {  queryParams : {keywords : search} });
  this.searchInput()?.nativeElement.blur();
  }


}
