import { Component, computed, inject, OnInit } from '@angular/core';

import { ThemeService } from '../../../../../../core/services/theme/theme.service';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { MetaService } from '../../../../../../core/services/meta/meta.service';


@Component({
  selector: 'app-dark-mode',
  imports: [SharedModule],
  template: `
  
  <article class="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8" role="region" 
  aria-labelledby="account-settings-heading">

    <header class="mb-6 border-b border-brand-color/10 pb-3">
      <h1 id="account-settings-heading" class="text-2xl md:text-3xl font-bold">
        {{ 'settings.darkMode.title' | translate }}
    </h1>
      <p class="text-sm text-gray-400">{{ 'settings.darkMode.subtitle' | translate }}</p>
    </header>


      <!-- Dark Mode Toggle -->
      <section role="region" aria-labelledby="darkmode-legend">
      <form  class="grid grid-cols-1 gap-2">
        <legend id="darkmode-legend" class="fieldset-legend">{{ 'settings.darkMode.dark_mode' | translate }}</legend>
        <fieldset class="fieldset gap-y-2" role="radiogroup" aria-labelledby="darkmode-legend" aria-label="Theme mode selection">

        
          <label for="theme-dark" class="flex items-center gap-2 cursor-pointer rounded-md p-2 transition-colors hover:bg-brand-color/5 focus-within:ring-2 focus-within:ring-brand-color/40">
          <input 
            id="theme-dark"
            type="radio" 
            name="theme-mode"
            class="ng-radio focus:ring-2 focus:ring-brand-color/50"
            [checked]="isDarkMode()"
            [attr.aria-checked]="isDarkMode()"
            (change)="toggleDarkMode(true)"
          />
          <span class="ngText">{{ 'settings.darkMode.dark' | translate }}</span>
        </label>

        <label for="theme-light" class="flex items-center gap-2 cursor-pointer rounded-md p-2 transition-colors hover:bg-brand-color/5 focus-within:ring-2 focus-within:ring-brand-color/40">
          <input 
            id="theme-light"
            type="radio" 
            name="theme-mode"
            class="ng-radio focus:ring-2 focus:ring-brand-color/50"
            [checked]="!isDarkMode()"
            [attr.aria-checked]="!isDarkMode()"
            (change)="toggleDarkMode(false)"
          />
          <span class="ngText">{{ 'settings.darkMode.light' | translate }}</span>
        </label>
      </fieldset>
      </form>
      </section>

  </article>
  `,
})
export class DarkMode implements OnInit {
  private readonly themeService = inject(ThemeService);
  readonly #metaService = inject(MetaService);

  isDarkMode = computed(() => this.themeService.isDarkMode());

  ngOnInit() {
    this.#metaService.setMeta({
      title: 'Dark Mode Settings | Link Sphere Social',
      description: 'Toggle between dark and light theme preferences for your Link Sphere Social experience.',
      image: '',
      url: 'settings/dark-mode'
    });
  }

  toggleDarkMode(isDarkMode : boolean) {
  this.themeService.setTheme(isDarkMode)
  } 
}
