import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DomService } from '../document/dom.service';
import { environment } from '../../../../environments/environment.development';

export interface MetaConfig {
title: string;
description: string;
image: string;
url: string;
type?: string; // 'website' | 'profile' | 'article'
robots?: string;
[key: string]: string | undefined;
}

@Injectable({ providedIn: 'root' })
export class MetaService {
#dom = inject(DomService);
#title = inject(Title);
#meta = inject(Meta);


#setTitle(title: string) {
this.#title.setTitle(title);
}

#setDescription(desc: string) {
this.#meta.updateTag({ name: 'description', content: desc });
}

#setMetaTags(tags: { name?: string; property?: string; content: string }[]) {
tags.forEach(tag => this.#meta.updateTag(tag));
}

#setCanonicalURL(url: string) {
let link = this.#dom.document.querySelector("link[rel='canonical']") as HTMLLinkElement;
if (!link) {
link = this.#dom.document.createElement('link');
link.rel = 'canonical';
this.#dom.document.head.appendChild(link);
}
link.href = url;
}

#setJsonLD(schema: any) {
let script = this.#dom.document.querySelector('#json-ld-script') as HTMLScriptElement;
if (!script) {
script = this.#dom.document.createElement('script');
script.id = 'json-ld-script';
script.type = 'application/ld+json';
this.#dom.document.head.appendChild(script);
}
script.textContent = JSON.stringify(schema);
}

// ------------------------------
// Public method to set meta
// ------------------------------
public setMeta(config: MetaConfig, isProfile: boolean = false) {

const defaultMeta: MetaConfig = {
title: 'Link Sphere | Social Media App',
description: 'Link Sphere is a social media platform where users can connect, share content, and engage with friends and communities. This is the default description for all pages of the app.',
image: '/assets/default-image.webp',
url: environment.appUrl,
type: 'website',
robots: 'index, follow'
};


const metaData: MetaConfig = { ...defaultMeta, ...config };

// 1️⃣ Title
this.#setTitle(metaData.title);

// 2️⃣ Description
this.#setDescription(metaData.description);

// 3️⃣ Canonical
this.#setCanonicalURL(metaData.url);

// 4️⃣ Open Graph
this.#setMetaTags([
  { property: 'og:title', content: metaData.title },
  { property: 'og:description', content: metaData.description },
  { property: 'og:type', content: metaData.type! },
  { property: 'og:url', content: metaData.url },
  { property: 'og:image', content: metaData.image },
]);

// 5️⃣ Twitter
this.#setMetaTags([
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: metaData.title },
  { name: 'twitter:description', content: metaData.description },
  { name: 'twitter:image', content: metaData.image },
]);

// 6️⃣ Main meta
this.#setMetaTags([
  { name: 'robots', content: metaData.robots! },
  { name: 'author', content: 'Mohamed Enara' },
]);

// 7️⃣ JSON-LD
const jsonLD = isProfile
  ? {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": metaData.title,
      "email": (metaData as any).email || '',
      "image": metaData.image,
      "url": metaData.url,
    }
  : {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": metaData.title,
      "description": metaData.description,
      "url": metaData.url,
      "image": metaData.image,
    };


this.#setJsonLD(jsonLD);


}
}
