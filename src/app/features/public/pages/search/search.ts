import { Component, effect, inject} from '@angular/core';
import { SearchService } from './service/search.service';
import { SharedModule } from './../../../../shared/modules/shared.module';
import { Router, RouterOutlet } from '@angular/router';
import { SearchTypesLinks } from "./components/search-types-links/search-types-links";




@Component({
selector: 'app-search',
imports: [
    SearchTypesLinks,
    SharedModule,
    RouterOutlet
],
template : `
<section 
aria-label="Search Page" 
role="region" 
class="w-full min-h-[90svh] ">

<main 
class="w-full min-h-[90svh]  sm:w-xl md:w-3xl xl:w-4xl 2xl:w-5xl mx-auto 
flex flex-col gap-5 ngCard rounded-none "
role="main"
aria-labelledby="search-page-title"
>



@if(searchService.querySearchValue() && (searchService.users().length || searchService.posts().length )){
<section class="sticky top-[8svh] md:top-[10svh]  flex flex-col gap-4 p-2 ngCard z-10 rounded-none">
<app-search-types-links  class=" animate-opacity"/>  
</section>
}



<section class="w-full h-full pb-5 p-1">
<router-outlet />
</section>

</main>

</section>
`
})
export class SearchCompoent {
readonly searchService = inject(SearchService);
readonly router = inject(Router);



constructor(){
effect(() => this.#clearSearchData())
}

#clearSearchData() : void {
const querySearchValue = this.searchService.querySearchValue();
if(!querySearchValue){
this.searchService.clearData();
}
}

ngOnDestroy(): void {
this.searchService.clearData();
}

}
