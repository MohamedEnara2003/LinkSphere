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

  const isActionMethod = method === 'post' || method === 'put' || method === 'delete';
  const isNotVisitorsApi = !req.url.includes('visitors') && !req.url.includes('delete-temp-images');
  return next(req).pipe(
  tap((event) => {
  if(event instanceof HttpResponse &&  isActionMethod && isNotVisitorsApi){
  const res = event as HttpResponse<ApiResponse>;
  const messageDefault : string =  method === 'post' ? 'Created' : method === 'put' ?  'Updated' : 'Deleted'
  initAlert(
  'alert-success' ,
  res.body?.message || `${messageDefault} successfully`,
  1000
  )
  }
  }),
  catchError(({error} : HttpErrorResponse) => {
  if(method === 'post' || method === 'put' || method === 'delete') {
  initAlert('alert-warning' ,  error.message || 'Something went wrong' , 2000)
  }
  return throwError(() => error)
  })
  );
};
