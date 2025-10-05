import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })

export class StorageService {
  #platformId = inject(PLATFORM_ID);
  #isBrowser = signal<boolean>(isPlatformBrowser(this.#platformId));

  setItem<T>(key: string, value: T): void {
    if (!this.#isBrowser()) return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem<T>(key: string): T | null {
    if (!this.#isBrowser()) return null;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  removeItem(key: string): void {
    if (!this.#isBrowser()) return;
    localStorage.removeItem(key);
  }

  hasKey(key: string): boolean {
    if (!this.#isBrowser()) return false;
    return localStorage.getItem(key) !== null;
  }
}
