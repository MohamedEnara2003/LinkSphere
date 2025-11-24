import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { UserProfileService } from './pages/profile/services/user-profile.service';
import { Logo } from "../../shared/components/logo/logo";
import { LoadingService } from '../../core/services/loading.service';
import { tap } from 'rxjs';
import { MetaService } from '../../core/services/meta/meta.service';


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
#userProfileService = inject(UserProfileService);
#metaService = inject(MetaService);
loadingService = inject(LoadingService);


ngOnInit(): void {
this.#getUserProfile();
this.#userProfileService.getReceivedFriendRequests().subscribe();
this.#userProfileService.getSentFriendRequests().subscribe();
}

  #getUserProfile() : void {
  this.#userProfileService.getUserProfile().pipe(
  tap(({data : {user}}) => {
    this.#metaService.setFullSeo({
      title: `${user.firstName} ${user.lastName} (@${user.userName}) • Profile`,
      description: `View ${user.firstName} ${user.lastName}'s profile and social activity.`,
      user,
      url: `/public/profile/user/${user._id}`,
      image: user.picture?.url || '',
    });
  })
  ).subscribe();
  }



}
