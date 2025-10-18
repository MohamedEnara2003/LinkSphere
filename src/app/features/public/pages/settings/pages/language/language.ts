import { Component, computed, inject } from '@angular/core';
import { LanguageService, SupportedLanguages } from '../../../../../../core/services/translations/language.service';
import { SharedModule } from '../../../../../../shared/modules/shared.module';

@Component({
  selector: 'app-language',
  imports: [SharedModule ],
  template: `

<article class="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8" role="region" 
aria-labelledby="account-settings-heading">

    <header class="mb-6 border-b border-brand-color/10 pb-3">
    <h1 id="account-settings-heading" class="text-2xl md:text-3xl font-bold">
      {{ 'settings.language.title' | translate }}
    </h1>
    <p class="text-sm text-gray-400">{{ 'settings.language.subtitle' | translate }}</p>
    </header>

    
    <!-- Language Selection -->
    <section role="region" aria-labelledby="language-legend">
        <form class="grid grid-cols-1 gap-3">
        <legend id="language-legend" class="fieldset-legend">{{ 'settings.language.languages' | translate }}</legend>
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
            <span class="ngText">{{ 'settings.language.english' | translate }}</span>
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
              <span class="ngText">{{ 'settings.language.arabic' | translate }}</span>
            </label>

          </fieldset>
        </form>
      </section>


  </article>
  `,
})
export class Language {
  private readonly languageService = inject(LanguageService);


  currentLanguage = computed(() => this.languageService.currentLanguage());
  selectLanguage(lang: string): void {
  this.languageService.onChangeLanguage(lang as SupportedLanguages);
  }


}
