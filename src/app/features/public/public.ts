import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { UserProfileService } from './pages/profile/services/user-profile.service';
import { Logo } from "../../shared/components/logo/logo";
import { LoadingService } from '../../core/services/loading.service';
import { catchError, EMPTY, tap } from 'rxjs';
import { AuthToken } from '../../core/models/auth.model';
import { StorageService } from '../../core/services/locale-storage.service';
import { DomService } from '../../core/services/dom.service';
import { SearchService } from './pages/search/service/search.service';


@Component({
  selector: 'app-public',
  imports: [RouterOutlet, Header, Footer, Logo ],
  template: `
  <main>
  @defer(when !loadingService.isLoading()){
  <app-header />

  <section class="relative">
  <router-outlet />
  <router-outlet name="model"/>
  @if(searchService.isFocusSearch()){
      <!-- Backdrop -->
      <div 
      (click)="searchService.isFocusSearch.set(false)"
        class="size-full bg-dark/50  absolute inset-0 z-40"
        aria-hidden="true"
        tabindex="-1">
      </div>
  }
  </section>

  <app-footer />
  }@placeholder {
  <section class="w-full h-svh flex items-center justify-center ">
  <app-logo  styleClass="text-5xl animate-pulse"/>
  </section>
  }

  </main>
  
  `,
})

export class Public {
#router = inject(Router);
#userProfileService = inject(UserProfileService);
#domService = inject(DomService);
#storageService = inject(StorageService);
searchService = inject(SearchService);
loadingService = inject(LoadingService);


ngOnInit(): void {
this.#getUserProfile();
this.#userProfileService.getReceivedFriendRequests().subscribe();
this.#userProfileService.getSentFriendRequests().subscribe();
}

  #getUserProfile() : void {
  if (!this.#domService.isBrowser()) return;
  
  const auth = this.#storageService.getItem<AuthToken>('auth');
  if (!auth?.access_token) {
  this.#redirectToLogin();
  return;
  }

  this.#userProfileService.getUserProfile()
    .pipe(
    tap(({data : {user}}) => !user ? this.#redirectToLogin() : user),
    catchError(() => {
    this.#redirectToLogin();
    return EMPTY
    })
    ).subscribe();
  }

  #redirectToLogin  () {
  this.#router.navigate(['/auth/login']);
  }

}
