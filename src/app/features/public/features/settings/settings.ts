import { Component, inject } from '@angular/core';
import { SettingsSideBarComponent } from "./components/settings-side-bar/settings-side-bar";
import { RouterOutlet } from '@angular/router';
import { BackLink } from "../../../../shared/components/links/back-link";
import { MetaService } from '../../../../core/services/meta/meta.service';



@Component({
  selector: 'app-settings',
  imports: [SettingsSideBarComponent, RouterOutlet, BackLink],
  template: `
  <section class="relative flex flex-col md:flex-row gap-4 ">

  <app-settings-side-bar />
  
  <main class="w-full min-h-svh flex flex-col  gap-2  p-2 ">
  <header class="w-full flex p-2 ">
  <app-back-link path="/" />
  </header>

  <router-outlet />

  </main>

  </section>
  `,
})
export class Settings {
readonly #metaService = inject(MetaService);

ngOnInit() {
    this.#metaService.setMeta({
    title: `Settings | Link Sphere Social`,
    description: `Manage your account settings, privacy preferences, and security options on Link Sphere Social.`,
    image: "",  
    url: "settings",
    });
}


}
