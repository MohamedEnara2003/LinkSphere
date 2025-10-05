import { Routes } from '@angular/router';
import { isAuthGuard } from './core/guards/is-auth.guard';


export const routes: Routes = [

{
path: 'public', 
loadComponent: () => import('./features/public/public').then((c) => c.Public),
loadChildren: () => import('./features/public/public.routes').then((r) => r.publicRoutes),
canMatch : [isAuthGuard]
},

{
path : 'auth' , 
loadComponent : () => import('./features/auth/auth').then((c) => c.Authentication) ,
loadChildren : () => import('./features/auth/auth.routes').then((r) => r.authRoutes),
},


{
path : 'error' , 
loadComponent : () => import('./features/error/ui/error').then((c) => c.ErrorComponent) ,
loadChildren : () => import('./features/error/error.routes').then((r) => r.errorRoutes),
},

{ path: '', redirectTo: 'public', pathMatch: 'full' },
{ path: '**', redirectTo: '', pathMatch: 'full' },

];
