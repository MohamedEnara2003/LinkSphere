import { Component, inject, signal } from '@angular/core';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { Availability } from '../../../../../../core/models/posts.model';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

interface NavLink {
  label: string;
  state: Availability;
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
    @for (link of navLinks(); track link.state) {
      <li role="listitem">
        <a
          [routerLink]="[]"
          [queryParams]="{ state: link.state }"
          class="w-full flex justify-center pb-2 duration-300 transition-colors hover:text-brand-color border-b"
          [ngClass]="(postsState() === link.state || !postsState() && link.state === 'public') ? 
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

    postsState = toSignal<Availability , Availability>(
    this.#route.queryParamMap.pipe(
    map((query) => query.get('state') as Availability),
    ) 
    , {initialValue : 'public'});

  navLinks = signal<NavLink[]>([
    { label: 'Only Me', state: 'only-me', ariaLabel: 'View only my posts' },
    { label: 'Friends', state: 'friends', ariaLabel: 'View friends posts' },
    { label: 'For You', state: 'public', ariaLabel: 'View public posts'},
  ]).asReadonly();
}
