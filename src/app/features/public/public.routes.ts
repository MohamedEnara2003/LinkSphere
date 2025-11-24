import { Routes } from '@angular/router';



export const publicRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./public').then(c => c.Public),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/ui/home').then(c => c.Home),
      },
      {
        path: 'upsert-post',
        outlet: 'model',
        loadComponent: () => import('./pages/posts/components/upsert-post-modal/upsert-post-modal')
          .then(c => c.UpsertPostModel),
      },
      {
        path: 'comments',
        outlet: 'model',
        loadComponent: () => import('./pages/posts/components/post-card/components/post-comments/ui/post-comments')
        .then(c => c.PostComments),
      },
      {
        path: 'profile',
        data: { isProfile: true },
        loadChildren: () => import('./pages/profile/profile.routes').then(r => r.profileRoutes),
      },
      {
        path: 'settings',
        data: { isHide: true },
        loadChildren: () => import('./pages/settings/settings.routes').then(r => r.settingsRoutes),
      },
      {
        path: 'search',
        loadComponent: () => import('./pages/search/ui/search').then(c => c.SearchCompoent),
      },
      {
        path: 'chats',
        data: { isHide: true },
        loadComponent: () => import('./pages/chats/ui/chats').then(c => c.Chats),
      },
      {
        path: 'chats/:chatId',
        data: { isHide: true },
        loadComponent: () => import('./pages/chats/ui/chats').then(c => c.Chats),
      },
      { path: '', redirectTo: 'public', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];
