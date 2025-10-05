import { Component, input,  } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileEditTypes } from '../../../../model/profiles.model';




@Component({
selector: 'app-title-edit',
imports: [RouterModule],
template: `

<nav class="w-full flex justify-between items-center border-b border-brand-color/10 pb-2">

<h2>{{ title() }}</h2>

<button 
[routerLink]="[]" 
[queryParams]="{edit: query() }" queryParamsHandling="merge"
type="button" 
class="ngBtn btn-sm" >
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
<path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
<path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
</svg>

Edit
</button>

</nav>

`,
})
export class TileEdit {
title = input.required<string>();
query = input<ProfileEditTypes>();
}
