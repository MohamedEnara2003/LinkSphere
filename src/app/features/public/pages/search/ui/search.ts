import { Component, inject} from '@angular/core';
import { SearchService } from '../service/search.service';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { Router } from '@angular/router';
import { SearchForm } from "../components/search-form/search-form";
import { SearchResultsLinks } from "../components/search-results-links/search-results-links";
import { SearchAll } from "../pages/search-all/ui/search-all";
import { SearchPosts } from "../pages/search-posts/ui/search-posts";
import { SearchPeople } from "../pages/search-people/ui/search-people";
import { SearchRecent } from "../pages/search-recent/search-recent";




@Component({
selector: 'app-search',
imports: [
    SharedModule,
    SearchForm,
    SearchResultsLinks,
    SearchAll,
    SearchPosts,
    SearchPeople,
    SearchRecent
],
template : `
<section 
aria-label="Search Page" 
role="region" 
class="w-full min-h-svh lg:px-30 xl:px-50  ">

<main 
class="w-full min-h-svh ngCard rounded-none   mx-auto 
flex flex-col gap-5 "
role="main"
aria-labelledby="search-page-title"
>



<section class="sticky top-0  flex flex-col gap-4 p-2 ngCard z-10 rounded-none ">
    
<app-search-form
class="duration-300 transition-all relative animate-opacity lg:animate-none"
/>
@if(searchService.searchValue()){
<app-search-results-links class=" animate-opacity"/>  
}

</section>


<section class="w-full h-full p-4">
@switch (searchService.searchResult()) {
    @case ('all') {
    <app-search-all /> 
    }
    @case ('people') {
    <app-search-people/> 
    }
    @case ('posts') {
    <app-search-posts /> 
    }
    @default {
    <app-search-recent /> 
    }
}

</section>


</main>

</section>
`
})
export class SearchCompoent {
readonly searchService = inject(SearchService);
readonly router = inject(Router);



#clearSearchData() : void {
const querySearchValue = this.searchService.searchValue();
if(!querySearchValue){
this.searchService.clearData();
}
}

ngOnDestroy(): void {
this.searchService.clearData();
}

}
