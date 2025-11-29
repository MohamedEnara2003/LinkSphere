import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserProfileService } from '../../features/public/features/profile/services/user-profile.service';
import { catchError, map, of } from 'rxjs';
import { DomService } from '../services/document/dom.service';

export const isAuthGuard: CanActivateFn = () => {
  const  domService = inject(DomService);
  const userService = inject(UserProfileService);
  const router = inject(Router);


  const redirectToLogin = () => router.createUrlTree(['/auth/login']);

  if(!domService.isBrowser()){
  return redirectToLogin()
  }
  
  return userService.getUserProfile().pipe(
  map(({ data: { user } }) => user ? true : redirectToLogin()),
  catchError(() => of(redirectToLogin()))
  );

};
