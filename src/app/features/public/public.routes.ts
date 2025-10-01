import { Routes } from '@angular/router';

export const publicRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/ui/home').then((c) => c.Home),
  },

  {
    path: 'profile/:userId',
    loadComponent: () =>import('./pages/profile/ui/user-profile').then((c) => c.userProfile),
  },
  {
    path: 'upsert-post',
    outlet: 'model',
    loadComponent: () =>
      import('./pages/posts/components/upsert-post-modal/upsert-post-modal').then(
    (c) => c.UpsertPostModal
      ),
  },

  {
    path: 'settings',
    data: { isHide: true },
    loadComponent: () =>
    import('./pages/settings/settings').then((c) => c.Settings),
    loadChildren : () => import('./pages/settings/settings.routes').then((r) => r.settingsRoutes),
    },

  {
    path: 'chats',
    data: { isHide: true },
    loadComponent: () =>
      import('./pages/chats/ui/chats').then((c) => c.Chats),
  },

{
    path: 'chats/:chatId',
    data: { isHide: true },
    loadComponent: () =>
    import('./pages/chats/ui/chats').then((c) => c.Chats),
},

{ path: '', redirectTo: '', pathMatch: 'full' },
{ path: '**', redirectTo: '', pathMatch: 'full' },

];
