import { Component } from '@angular/core';
import { SettingsSideBarComponent } from "./components/settings-side-bar/settings-side-bar";
import { RouterOutlet } from '@angular/router';
import { BackLink } from "../../../../shared/components/links/back-link";



@Component({
  selector: 'app-settings',
  imports: [SettingsSideBarComponent, RouterOutlet, BackLink],
  template: `
  <section class="relative flex flex-col md:flex-row gap-4">

  <app-settings-side-bar />
  
  <main class="w-full min-h-svh flex flex-col gap-1">

  <header class="w-full flex p-2">
  <app-back-link />
  </header>
  <router-outlet />
  </main>

  </section>
  `,
})
export class Settings {

}
