import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { inject, runInInjectionContext } from '@angular/core';
import { AuthService } from './app/features/auth/service/auth.service';

bootstrapApplication(App, appConfig).then((appRef) => {
    runInInjectionContext(appRef.injector, () => {
    const authService = inject(AuthService);
    authService.initAuth();
  });
}).catch((err) => console.error(err));
