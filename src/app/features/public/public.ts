import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { UserProfileService } from './pages/profile/services/user-profile.service';
import { Logo } from "../../shared/components/logo/logo";
import { LoadingService } from '../../core/services/loading.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-public',
  imports: [RouterOutlet, Header, Footer, Logo , CommonModule],
  template: `
  <main>
  @defer(when !loadingService.isLoading()){
  <app-header />
  <router-outlet />
  <router-outlet name="model"/>
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
#userProfileService = inject(UserProfileService);
loadingService = inject(LoadingService);

constructor(){
this.#userProfileService.getFriendsRequests().subscribe();
}

}
