import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserProfileService } from '../../features/public/pages/profile/services/user-profile.service';
import { catchError, map, of } from 'rxjs';

export const isAuthGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserProfileService);
  const router = inject(Router);

  const redirectToLogin = () => router.createUrlTree(['/auth/login']);

  // ⚡ استثناء صفحات auth من الـ guard عشان نتجنب infinite loop
  if (state.url.startsWith('/auth')) {
    return of(true);
  }

  return userService.getUserProfile().pipe(
    map(user => {
      if (user) return true;
      return redirectToLogin();
    }),
    catchError(() => of(redirectToLogin()))
  );
};
