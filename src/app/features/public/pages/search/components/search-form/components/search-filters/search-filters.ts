import { Component, inject, model, OnDestroy, OnInit } from '@angular/core';
import { SearchService } from '../../../../service/search.service';
import { DomService } from '../../../../../../../../core/services/dom.service';

@Component({
	selector: 'app-search-filters',
	imports: [ ],
	template: `
    
    <section aria-label="Search filters" 
    class="size-full fixed inset-0 z-50 flex justify-center items-end lg:px-30 xl:px-50
    ">

    <article class="relative w-full h-[80%] ngCard rounded-none animate-up z-50 p-4 
    flex flex-col gap-5">

    

    <header class="w-full flex justify-center border-b border-card-light/50 ">
    <h2 class="ngText capitalize py-2 card-title">
    Filter {{
    (searchService.searchResult() === 'all' ? 'Results' : searchService.searchResult())
    }}
    </h2>
    </header>
    
    <main class="size-full flex ">

    @switch (searchService.searchResult()) {

    @case ('all') {
    No Filter now
    }
    @case ('people') {
    No Filter now
    }
    @case ('posts') {
    <ul class="w-full flex flex-col gap-2 ">
        
    <li class="w-full border-b border-card-light/50 flex flex-col gap-5 py-4">
    <h3 class="card-title ngText ">Author post</h3>

    <button type="button" class="flex items-center gap-2 ngBtnIcon ">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
    <path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
    </svg>
    Add an author post
    </button>
    </li>

    </ul>
    }

    }
    
    </main>

    <footer class="w-full flex justify-end items-center gap-5">
    <button  (click)="isFilter.set(false)"
    type="button" class="ngText hover:text-brand-color cursor-pointer duration-300 transition-colors ">
    Reset
    </button>
    <button  (click)="isFilter.set(false)"
    type="button" class="ngBtn rounded-2xl">
    Show Results
    </button>
    </footer>

    </article>

    <div (click)="isFilter.set(false)" class="size-full fixed inset-0 bg-dark/50 z-40"></div>
    </section>
`
})
export class SearchFilters implements OnInit, OnDestroy{
readonly searchService = inject(SearchService);
readonly #domService = inject(DomService);
isFilter = model<boolean>(false);

ngOnInit(): void {
this.#domService.setBodyOverflow('hidden');
}

 ngOnDestroy(): void {
 this.#domService.setBodyOverflow('auto');
 }
}
