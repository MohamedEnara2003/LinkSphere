import { Component, inject, signal } from '@angular/core';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { SettingsServices } from '../../service/settings.service';
import { TranslateModule } from '@ngx-translate/core';


@Component({
selector: 'app-settings-side-bar',
imports: [SharedModule, TranslateModule],
template: `

<header class="flex  p-4 md:hidden">
<button  (click)="isOpenSide.set(true)"
type="button" class="ngText ngBtnIcon">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" 
stroke="currentColor" class="size-8">
<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
</svg>
</button>
</header>

<aside class="w-64  ngCard rounded-none h-svh md:sticky top-0  "
[ngClass]="isOpenSide() ? 
'fixed md:relative  left-0 z-25 animate-sideLeft md:animate-none' : 
'hidden md:inline-block'">
<nav class="menu p-4 space-y-2">

<header class="space-y-2">
<button  (click)="isOpenSide.set(false)"
type="button" class="ngText ngBtnIcon md:hidden">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" 
stroke="currentColor" class="size-8">
<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
</button>
<h2 class="menu-title">{{ 'settings.title' | translate }}</h2>
</header>


    <ul class="space-y-2">
    @for (link of settingsService.links(); track link.id) {
            <li (click)="isOpenSide.set(false)">
            <a  
                [href]="link.route"
                [routerLink]="link.route"
                routerLinkActive="bg-brand-color"
                class="flex items-center gap-2 rounded-lg px-3 py-2 
                hover:bg-brand-color duration-300 transition-colors"
            >
                <span>{{ link.label | translate }}</span>
            </a>
            </li>
        
        }
    </ul>
    </nav>
</aside>

@if(isOpenSide()){
<div (click)="isOpenSide.set(false)"
class="w-full h-svh absolute left-0 top-0  bg-dark/50 z-20 md:hidden" 
aria-hidden="true">
</div>
}
`,
providers : [SettingsServices]
})
export class SettingsSideBarComponent {
isOpenSide =  signal<boolean>(false);
settingsService = inject(SettingsServices);
}
