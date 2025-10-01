import { Inject, Injectable, signal, effect } from '@angular/core';
import { TranslationService } from './translation.service';

import { DOCUMENT } from '@angular/common';
import { StorageService } from '../locale-storage.service';

export enum SupportedLanguages {
  EN = 'en',
  AR = 'ar'
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  readonly languageKey: string = 'lang';
  private readonly defaultLangKey: SupportedLanguages = SupportedLanguages.EN;
  private html: HTMLElement;

  currentLanguage = signal<SupportedLanguages>(this.defaultLangKey);

  constructor(
    private translationService: TranslationService,
    private localeStorageService: StorageService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.html = this.document.getElementsByTagName('html')[0];
    this.currentLanguage.set(
    (this.localeStorageService.getItem(this.languageKey) as SupportedLanguages) || this.defaultLangKey
    );


    effect(() => {
      const lang = this.currentLanguage();
      this.translationService.use(lang);
      this.localeStorageService.setItem(this.languageKey, lang);
      this.updateLayout();
    });
  }

  initSetDefaultLanguage(): void {
    this.translationService.setDefaultLanguage(this.currentLanguage());
  }

  onChangeLanguage(lang: SupportedLanguages): void {
    this.currentLanguage.set(lang);
  }

  private updateLayout(): void {
    this.html.lang = this.currentLanguage();
    this.document.body.dir = this.getDirection();
  }

  private getDirection(): string {
    return this.currentLanguage() === SupportedLanguages.EN ? 'ltr' : 'rtl';
  }
}
