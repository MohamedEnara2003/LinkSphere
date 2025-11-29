import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
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


  ]
};

