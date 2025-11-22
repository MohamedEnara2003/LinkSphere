import { Routes } from '@angular/router';



export const searchRoutes: Routes = [
    {
    path: '',
    loadComponent: () => import('./search').then(c => c.SearchCompoent),
    children: [
    {
    path : 'all' , 
    loadComponent: () => import('./pages/search-all/ui/search-all').then(c => c.SearchAll),
    },
    {
    path : 'people' , 
    loadComponent: () => import('./pages/search-people/ui/search-people').then(c => c.SearchPeople),
    },
    {
    path : 'posts' , 
    loadComponent: () => import('./pages/search-posts/ui/search-posts').then(c => c.SearchPosts),
    },

    { path: '', redirectTo: '', pathMatch: 'full' },
    { path: '**', redirectTo: '', pathMatch: 'full' },
    ]
    }
]