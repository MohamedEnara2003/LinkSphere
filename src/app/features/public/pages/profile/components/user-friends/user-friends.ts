import { Component, signal } from '@angular/core';
import { NgImage } from "../../../../../../shared/components/ng-image/ng-image";


@Component({
  selector: 'app-user-friends',
  imports: [NgImage],
  template: `
    <section 
      class="w-full" 
      aria-labelledby="friends-title">

      <!-- Section Title -->
      <h2 
        id="friends-title" 
        class="text-lg md:text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Friends
      </h2>

      <!-- Friends List -->
      <ul 
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5"
        role="list">

    @for (friend of friends(); track friend.id) {
          <li 
            class="flex flex-col items-center ngCard
            rounded-lg p-3 shadow hover:shadow-md transition"
            role="listitem"
          >
  <!-- Avatar -->
  <app-ng-image
    [options]="{
      src : friend.avatar,
      alt :'Profile picture of ' + friend.name,
      width : 64,
      height : 64,
      class : 'w-16 h-16 rounded-full object-cover border-2 border-brand-color mb-2'
    }"
  />
            <!-- Friend Name -->
            <p class="text-sm font-semibold ngText">
              {{ friend.name }}
            </p>

            <!-- Username -->
            <span 
              class="text-xs text-gray-500 dark:text-gray-400" 
              aria-label="Username">
              @{{ friend.username }}
            </span>
          </li>
        }
      </ul>
    </section>
  `,
})
export class UserFriends {
  friends = signal(
    Array.from({ length: 8 }).map((_, i) => ({
      id: i + 1,
      name: `Friend ${i + 1}`,
      username: `friend${i + 1}`,
      avatar: `https://randomuser.me/api/portraits/men/${i + 10}.jpg`
    }))
  );
}
