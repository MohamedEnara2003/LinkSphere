import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-user-about',
  imports: [],
  template: `
    <section class="w-full" aria-labelledby="about-title">
      <!-- Section Title -->
      <h2 
        id="about-title" 
        class="text-lg md:text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        About
      </h2>

      <!-- User Bio -->
      <p class="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
        {{ about().bio }}
      </p>

      <!-- User Details -->
      <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
            Location
          </dt>
          <dd class="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {{ about().location }}
          </dd>
        </div>

        <div>
          <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
            Work
          </dt>
          <dd class="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {{ about().work }}
          </dd>
        </div>


        <div>
          <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
            Joined
          </dt>
          <dd class="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {{ about().joined }}
          </dd>
        </div>
      </dl>
    </section>
  `
})
export class UserAbout {
  about = signal({
    bio: 'Frontend Web Developer Angular',
    location: 'Cairo, Egypt',
    work: 'Frontend Developer',
    joined: 'Agu 2025'
  });
}
