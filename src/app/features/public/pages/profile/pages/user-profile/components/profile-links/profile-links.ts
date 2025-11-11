import { Component, input, signal } from '@angular/core';
import { ProfileListTypes } from '../../../../model/profiles.model';

import { SharedModule } from '../../../../../../../../shared/modules/shared.module';

@Component({
selector: 'app-profile-links',
imports: [SharedModule],
template: `
<nav class="w-full">

    <ul class="w-full flex items-center gap-2">
    @for (item of profileLinks(); track item.id) {
    <li>
    <a 
    [title]="item.translationKey | translate"
    href="/profile" 
    [routerLink]="[]" 
    [queryParams]="{list : item.name}"
    class="ngText capitalize flex items-center gap-1 hover:text-brand-color rounded-2xl px-3 p-1
    duration-200 transition-colors hover:bg-brand-color/20"
    [ngClass]="listType() === item.name ||  (!listType() && item.name === 'Posts')
    ? 'text-brand-color bg-brand-color/20 px-2 ' : ''">
    {{item.translationKey | translate}}

    </a>
    </li>
    }
    </ul>
</nav>
`,
})
export class profileLinks {
    profileLinks = signal<Array<{id : number , name : ProfileListTypes, translationKey: string}>>([
    {id : 1 , name :'Posts' , translationKey: 'profile.links.posts' },
    {id : 2 , name :'About' , translationKey: 'profile.links.about' },
    {id : 3 , name :'Photos' , translationKey: 'profile.links.photos' },
    {id : 4 , name :'Friends', translationKey: 'profile.links.friends' },
    ]);

    listType = input<ProfileListTypes>();

}
