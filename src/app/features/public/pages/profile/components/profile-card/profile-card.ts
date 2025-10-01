import { Component, inject } from '@angular/core';
import { MockUsersService } from '../../../../../../core/services/testing/mock-users.service';
import { IUser } from '../../../../../../core/models/user.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserPicture } from "../user-picture/user-picture";


@Component({
selector: 'app-profile-card',
imports: [ UserPicture],
template: `
<article class="size-full  overflow-y-auto ngCard p-4 flex flex-col  items-center  "
    role="region" 
    aria-label="User Profile Card"
    >
  
      <app-user-picture 
      styleClass="object-cover size-40 rounded-full border-4 border-brand-color shadow-md" 
      [user]="user()"
      />

      <!-- بيانات المستخدم -->
      <address class="card-body  text-center items-center ">
        <h2 
          class="card-title text-2xl font-bold ngText" 
          aria-label="Full name"
        >
          {{ user()?.firstName }} {{ user()?.lastName }}
        </h2>

        <p class="text-sm text-base-content/70" aria-label="Username">
          @{{ user()?.userName }}
        </p>
        <p 
          class="text-sm mt-3 text-base-content/80" 
          aria-label="Email address"
        >
          📧 {{ user()?.email }}
        </p>

        @if (user()?.phone) {
          <p aria-label="Phone number">
            📞 {{ user()?.phone }}
          </p>
        }

        @if (user()?.address) {
          <p aria-label="Address">
            📍 {{ user()?.address }}
          </p>
        }
      </address>
</article>
`,
})
export class ProfileCard {
    private readonly  mockUsersService = inject(MockUsersService)
    user  = toSignal<IUser>(this.mockUsersService.getUserById('1'));

}
