import { Component, signal, } from '@angular/core';
import { RouterModule } from '@angular/router';
import { searchType } from '../../models/search.types';


@Component({
selector: 'app-search-types-links',
imports: [RouterModule],
template : `
<nav class="w-full  p-1 rounded-none ">
<ul class="w-full flex items-center gap-2">

@for (item of searchTypesLinks(); track item.id) {
<li> 
<a 
[routerLink]="['/public/search' , item.path]" 
queryParamsHandling="merge"
routerLinkActive="text-brand-color bg-brand-color/20 "
class="ngText capitalize flex items-center gap-1 hover:text-brand-color rounded-2xl px-3 py-0.5
duration-200 transition-colors hover:bg-brand-color/20">
{{item.name}}
</a>
</li>
}


</ul>
</nav>

`
})
export class SearchTypesLinks {

    searchTypesLinks = signal<Array<{id : number , name : string , path : searchType}>>([
    {id : 1 , name :'All',   path : 'all'},
    {id : 2 , name :'People',path : 'people'},
    {id : 3 , name :'Posts' ,path : 'posts'},
    ]);

}
