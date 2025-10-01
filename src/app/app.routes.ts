import { Routes } from '@angular/router';

export const routes: Routes = [

{
path : 'public' ,  
loadComponent : () => import('./features/public/public').then((c) => c.Public) ,
loadChildren : () => import('./features/public/public.routes').then((r) => r.publicRoutes),
},

{
path : 'auth' ,  
loadComponent : () => import('./features/auth/auth').then((c) => c.Authentication) ,
loadChildren : () => import('./features/auth/auth.routes').then((r) => r.authRoutes),
},

{ path: '', redirectTo: 'public', pathMatch: 'full' },
{ path: '**', redirectTo: '', pathMatch: 'full' },
];
