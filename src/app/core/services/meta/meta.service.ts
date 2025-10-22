import { Injectable, inject, DOCUMENT } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface MetaData {
  // 🧠 Basic SEO
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  robots?: string;
  canonical?: string;

  // 🟩 Open Graph (Facebook / LinkedIn)
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: 'website' | 'article' | 'profile' | 'video.other';
  ogLocale?: string;
  ogSiteName?: string;

  // 🐦 Twitter Card
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
  twitterCreator?: string;

  // 📱 App & Theme
  themeColor?: string;
  mobileAppTitle?: string;
  appleTouchIcon?: string;
  manifest?: string;

  // ⚙️ Extra
  refresh?: string;
  viewport?: string;
  charset?: string;

  // 🧩 Schema.org / JSON-LD
  schemaType?: string;
  schemaData?: Record<string, any>;
}

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  #meta = inject(Meta);
  #title = inject(Title);
  #document = inject(DOCUMENT);

  /**
   * 🧩 تعيين كل الميتا مرة واحدة
   */
  
  setMetaTags(meta: MetaData): void {
    // 🧠 تحديث العنوان
    if (meta.title) this.#title.setTitle(meta.title);

    // 🧩 Basic meta
    this.#updateTag('description', meta.description);
    this.#updateTag('keywords', meta.keywords);
    this.#updateTag('author', meta.author);
    this.#updateTag('robots', meta.robots);

    // 🧩 Canonical
    if (meta.canonical) this.#setCanonical(meta.canonical);

    // 🟩 Open Graph
    this.#updateProperty('og:title', meta.ogTitle || meta.title);
    this.#updateProperty('og:description', meta.ogDescription || meta.description);
    this.#updateProperty('og:type', meta.ogType || 'website');
    this.#updateProperty('og:url', meta.ogUrl || this.#document.URL);
    this.#updateProperty('og:image', meta.ogImage || '/assets/default-og.png');
    this.#updateProperty('og:locale', meta.ogLocale || 'en_US');
    this.#updateProperty('og:site_name', meta.ogSiteName || meta.title);

    // 🐦 Twitter Card
    this.#updateProperty('twitter:card', meta.twitterCard || 'summary_large_image');
    this.#updateProperty('twitter:title', meta.twitterTitle || meta.title);
    this.#updateProperty('twitter:description', meta.twitterDescription || meta.description);
    this.#updateProperty('twitter:image', meta.twitterImage || '/assets/default-og.png');
    this.#updateProperty('twitter:site', meta.twitterSite);
    this.#updateProperty('twitter:creator', meta.twitterCreator);

    // 📱 Theme & App
    this.#updateTag('theme-color', meta.themeColor);
    this.#updateTag('apple-mobile-web-app-title', meta.mobileAppTitle || meta.title);
    this.#updateTag('apple-touch-icon', meta.appleTouchIcon);
    this.#updateTag('manifest', meta.manifest);
    this.#updateTag('viewport', meta.viewport || 'width=device-width, initial-scale=1');
    this.#updateTag('charset', meta.charset || 'UTF-8');
    this.#updateTag('refresh', meta.refresh);

    // 🧩 Schema.org (Structured Data)
    if (meta.schemaType && meta.schemaData) {
      this.#addJsonLd(meta.schemaType, meta.schemaData);
    }
  }

  /**
   * 🟢 تحديث العنوان فقط
   */
  setTitle(title: string): void {
    this.#title.setTitle(title);
  }

  /**
   * 🟠 تحديث meta tag عادي
   */
  #updateTag(name: string, content?: string): void {
    if (!content) return;
    this.#meta.updateTag({ name, content });
  }

  /**
   * 🔵 تحديث meta tag خاص بالـ property
   */
  #updateProperty(property: string, content?: string): void {
    if (!content) return;
    this.#meta.updateTag({ property, content });
  }

  /**
   * 🔗 تعيين canonical link tag
   */
  #setCanonical(url: string): void {
    let link: HTMLLinkElement | null = this.#document.querySelector("link[rel='canonical']");
    if (!link) {
      link = this.#document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.#document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  /**
   * 🧱 إضافة بيانات JSON-LD (Structured Data)
   */
  #addJsonLd(type: string, data: Record<string, any>): void {
    const script = this.#document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    });
    this.#document.head.appendChild(script);
  }
}
