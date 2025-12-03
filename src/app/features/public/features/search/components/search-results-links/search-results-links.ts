import { Component, signal, } from '@angular/core';
import { RouterModule } from '@angular/router';
import { searchResult } from '../../models/search.types';


@Component({
selector: 'app-search-results-links',
imports: [RouterModule ],
template : `

<nav class="w-full gap-2 p-1 rounded-none" role="navigation" aria-label="Search filters">

    <ul class="w-full flex items-center gap-2" role="list" aria-label="Search result types">
        @for (item of searchTypesLinks(); track item.id) {
            <li role="listitem">
                <a
                    [routerLink]="['/public/search']"
                    [queryParams]="{result : item.query}"
                    queryParamsHandling="merge"
                    routerLinkActive="text-brand-color bg-brand-color/20 "
                    class="ngText capitalize flex items-center gap-1 hover:text-brand-color rounded-2xl px-3 py-0.5 duration-200 transition-colors hover:bg-brand-color/20"
                    role="link"
                    aria-label="Show {{ item.name }} results"
                >
                    {{item.name}}
                </a>
            </li>
        }

    </ul>
</nav>

`
})
export class SearchResultsLinks {

    searchTypesLinks = signal<Array<{id : number , name : string , query : searchResult}>>([
    {id : 1 , name :'All',   query : 'all'},
    {id : 2 , name :'People',query : 'people'},
    {id : 3 , name :'Posts' ,query : 'posts'},
    ]);

}
