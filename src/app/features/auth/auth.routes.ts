import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
  path: '',
  loadComponent: () => import('./auth').then(c => c.Authentication),
  children: [
    {path : 'register', 
      loadComponent : () => import('./pages/register/register').then((c) => c.Register)
      },
      {path : 'login'   , 
      loadComponent : () => import('./pages/login/login').then((c) => c.Login)
      },
    
      {path : 'confirm-email'   ,
      loadComponent : () => import('./pages/confirm-email/confirm-email').then((c) => c.confirmEmail)
      },
    
      {path : 'forget-password'   ,
      loadComponent : () => import('./pages/forget-password/forget-password')
      .then((c) => c.ForgetPassword)
      },
      
      {path : 'change-forget-password'   ,
      loadComponent : () => import('./pages/change-forget-password/change-forget-password')
      .then((c) => c.changeForgetPassword)
      },
      {path : '' , redirectTo : 'register', pathMatch :'full'},
      {path : '**' , redirectTo : '', pathMatch :'full'},
  ],
},
];

