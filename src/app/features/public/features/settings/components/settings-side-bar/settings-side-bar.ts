import { Component, inject, signal } from '@angular/core';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { SettingsServices } from '../../service/settings.service';
import { TranslateModule } from '@ngx-translate/core';
import { IconRenderer } from "../../../../components/navigations/Icon-renderer/Icon-renderer";



@Component({
selector: 'app-settings-side-bar',
imports: [SharedModule, TranslateModule, IconRenderer],
template: `

<header class="flex  p-4 md:hidden">
    <button
        (click)="isOpenSide.set(true)"
        type="button"
        class="ngText ngBtnIcon"
        aria-controls="settings-sidebar"
        [attr.aria-expanded]="isOpenSide()"
        aria-label="Open settings sidebar"
    >
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" 
stroke="currentColor" class="size-8">
<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
</svg>
</button>
</header>

<aside id="settings-sidebar" class="w-64  ngCard rounded-none h-svh md:sticky top-0  z-25  "
    [ngClass]="isOpenSide() ? 'fixed md:relative  left-0  animate-sideLeft md:animate-none' : 'hidden md:inline-block'"
    role="complementary"
    aria-label="Settings sidebar"
>

    <nav class="size-full  p-4 flex flex-col" role="navigation" aria-label="Settings navigation">

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


        <ul class="w-full h-full flex flex-col gap-2 overflow-y-auto" style="scrollbar-width: none;" role="list" aria-label="Settings links">
            @for (link of settingsService.sidebarLinks(); track $index) {

                <li role="listitem" (click)="isOpenSide.set(false)">
                    <a
                        [href]="link.routerLink"
                        [routerLink]="link.routerLink"
                        routerLinkActive="bg-brand-color text-dark"
                        class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-brand-color hover:text-dark duration-300 transition-colors"
                        role="link"
                        aria-label="{{ link.title | translate }}"
                    >

                        <app-icon-renderer
                            [svgString]="link.icon"
                            styleClass="size-6"
                            fill="outline"
                        />

                        {{link.title | translate}}
                    </a>
                </li>
            }
        </ul>

    </nav>
</aside>

@if(isOpenSide()){
    <div
        (click)="isOpenSide.set(false)"
        class="w-full h-svh fixed left-0 top-0  bg-dark/50 z-20 md:hidden"
        role="button"
        aria-label="Close settings sidebar"
        tabindex="0"
    ></div>
}
`,
providers : [SettingsServices]
})
export class SettingsSideBarComponent {
settingsService = inject(SettingsServices);
isOpenSide =  signal<boolean>(false);



}
