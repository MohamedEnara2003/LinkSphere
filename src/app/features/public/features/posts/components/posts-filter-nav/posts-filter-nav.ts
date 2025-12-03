import { Component, inject, signal } from '@angular/core';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { Availability } from '../../../../../../core/models/posts.model';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

interface NavLink {
  id : number ,
  label: string;
  availability: Availability;
  ariaLabel: string;
}

@Component({
  selector: 'app-posts-filter-nav',
  imports : [SharedModule],
  template : `
  <nav
  class="w-full"
  aria-label="Post visibility navigation"
  role="navigation"
>
  <ul
    class="w-full grid grid-cols-3 ngText font-bold gap-2 text-sm sm:text-base"
    role="menubar"
  >

    @for (link of navLinks(); track link.id) {
      <li role="none">
        <a
          [routerLink]="[]"
          [queryParams]="{ availability: link.availability }"
          class="w-full flex justify-center pb-2 duration-300 transition-colors hover:text-brand-color border-b"
          [ngClass]="(postsAvailability() === link.availability || !postsAvailability() && link.availability === 'public') ? 
          'border-b-brand-color text-brand-color' : ''"
          [attr.aria-label]="link.ariaLabel"
          role="menuitem"
        >
          {{ link.label }}
        </a>
      </li>
    }
  </ul>
</nav>

  `,
})
export class PostsFilterNavComponent {
    #route = inject(ActivatedRoute);

    postsAvailability = toSignal<Availability , Availability>(
    this.#route.queryParamMap.pipe(
    map((query) => query.get('availability') as Availability),
    ) 
    , {initialValue : 'public'});

  navLinks = signal<NavLink[]>([
    { id : 1 , label: 'Only Me', availability: 'only-me', ariaLabel: 'View only my posts' },
    { id : 2 , label: 'Friends', availability: 'friends', ariaLabel: 'View friends posts' },
    { id : 3 , label: 'For You', availability: 'public', ariaLabel: 'View public posts'},
  ]).asReadonly();
}
