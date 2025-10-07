import { Routes } from '@angular/router';

export const settingsRoutes: Routes = [
{
    path: 'account',
    loadComponent: () =>
    import('./pages/account-setting/account-setting').then((c) => c.AccountSetting),
},
{
    path: 'display',
    loadComponent: () =>
    import('./pages/display/display').then((c) => c.Display),
},
{
    path: 'log-out',
    loadComponent: () =>
    import('./pages/log-out/log-out').then((c) => c.logOut),
},
{ path: '', redirectTo: 'account', pathMatch: 'full' },
{ path: '**', redirectTo: '', pathMatch: 'full' },
]