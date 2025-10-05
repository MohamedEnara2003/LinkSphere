import { Component, input } from '@angular/core';
import { NgImage } from "../../../../../../shared/components/ng-image/ng-image";
import { IFriend } from '../../../../../../core/models/user.model';


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

    @for (friend of friends(); track friend._id) {
    <li 
    class="flex flex-col items-center ngCard
    rounded-lg p-3 shadow hover:shadow-md transition"
    role="listitem"
    >
  <!-- Avatar -->
  <app-ng-image
    [options]="{
      src : friend.picture || '',
      alt :'Profile picture of ' + friend.firstName,
      width : 64,
      height : 64,
      class : 'size-18 rounded-full object-cover border-2 border-brand-color mb-2'
    }"
  />
            <!-- Friend Name -->
            <p class="text-sm font-semibold ngText">
              {{ friend.firstName }}
            </p>

            <!-- Username -->
            <span 
              class="text-xs text-gray-500 dark:text-gray-400" 
              aria-label="Username">
              @{{ friend.userName }}
            </span>
          </li>
        }@empty {
        <h1>No Friends</h1>
        }
      </ul>
    </section>
  `,
})
export class UserFriends {
  friends = input<IFriend[]>([])

}
