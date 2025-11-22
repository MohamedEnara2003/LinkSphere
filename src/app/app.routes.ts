import { Routes } from '@angular/router';



export const routes: Routes = [
  {
    path: 'public',
    loadChildren: () => import('./features/public/public.routes').then(r => r.publicRoutes),
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(r => r.authRoutes),
  },
  {
    path: 'error',
    loadChildren: () => import('./features/error/error.routes').then(r => r.errorRoutes),
  },
  { path: '', redirectTo: 'public', pathMatch: 'full' },
  { path: '**', redirectTo: 'error', pathMatch: 'full' },
];
