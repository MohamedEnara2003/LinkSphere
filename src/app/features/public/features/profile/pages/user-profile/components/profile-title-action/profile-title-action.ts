import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileListTypes } from '../../../../model/profiles.model';


@Component({
selector: 'app-profile-title-action ',
imports: [RouterModule],
template: `
<nav class="w-full flex justify-between items-center ">
<h3 class="ngText text=lg  md:text-2xl ">{{title()}}</h3>
<a href="/profile" [routerLink]="[]" [queryParams]="{list : query()}" 
class="text-brand-color link link-hover capitalize">
See all {{title()}}
</a>
</nav>
`,
})
export class profileTitleAction  {
title = input.required();
query = input.required<ProfileListTypes>();
}
