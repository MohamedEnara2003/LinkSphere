import { Routes } from '@angular/router';


export const publicRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/ui/home').then((c) => c.Home),
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
    path: 'comments',
    outlet: 'model',
    loadComponent: () =>
      import('./pages/posts/components/post-card/components/post-comments/ui/post-comments').then(
        (c) => c.PostComments
      ),
  },

  {
    path: 'profile', 
    data : {isProfile : true} ,
    loadComponent: () =>
    import('./pages/profile/profile').then((c) => c.Profile),
    loadChildren : () => import('./pages/profile/profile.routes').then((r) => r.profileRoutes),
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
