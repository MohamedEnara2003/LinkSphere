import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../../../core/services/theme/theme.service';
import { LanguageService, SupportedLanguages } from '../../../../../../core/services/translations/language.service';

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="p-4 space-y-4">

      <h2 class="text-lg font-bold mb-4 ngText">Display Settings</h2>

    <!-- Language Selection -->
      <section>
        <form class="grid grid-cols-1 gap-3">
          <legend class="fieldset-legend">Languages</legend>
          <fieldset class="fieldset gap-y-3">
            
            <!-- English -->
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="language"
                class="ng-radio"
                [checked]="currentLanguage() === 'en'"
                (change)="selectLanguage('en')"
              />
              <span class="ngText">English</span>
            </label>

            <!-- Arabic -->
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="language"
                class="ng-radio"
                [checked]="currentLanguage() === 'ar'"
                (change)="selectLanguage('ar')"
              />
              <span class="ngText">Arabic</span>
            </label>

          </fieldset>
        </form>
      </section>

      <!-- Dark Mode Toggle -->
      <section>
      <form  class="grid grid-cols-1 gap-2">
        <legend class="fieldset-legend">Dark Mode</legend>
        <fieldset class="fieldset gap-y-2">

        
        <label class="flex items-center gap-2 cursor-pointer">
        <input 
          type="radio" 
          class="ng-radio"
          [checked]="isDarkMode()"
          (change)="toggleDarkMode(true)"
        />
        <span class="ngText">Dark</span>
      </label>

      <label class="flex items-center gap-2 cursor-pointer">
        <input 
          type="radio" 
          class="ng-radio"
          [checked]="!isDarkMode()"
          (change)="toggleDarkMode(false)"
        />
        <span class="ngText">Light</span>
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
