import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IconRenderer } from "../../../../../../components/navigations/Icon-renderer/Icon-renderer";

@Component({
  selector: 'app-user-about',
  imports: [TranslateModule, IconRenderer],
  template: `
    <article class="w-full pb-10" aria-labelledby="about-title">

      <h2 
        id="about-title" 
        class="text-lg md:text-xl font-bold mb-4 ngText flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="size-6 text-brand-color">
        <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        {{ 'profile.about.title' | translate }}
      </h2>

      <ul class="w-full grid grid-cols-1">
      @for (item of aboutData(); let i = $index ; track (item.title + ' ' + i)) {
      <li>
        <section class="flex items-center gap-2 mt-4">
          <app-icon-renderer 
          [svgString]="item.icon"
          styleClass="size-6"
          fill="outline"
          />
          <div>
            <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ item.title | translate }}</dt>
            <dd class="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {{ item.value || ('profile.about.not_provided' | translate) }}
            </dd>
          </div>
        </section>
      </li>
      }
      </ul>
    </article>
  `
})
export class UserAbout {
aboutData = input<Array<{title : string , value : string , icon : string}>>()
}
