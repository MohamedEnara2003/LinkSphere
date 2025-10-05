import { Routes } from '@angular/router';

export const publicRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/ui/home').then((c) => c.Home),
  },

  {
    path: 'profile/:userId', data : {isProfile : true} ,
    loadComponent: () =>import('./pages/profile/pages/user-profile/user-profile')
    .then((c) => c.userProfile),
  },
  {
  path: 'profile/:userId/update', 
  loadComponent: () =>import('./pages/profile/pages/update-profile/ui/update-profile')
  .then((c) => c.UpdateProfile),
  },
  {
    path: 'upsert-post',
    outlet: 'model',
    loadComponent: () =>
      import('./pages/posts/components/upsert-post-modal/upsert-post-modal').then(
        (c) => c.UpsertPostModel
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
