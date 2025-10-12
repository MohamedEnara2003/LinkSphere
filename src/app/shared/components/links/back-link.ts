import { Location } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { LanguageService } from '../../../core/services/translations/language.service';
import { SharedModule } from '../../modules/shared.module';


@Component({
selector: 'app-back-link',
imports: [SharedModule],
template: `

<button [routerLink]="path() || []"
title="go Back" type="button" aria-label="Button Back Link" role="doc-backlink" 
(click)="!path() ? goBack() : null" 
class="cursor-pointer ngText hover:text-brand-color transition-all 
duration-200 hover:scale-105">

<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" 
stroke="currentColor" class="size-8"
[ngClass]="languageService.currentLanguage() === 'en' ? '' : ' rotate-180'">
<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
</svg>
</button>
`,
})
export class BackLink {
#location = inject(Location);
languageService = inject(LanguageService);

path = input<string>();



goBack() {
this.#location.back();
}
}
