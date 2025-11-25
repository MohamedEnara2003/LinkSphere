import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { AlertOption, AlertService } from '../services/alert.service';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';

interface ApiResponse {
  message?: string;
  [key: string]: unknown; 
}

export const MessageAlertInterceptor: HttpInterceptorFn = (req, next) => {
  const alertService = inject(AlertService)

  const method = req.method.toLowerCase();

  const initAlert = (status : 'alert-success' | 'alert-warning' , message : string , time : number) => {
  const ids = alertService.alertOption().map(({ id }) => id ?? 0);
  const maxId = ids.length > 0 ? Math.max(...ids) : 0;
  const newAlert : AlertOption = {
  id : maxId + 1 ,
  isLoad : true ,
  isLoadTime : time ,
  alertMessage : message ,
  alertType : status
  }

  alertService.alertOption.set([...alertService.alertOption() , newAlert]);
  }

  const isActionMethod = 
  method === 'post' || method === 'put' || method === 'patch'  || method === 'delete';


  return next(req).pipe(
  tap((event) => {
  if(event instanceof HttpResponse &&  isActionMethod ){
  const res = event as HttpResponse<ApiResponse>;
  const messageDefault : string =  method === 'post' ? 'Created' :( method === 'put' || method === 'patch'
  ) ?  'Updated' : 'Deleted';


  if(req.url.includes('like')) return ;

  initAlert(
  'alert-success' ,
  res.body?.message || `${messageDefault} successfully`,
  2000
  )

  }
  }),
  catchError(({error} : HttpErrorResponse) => {
  const backendError = error as { name?: string; error_message?: string } | null;

  const errorMessage = (backendError?.error_message || '').toLowerCase();

  if(method === 'post' || method === 'put' || method === 'delete' || method === 'patch') {

  const unMessages = [
  "no matched request",
  ];


  const message = 
  ((errorMessage.length <= 40 ) ? errorMessage : '' ) 
  || 'Something went wrong';

  if(!unMessages.includes(message)){
  initAlert('alert-warning' ,  message , 3000)
  }

  }

  return throwError(() => error)
  })
  );
};
