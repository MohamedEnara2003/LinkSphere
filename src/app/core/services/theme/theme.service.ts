import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
   #html!: HTMLElement;
  isDarkMode = signal(true);

  constructor() {
    this.initializeTheme();
    this.setupThemeEffect();
  }

  private initializeTheme(): void {
    this.#html  = document.documentElement;
    
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      this.isDarkMode.set(true);
    }
    
    this.applyTheme();
  }

  private setupThemeEffect(): void {
    // Effect to automatically apply theme changes
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
    
    // Save to localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  toggleTheme(): void {
    this.isDarkMode.update(current => !current);
  }

  setTheme(isDark: boolean): void {
    this.isDarkMode.set(isDark);
  }

  getCurrentTheme(): string {
    return this.isDarkMode() ? 'dark' : 'light';
  }
}
