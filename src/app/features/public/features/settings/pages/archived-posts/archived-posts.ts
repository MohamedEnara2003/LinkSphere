import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { FreezedPosts } from "../../../posts/ui/freezed-posts/freezed-posts";
import { MetaService } from '../../../../../../core/services/meta/meta.service';

@Component({
  selector: 'app-archived-posts',
  imports: [SharedModule, FreezedPosts],
  template: `

  <article class="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8" role="region" 
  aria-labelledby="frezze-posts-settings-heading">

      <header id="frezze-posts-settings-heading"
      class="mb-6 border-b border-brand-color/10 pb-3">
      <h1  class="text-2xl md:text-3xl font-bold">
      {{ 'settings.posts.title' | translate }}
      </h1>
      <p class="text-sm text-gray-400">{{ 'settings.posts.subtitle' | translate }}</p>
      </header>

  <section role="region" aria-label="Frozen posts list">
    <app-freezed-posts />
  </section>


  </article>
  `,
  })
  export class ArchivedPosts implements OnInit {
    readonly #metaService = inject(MetaService);

    ngOnInit() {
      this.#metaService.setMeta({
        title: 'Archived Posts | Link Sphere Social',
        description: 'View and manage your archived and frozen posts. Keep important posts private or access them later.',
        image: '',
        url: 'settings/archived-posts'
      });
    }
  }