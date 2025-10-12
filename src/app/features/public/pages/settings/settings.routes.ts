import { Routes } from '@angular/router';

export const settingsRoutes: Routes = [
{
    path: 'account',
    loadComponent: () =>
    import('./pages/account-setting/account-setting').then((c) => c.AccountSetting),
},
{
    path: 'update-email',
    loadComponent: () =>
    import('./pages/update-email/update-email').then((c) => c.updateEmail),
},
{
    path: 'change-password',
    loadComponent: () =>
    import('./pages/change-password/change-password').then((c) => c.ChangePasswordComponent),
},

{
    path: 'dark-mode',
    loadComponent: () =>
    import('./pages//dark-mode/dark-mode').then((c) => c.DarkMode),
},
{
    path: 'language',
    loadComponent: () =>
    import('./pages/language/language').then((c) => c.Language),
},
{
    path: 'sent-friend-requests',
    loadComponent: () =>
    import('./pages/sent-friend-requests/sent-friend-requests').then((c) => c.SentFriendRequests),
},
{
    path: 'log-out',
    loadComponent: () =>
    import('./pages/log-out/log-out').then((c) => c.logOut),
},
{ path: '', redirectTo: 'account', pathMatch: 'full' },
{ path: '**', redirectTo: '', pathMatch: 'full' },
]