import { Component, input, signal } from '@angular/core';
import { ProfileListTypes } from '../../model/profiles.model';

import { SharedModule } from '../../../../../../shared/modules/shared.module';

@Component({
selector: 'app-profile-links',
imports: [SharedModule ],
template: `

    <ul class="w-full flex items-center gap-2">
    @for (item of profileLinks(); track item.id) {
    <li>
    <a 
    href="/profile" 
    [routerLink]="[]" 
    [queryParams]="{list : item.name}"
    class="ngText capitalize flex items-center gap-1 hover:text-brand-color 
    duration-200 transition-colors"
    [ngClass]="listType() === item.name ||  (!listType() && item.name === 'Posts')
    ? 'text-brand-color' : ''">
    {{item.name}}

    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
    <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />
    </svg>
    </a>
    </li>
    }
    </ul>

`,
})
export class profileLinks {
    profileLinks = signal<Array<{id : number , name : ProfileListTypes}>>([
    {id : 1 , name :'Posts' , },
    {id : 2 , name :'About' , },
    {id : 3 , name :'Photos' , },
    {id : 4 , name :'Friends',  },
    ]);

    listType = input<ProfileListTypes>();

}
