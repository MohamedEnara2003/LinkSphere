import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-about',
  imports: [TranslateModule],
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

      <!-- User Details -->
      <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        
        <!-- User Name -->
        <section class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>

          <div>
            <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ 'profile.about.username' | translate }}</dt>
            <dd class="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {{ about()?.userName || ('profile.about.unknown' | translate) }}
            </dd>
          </div>

        </section>

        <!-- Email -->
        <section class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>

          <div>
            <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ 'profile.about.email' | translate }}</dt>
            <dd class="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {{ about()?.email || ('profile.about.not_provided' | translate) }}
            </dd>
          </div>
        </section>

        <!-- Phone -->
        <section class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
</svg>

          <div>
            <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ 'profile.about.phone' | translate }}</dt>
            <dd class="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {{ about()?.phone || ('profile.about.n_a' | translate) }}
            </dd>
          </div>
        </section>

        <!-- Gender -->
        <section class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
          <div>
            <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ 'profile.about.gender' | translate }}</dt>
            <dd class="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {{ about()?.gender || ('profile.about.unknown' | translate) }}
            </dd>
          </div>
        </section>

      </dl>

    </article>
  `
})
export class UserAbout {
  about = input<{ userName: string; email: string; phone: string; gender: string } | null>(null);
}
