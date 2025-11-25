import { Component, inject, signal } from '@angular/core';
import { AuthenticationService } from '../../../../../auth/service/auth.service';
import { logoutFlag } from '../../../../../../core/models/auth.model';
import { tap } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-log-out',
  imports: [TranslateModule],
  template: `

<article class="w-full max-w-4xl mx-auto md:p-6 lg:p-8"
  role="article"
  aria-labelledby="logout-title"
>

<section
    class="ngCard w-full max-w-md md:max-w-lg rounded-2xl p-6 
    mx-auto"
    role="region"
    aria-label="Logout Section">

    <div class="card-body text-center space-y-4">
    <!-- Page Title -->
    <h1 id="logout-title" class="text-2xl  ngText font-bold mb-4">
        {{ 'settings.logout.title' | translate }}
    </h1>

    <!-- Buttons -->
    <nav class="flex flex-col gap-3">
        <button
        class="btn w-full h-12 bg-brand-color text-white hover:opacity-90"
        type="button"
        [title]="'settings.logout.logout_current_title' | translate"
        [attr.aria-label]="'settings.logout.logout_current_device' | translate"
        (click)="logOut('current')"
        >
        {{ 'settings.logout.logout_current_device' | translate }}
        </button>

        <button
        class="btn w-full h-12 btn-outline border-brand-color text-brand-color hover:bg-brand-color/10"
        type="button"
        [attr.aria-label]="'settings.logout.logout_all_devices' | translate"
        [title]="'settings.logout.logout_all_title' | translate"
        (click)="logOut('all')">
        {{ 'settings.logout.logout_all_devices' | translate }}
        </button>
    </nav>

    <!-- Loading State -->
    @if(isLoading()){
    <footer
    class="flex flex-col items-center justify-center gap-2"
    role="alert"
    aria-busy="true"
    >
    <span class="loading loading-spinner  loading-lg text-brand-color"></span>
    <p class="text-sm text-brand-color font-medium">{{ 'settings.logout.please_wait' | translate }}</p>
    </footer>
    }

    </div>

  </section>
</article>

`,

})
export class logOut {
    
    isLoading = signal<boolean>(false);
    #AuthenticationService = inject(AuthenticationService);


    logOut(logOutFlag : logoutFlag) : void {
    this.isLoading.set(true);
    this.#AuthenticationService.logout(logOutFlag).pipe(
    tap(() => this.isLoading.set(false))
    ).subscribe()
    }

}
