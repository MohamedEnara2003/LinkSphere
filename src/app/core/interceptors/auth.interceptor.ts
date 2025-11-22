import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/locale-storage.service';
import { AuthToken } from '../models/auth.model';
import { AuthService } from '../../features/auth/service/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const storageService = inject(StorageService);
  const authService = inject(AuthService);

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
    catchError((error: HttpErrorResponse) => {

    const backendError = error as { name?: string; error_message?: string } | null;

    const errorName = (backendError?.name || error.name || '').toLowerCase();
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

      return throwError(() => error);
    })
  );
};
