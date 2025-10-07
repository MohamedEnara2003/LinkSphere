import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { UserProfileService } from './pages/profile/services/user-profile.service';
import { CommonModule } from '@angular/common';
import { Logo } from "../../shared/components/logo/logo";
import { take } from 'rxjs';


@Component({
  selector: 'app-public',
  imports: [RouterOutlet, Header, Footer, CommonModule, Logo],
  template: `


  <main>
  @defer(on timer(1000)){
  <app-header />
  <router-outlet name="model"/>
  <router-outlet />
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

constructor(){
this.#userProfileService.getUserProfile().pipe(take(1)).subscribe();
}




}
