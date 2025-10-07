import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../../../core/services/theme/theme.service';
import { LanguageService, SupportedLanguages } from '../../../../../../core/services/translations/language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-display',
  imports: [CommonModule, TranslateModule],
  template: `
  
  <article class="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8" role="region" aria-labelledby="account-settings-heading">

    <header class="mb-6 border-b border-brand-color/10 pb-3">
      <h1 id="account-settings-heading" class="text-2xl md:text-3xl font-bold">{{ 'settings.display.title' | translate }}</h1>
      <p class="text-sm text-gray-400">{{ 'settings.display.subtitle' | translate }}</p>
    </header>

    
    <!-- Language Selection -->
      <section role="region" aria-labelledby="language-legend">
        <form class="grid grid-cols-1 gap-3">
          <legend id="language-legend" class="fieldset-legend">{{ 'settings.display.languages' | translate }}</legend>
          <fieldset class="fieldset gap-y-3" role="radiogroup" aria-labelledby="language-legend">
            
            <!-- English -->
            <label class="flex items-center gap-2 cursor-pointer rounded-md p-2 transition-colors hover:bg-brand-color/5 focus-within:ring-2 focus-within:ring-brand-color/40">
              <input 
                type="radio" 
                name="language"
                class="ng-radio focus:ring-2 focus:ring-brand-color/50"
                [checked]="currentLanguage() === 'en'"
                (change)="selectLanguage('en')"
              />
              <span class="ngText">{{ 'settings.display.english' | translate }}</span>
            </label>

            <!-- Arabic -->
            <label class="flex items-center gap-2 cursor-pointer rounded-md p-2 transition-colors hover:bg-brand-color/5 focus-within:ring-2 focus-within:ring-brand-color/40">
              <input 
                type="radio" 
                name="language"
                class="ng-radio focus:ring-2 focus:ring-brand-color/50"
                [checked]="currentLanguage() === 'ar'"
                (change)="selectLanguage('ar')"
              />
              <span class="ngText">{{ 'settings.display.arabic' | translate }}</span>
            </label>

          </fieldset>
        </form>
      </section>

      <!-- Dark Mode Toggle -->
      <section role="region" aria-labelledby="darkmode-legend">
      <form  class="grid grid-cols-1 gap-2">
        <legend id="darkmode-legend" class="fieldset-legend">{{ 'settings.display.dark_mode' | translate }}</legend>
        <fieldset class="fieldset gap-y-2" role="radiogroup" aria-labelledby="darkmode-legend">

        
        <label class="flex items-center gap-2 cursor-pointer rounded-md p-2 transition-colors hover:bg-brand-color/5 focus-within:ring-2 focus-within:ring-brand-color/40">
        <input 
          type="radio" 
          name="theme-mode"
          class="ng-radio focus:ring-2 focus:ring-brand-color/50"
          [checked]="isDarkMode()"
          (change)="toggleDarkMode(true)"
        />
        <span class="ngText">{{ 'settings.display.dark' | translate }}</span>
      </label>

      <label class="flex items-center gap-2 cursor-pointer rounded-md p-2 transition-colors hover:bg-brand-color/5 focus-within:ring-2 focus-within:ring-brand-color/40">
        <input 
          type="radio" 
          name="theme-mode"
          class="ng-radio focus:ring-2 focus:ring-brand-color/50"
          [checked]="!isDarkMode()"
          (change)="toggleDarkMode(false)"
        />
        <span class="ngText">{{ 'settings.display.light' | translate }}</span>
      </label>
      </fieldset>
      </form>
      </section>

  </article>
  `,
})
export class Display {
  private readonly themeService = inject(ThemeService);
  private readonly languageService = inject(LanguageService);



  currentLanguage = computed(() => this.languageService.currentLanguage());
  selectLanguage(lang: string): void {
  this.languageService.onChangeLanguage(lang as SupportedLanguages);
  }


  isDarkMode = computed(() => this.themeService.isDarkMode());
  toggleDarkMode(isDarkMode : boolean) {
  this.themeService.setTheme(isDarkMode)
  } 
}
