import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { catchError, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // ✅ الكود ده يشتغل في المتصفح بس
  const isBrowser = isPlatformBrowser(platformId);
  if (isBrowser && !navigator.onLine) {
    router.navigateByUrl('/error/offline');
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      
      console.log('Error' , error);

      
      if (isBrowser) {
        switch (error.status) {
          case 500:
            router.navigateByUrl('/error/server');
            break;
          case 0:
            router.navigateByUrl('/error/network');
            break;
          case 404:
            router.navigateByUrl('/error/not-found');
            break;
        }
      }

      return throwError(() => error);
    }),
  );
};
