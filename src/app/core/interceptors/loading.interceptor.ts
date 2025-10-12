import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { catchError, finalize, throwError } from 'rxjs';

export const LoadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(LoadingService);

   // Start loading before the request
    loadingService.setLoading(true) ;

    return next(req).pipe(
    finalize(() => {
    loadingService.setLoading(false) ;
    }),
    
    catchError((error: HttpErrorResponse) => {
    loadingService.setLoading(false) ;
    return throwError(() => error);
    })

    );
};
