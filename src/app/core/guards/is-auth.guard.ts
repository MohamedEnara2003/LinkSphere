import {CanMatchFn, Router } from '@angular/router';
import { StorageService } from '../services/locale-storage.service';
import { inject } from '@angular/core';
import { AuthToken } from '../models/auth.model';

export const isAuthGuard: CanMatchFn = () => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  const auth = storageService.getItem<AuthToken>('auth') ;

  return auth ? true : router.navigateByUrl('/auth/login');
};
