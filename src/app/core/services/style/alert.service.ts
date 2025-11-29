import { Injectable, signal } from '@angular/core';

export interface AlertOption  {
  id : number ,
  isLoad : boolean,
  isLoadTime : number,
  alertMessage : string,
  alertType : 'alert-success' | 'alert-error' | 'alert-warning' | null,
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  alertOption = signal<AlertOption[]>([]);
}
