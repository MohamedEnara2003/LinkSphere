import { Routes } from '@angular/router';

export const profileRoutes: Routes = [

{
path: 'user/:userId',
loadComponent: () =>import('./pages/user-profile/ui/user-profile')
.then((c) => c.userProfile),
},

{
path: 'user/:userId/update',
loadComponent: () =>import('./pages/update-profile/ui/update-profile')
.then((c) => c.UpdateProfile),
},

{
path: ':userId/update',
loadComponent: () =>import('./pages/update-profile/ui/update-profile')
.then((c) => c.UpdateProfile),
},

{
path: 'not-found',
loadComponent: () =>import('./pages/not-found-profile/not-found-profile')
.then((c) => c.NotFoundProfile),
},

{ path: '', redirectTo: 'not-found', pathMatch: 'full' },
{ path: '**', redirectTo: 'not-found', pathMatch: 'full' },
]