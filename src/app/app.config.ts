  import { ApplicationConfig, inject, PLATFORM_ID, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
  import { provideRouter } from '@angular/router';

  import { routes } from './app.routes';
  import { provideClientHydration, withEventReplay, withHttpTransferCacheOptions } from '@angular/platform-browser';

  import { provideTranslateService } from "@ngx-translate/core";
  import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
  import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
  import { AuthInterceptor } from './core/interceptors/auth.interceptor';
  import { ErrorInterceptor } from './core/interceptors/error.interceptor';
  import { MessageAlertInterceptor } from './core/interceptors/message-alert.interceptor';
  import { LoadingInterceptor } from './core/interceptors/loading.interceptor';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import firebaseApp from '../environments/firebase.config';

import { provideAuth0 } from '@auth0/auth0-angular';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../environments/environment.development';

  const Interceptors = [
  AuthInterceptor , ErrorInterceptor , MessageAlertInterceptor , LoadingInterceptor ,
  ]

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(
      withEventReplay(),
      withHttpTransferCacheOptions({ includePostRequests: false }),
    ),
    provideHttpClient(
      withInterceptors(Interceptors),
      withFetch(),
    ),

    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json'
      }),
      lang: 'en'
    }),


    {
      provide: 'AUTH0_BROWSER_ONLY',
      useFactory: () => {
        const platformId = inject(PLATFORM_ID);

        // If running on server (SSR) → DO NOT ENABLE Auth0
        if (!isPlatformBrowser(platformId)) {
          return [];
        }

        const { domain, clientId, audience, redirectUri } = environment.auth0;

        if (!domain || !clientId) {
          console.warn('Auth0 domain/clientId are missing. Skipping Auth0 bootstrap.');
          return [];
        }

        // Browser → safe to read window
        return provideAuth0({
          domain,
          clientId,
          authorizationParams: {
            redirect_uri: redirectUri || window.location.origin,
            audience: audience || undefined,
          }
        });
      },
    },

    provideFirebaseApp(() => initializeApp(firebaseApp.options)),
    provideAuth(() => getAuth()),
  ]
};

