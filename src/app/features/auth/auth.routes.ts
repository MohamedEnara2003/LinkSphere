import { Routes } from '@angular/router';


export const authRoutes: Routes = [
  

  {path : 'register', 
  loadComponent : () => import('../auth/pages/register/register').then((c) => c.Register)
  },
  {path : 'login'   , 
  loadComponent : () => import('../auth/pages/login/login').then((c) => c.Login)
  },
  {path : 'verify-otp'   ,
  loadComponent : () => import('../auth/pages/verify-otp/verify-otp').then((c) => c.VerifyOTP)
  },

{path : '' , redirectTo : 'register', pathMatch :'full'},
{path : '**' , redirectTo : '', pathMatch :'full'},
  
];
