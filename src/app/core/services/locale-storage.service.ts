import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class StorageService {
  #platformId = inject(PLATFORM_ID);
  #isBrowser = isPlatformBrowser(this.#platformId);

  setItem<T>(key: string, value: T): void {
    if (!this.#isBrowser) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // fallback
      localStorage.setItem(key, String(value));
    }
  }

  getItem<T>(key: string): T | null {
    if (!this.#isBrowser) return null;
    const item = localStorage.getItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item) as T;
    } catch {
      // fallback if not valid JSON
      return item as unknown as T;
    }
  }

  removeItem(key: string): void {
    if (!this.#isBrowser) return;
    localStorage.removeItem(key);
  }

  hasKey(key: string): boolean {
    if (!this.#isBrowser) return false;
    return localStorage.getItem(key) !== null;
  }
}
