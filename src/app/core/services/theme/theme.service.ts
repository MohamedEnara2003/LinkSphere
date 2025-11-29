import { Injectable, inject, signal, effect, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { StorageService } from '../storage/locale-storage.service';

export enum DarkMode {
  Dark = 'dark',
  Light = 'light',
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  #html!: HTMLElement;
  #storageService = inject(StorageService);
  #platformId = inject(PLATFORM_ID);
  #document = inject(DOCUMENT);

  isDarkMode = signal(true);


    initializeTheme() : void {
    if (isPlatformBrowser(this.#platformId)) {
    this.#initializeTheme();
    this.#setupThemeEffect();
    }
    }

  #initializeTheme(): void {
    this.#html = this.#document.documentElement;

    const savedTheme: DarkMode | null = this.#storageService.getItem('theme');

    if (savedTheme) {
      this.isDarkMode.set(savedTheme === DarkMode.Dark);
    } else {
      this.isDarkMode.set(true);
    }

  }    

  #setupThemeEffect(): void {
    effect(() => {
      this.applyTheme();
    });
  }

  private applyTheme(): void {
    const isDark = this.isDarkMode();

    if (isDark) {
      this.#html.setAttribute('data-theme', 'dark');
      this.#html.classList.add('dark');
    } else {
      this.#html.setAttribute('data-theme', 'light');
      this.#html.classList.remove('dark');
    }

    // نحفظ القيمة في localStorage
    this.#storageService.setItem(
      'theme',
      isDark ? DarkMode.Dark : DarkMode.Light
    );
  }

  /** ✅ دالة لتبديل الوضع */
  toggleTheme(): void {
    this.isDarkMode.update((current) => !current);
  }

  /** ✅ الدالة اللي كانت ناقصة عندك */
  setTheme(isDark: boolean): void {
    this.isDarkMode.set(isDark);
  }

  getCurrentTheme(): string {
    return this.isDarkMode() ? DarkMode.Dark : DarkMode.Light;
  }
}
