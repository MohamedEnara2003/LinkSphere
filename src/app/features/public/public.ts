import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { UserProfileService } from './features/profile/services/user-profile.service';
import { Logo } from "../../shared/components/logo/logo";
import { LoadingService } from '../../core/services/loading.service';
import { DomService } from '../../core/services/document/dom.service';
import { StorageService } from '../../core/services/storage/locale-storage.service';
import { catchError, EMPTY, tap } from 'rxjs';
import { AuthToken } from '../../core/models/auth.model';
import { NgImageFullscreen } from "./components/ng-image-fullscreen/ng-image-fullscreen";
import { ImageFullscreenService } from '../../core/services/style/image-fullscreen.service';



@Component({
  selector: 'app-public',
  imports: [RouterOutlet, Header, Footer, Logo, NgImageFullscreen],
  template: `
  <main>
  @defer(when !loadingService.isLoading()){

  <app-header />
  <section class="relative">
  <router-outlet />
  <router-outlet name="model"/>
  </section>
  <app-footer />

  @if(imageFullscreen.isLoad()){
  <app-ng-image-fullscreen />
  }


  }@placeholder {
  <section class="w-full h-svh flex items-center justify-center ">
  <app-logo  styleClass="text-5xl animate-pulse"/>
  </section>
  }

  </main>
  
  `,
})

export class Public {
readonly #router = inject(Router);
readonly #userProfileService = inject(UserProfileService);
readonly #domService = inject(DomService);
readonly #storageService = inject(StorageService);
readonly imageFullscreen = inject(ImageFullscreenService);
readonly loadingService = inject(LoadingService);


ngOnInit(): void {
this.#getUserProfile();
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
