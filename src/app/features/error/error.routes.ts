import { Routes } from '@angular/router';



export const errorRoutes: Routes = [
 
        {path : 'not-found' , loadComponent : () => import('./pages/not-found/not-found')
        .then((c) => c.NotFound)
        },
        {path : 'network' , loadComponent : () => import('./pages/network-error/network-error')
        .then((c) => c.NetworkError)
        },
        {path : 'offline' , loadComponent : () => import('./pages/network-offline/network-offline')
        .then((c) => c.NetworkOffline)
        },
        {path : 'server' , loadComponent : () => import('./pages/server-error/server-error')
        .then((c) => c.ServerError)
        },

        {path : '' ,  redirectTo : '/error/not-found' , pathMatch :'full'},
        {path : '**' , redirectTo : '/error/not-found' , pathMatch :'full'}

];
