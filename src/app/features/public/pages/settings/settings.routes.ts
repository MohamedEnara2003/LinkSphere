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
{ path: '', redirectTo: 'display', pathMatch: 'full' },
{ path: '**', redirectTo: '', pathMatch: 'full' },
]