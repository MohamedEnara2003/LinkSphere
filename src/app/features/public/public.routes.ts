import { Routes } from '@angular/router';



export const publicRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./public').then(c => c.Public),
    children: [
      {
        path: 'feed',
        loadComponent: () => import('./features/feed/ui/feed').then(c => c.FeedComponent),
      },
      {
        path: 'upsert-post',
        outlet: 'model',
        loadComponent: () => import('./features/posts/components/upsert-post-modal/upsert-post-modal')
          .then(c => c.UpsertPostModel),
      },
      {
        path: 'comments',
        outlet: 'model',
        loadComponent: () => 
          import('./features/comments/ui/post-comments-model')
        .then(c => c.postCommentsModel),
      },
      {
        path: 'profile',
        data: { isProfile: true },
        loadChildren: () => import('./features/profile/profile.routes').then(r => r.profileRoutes),
      },
      {
        path: 'settings',
        data: { isHide: true },
        loadChildren: () => import('./features/settings/settings.routes').then(r => r.settingsRoutes),
      },
      {
        path: 'search',
        loadComponent: () => import('./features/search/ui/search').then(c => c.SearchCompoent),
      },
      {
        path: 'chats',
        data: { isHide: true },
        loadComponent: () => import('./features/chats/ui/chats').then(c => c.Chats),
      },
      {
        path: 'chats/:chatId',
        data: { isHide: true },
        loadComponent: () => import('./features/chats/ui/chats').then(c => c.Chats),
      },
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];
