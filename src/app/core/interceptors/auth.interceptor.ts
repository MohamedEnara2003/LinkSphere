import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/locale-storage.service';
import { AuthToken } from '../models/auth.model';
import { AuthService } from '../../features/auth/service/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { DomService } from '../services/dom.service';


interface ErrorAuthorization {
  cause : {
  issus: {path: string , message: string}
  },
  error_message : string ,
  error_stack : string ,
  name : string ,
  statusCode : number ,
}

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const router = inject(Router);
  const domService = inject(DomService);
  const storageService = inject(StorageService);
  const authService = inject(AuthService);

  const redirectToLogin  = () => {
  router.navigate(['/auth/login']);
  }

  const auth = storageService.getItem<AuthToken>('auth');
  let authReq = req;
  
  // Attach token headers
  if (req.url.includes('/auth/refresh-token') && auth?.refresh_token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${auth.refresh_token}` }
    });
  } else if (auth?.access_token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${auth.access_token}` }
    });
  }

  return next(authReq).pipe(
  catchError((error: unknown) => {

    const backendError = error as { name?: string; error_message?: string } ;

    const errorName = (backendError?.name!).toLowerCase();
    const errorMessage = (backendError?.error_message || '').toLowerCase();
    const isExpired = errorName === 'tokenexpirederror' || errorMessage.includes('jwt expired');

    const tokenError = isExpired  && auth?.refresh_token;
    
      // Refresh token
      if (tokenError && !req.url.includes('/auth/refresh-token')) {
        return authService.refreshToken().pipe(
          switchMap(({ data: { credentials } }) => {
            
            // Save new credentials
            storageService.setItem('auth', credentials);

            // Retry original request with new access token
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${credentials.access_token}` }
            });

            return next(retryReq);
          }),
          catchError(() => {
            storageService.removeItem('auth');
            authService.removeTokens();
            return throwError(() => new Error('Session expired. Please log in again.'));
          })
        );
      }

      // Authorization
      const errorAuthorization = error as ErrorAuthorization | null;
      const isNotAuth = errorAuthorization?.cause.issus.path === "authorization";

      if(isNotAuth && domService.isBrowser()){
      redirectToLogin();
      }
      

      return throwError(() => error);
    })
  );
};
