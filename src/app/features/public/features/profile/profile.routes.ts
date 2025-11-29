import { Routes } from '@angular/router';
import { isMyProfileGuard } from '../../../../core/guards/is-my-profile.guard';

export const profileRoutes: Routes = [

    {
        path: '',
        loadComponent: () => import('./profile').then(c => c.Profile),
        children: [
            {
                path: 'user/:userId',
                loadComponent: () =>import('./pages/user-profile/ui/user-profile')
                .then((c) => c.UserProfile),
                },
                
                {
                canMatch : [isMyProfileGuard],
                path: 'user/:userId/update',
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

    }

]