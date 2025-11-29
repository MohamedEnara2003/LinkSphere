import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DomService } from '../document/dom.service';
import { IUser } from '../../models/user.model';
import { environment } from '../../../../environments/environment.development';

export interface MetaConfig {
  title: string;
  description: string;
  user: IUser;
  image: string;
  url: string;
  type?: string; 
}

@Injectable({ providedIn: 'root' })
export class MetaService {
  #dom = inject(DomService);
  #title = inject(Title);
  #meta = inject(Meta);

  // ------------------------------
  // Basic internal helpers
  // ------------------------------

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


  // PUBLIC: Main SEO Function


  public setFullSeo(config: MetaConfig) {
    const {
      title,
      description,
      url,
      image,
      user,
      type = 'website'
    } = config;

    // 1️⃣ Title
    this.#setTitle(title);

    // 2️⃣ Description
    this.#setDescription(description);

    // 3️⃣ Canonical
    this.#setCanonicalURL(url);

    // 4️⃣ Open Graph
    this.#setMetaTags([
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: type },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
    ]);

    // 5️⃣ Twitter
    this.#setMetaTags([
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ]);

    // 6️⃣ Main Meta
    this.#setMetaTags([
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: `${user.firstName} ${user.lastName}` },
    ]);

    // 7️⃣ JSON-LD Schema
    this.#setJsonLD({
      "@context": "https://schema.org",
      "@type": "Person",

      "name": `${user.firstName} ${user.lastName}`,
      "alternateName": user.userName,
      "url": `${environment.appUrl}/${url}`,
      "image": user.picture?.url || "/user-placeholder.webp",

      "gender": user.gender,
      "jobTitle": user.role,

      "sameAs": [],
    });
  }
}
