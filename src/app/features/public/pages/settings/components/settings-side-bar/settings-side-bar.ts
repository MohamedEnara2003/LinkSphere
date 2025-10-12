import { Component, inject, signal } from '@angular/core';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { SettingsServices } from '../../service/settings.service';
import { TranslateModule } from '@ngx-translate/core';
import { UserProfileService } from '../../../profile/services/user-profile.service';


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

<aside class="w-64  ngCard rounded-none h-svh md:sticky top-0  z-25 bg-card-light dark:bg-card-dark "
[ngClass]="isOpenSide() ? 
'fixed md:relative  left-0  animate-sideLeft md:animate-none' : 
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
        <li (click)="isOpenSide.set(false)">
        <a  
        [href]="['/public/profile/user', userService.user()?._id || '' , 'update']"
        [routerLink]="['/public/profile/user', userService.user()?._id || '' , 'update']"
        routerLinkActive="bg-brand-color text-dark"
        class="flex items-center gap-2 rounded-lg px-3 py-2 
        hover:bg-brand-color hover:text-dark duration-300 transition-colors">

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
        </svg>
        Profile details
        </a>
        </li>

        <li (click)="isOpenSide.set(false)">
        <a  
        href="/public/settings/account"
        routerLink="/public/settings/account"
        routerLinkActive="bg-brand-color text-dark"
        class="flex items-center gap-2 rounded-lg px-3 py-2 
        hover:bg-brand-color hover:text-dark duration-300 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        Account
        </a> 
        </li>

        <li (click)="isOpenSide.set(false)">
        <a  
        href="/public/settings/update-email"
        routerLink="/public/settings/update-email"
        routerLinkActive="bg-brand-color text-dark"
        class="flex items-center gap-2 rounded-lg px-3 py-2 
        hover:bg-brand-color hover:text-dark duration-300 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>

        {{'settings.update_email.title' | translate}}
        </a> 
        </li>

        <li (click)="isOpenSide.set(false)">
        <a  
        href="/public/settings/change-password"
        routerLink="/public/settings/change-password"
        routerLinkActive="bg-brand-color text-dark"
        class="flex items-center gap-2 rounded-lg px-3 py-2 
        hover:bg-brand-color hover:text-dark duration-300 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
        </svg>
        {{'settings.change_password.title' | translate}}
        </a> 
        </li>

        <li (click)="isOpenSide.set(false)">
        <a  
        href="/public/settings/language"
        routerLink="/public/settings/language"
        routerLinkActive="bg-brand-color text-dark"
        class="flex items-center gap-2 rounded-lg px-3 py-2 
        hover:bg-brand-color hover:text-dark duration-300 transition-colors">

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>

        {{'settings.language.languages' | translate}}
        </a>
        </li>

        <li (click)="isOpenSide.set(false)">
        <a  
        href="/public/settings/dark-mode"
        routerLink="/public/settings/dark-mode"
        routerLinkActive="bg-brand-color text-dark"
        class="flex items-center gap-2 rounded-lg px-3 py-2 
        hover:bg-brand-color hover:text-dark duration-300 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
        {{'settings.darkMode.dark_mode' | translate}}
        </a>
        </li>

        <li (click)="isOpenSide.set(false)">
        <a  
        href="/public/settings/sent-friend-requests"
        routerLink="/public/settings/sent-friend-requests"
        routerLinkActive="bg-brand-color text-dark"
        class="flex items-center gap-2 rounded-lg px-3 py-2 
        hover:bg-brand-color hover:text-dark duration-300 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
        {{'settings.friend.title' | translate}}
        </a>
        </li>

        <li (click)="isOpenSide.set(false)">
        <a  
        href="/public/settings/log-out"
        routerLink="/public/settings/log-out"
        routerLinkActive="bg-brand-color text-dark"
        class="flex items-center gap-2 rounded-lg px-3 py-2 
        hover:bg-brand-color hover:text-dark  duration-300 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
        </svg>

        {{'settings.logout.title' | translate}}
        </a>
        </li>

    </ul>

    </nav>
</aside>

@if(isOpenSide()){
<div (click)="isOpenSide.set(false)"
class="w-full h-svh fixed left-0 top-0  bg-dark/50 z-20 md:hidden" 
aria-hidden="true">
</div>
}
`,
providers : [SettingsServices]
})
export class SettingsSideBarComponent {
userService = inject(UserProfileService);
isOpenSide =  signal<boolean>(false);
settingsService = inject(SettingsServices);


}
