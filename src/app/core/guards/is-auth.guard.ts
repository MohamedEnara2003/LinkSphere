import { CanActivateFn, Router,  } from '@angular/router';
import { inject } from '@angular/core';
import { UserProfileService } from '../../features/public/pages/profile/services/user-profile.service';
import { catchError, map, of } from 'rxjs';

export const isAuthGuard: CanActivateFn = () => {
  const userService = inject(UserProfileService);
  const router = inject(Router);

  const backToLogin = () => {
  return  router.createUrlTree(['/auth/login'])
  }

  return userService.getUserProfile().pipe(
  map((user) =>  user ? true : backToLogin()),
  catchError(() =>  of(backToLogin()))
  );

};
