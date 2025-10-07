import { Component,  effect,  inject, input } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { AlertOption, AlertService } from '../../../core/services/alert.service';


@Component({
  selector: 'app-message-alert',
  imports: [SharedModule],
  template: `
  <article aria-label="Model Alert"  role="alert" aria-modal="true" 
  class="w-full  h-15  alert flex justify-between items-center animate-down"
  [ngClass]="alertOption()?.alertType || 'alert-success'">

  <p class="flex  items-center gap-2"> 
  <span class="material-icons">
  {{
  alertOption()?.alertType === 'alert-success' ? 'check_circle' :
  alertOption()?.alertType === 'alert-error' ? 'error' : 'warning'
  }}
  </span>
  <span aria-label="Alert Message" role="alert" class="sm:text-lg font-semibold">
    {{alertOption()?.alertMessage }}
  </span>
  </p>

  <button  (click)="removeAlert(alertOption()?.id ||  1)"
  type="button" role="button" aria-label="Button Close Model"
  class=" btn btn-sm md:btn-md btn-circle  text-dark bg-light">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8">
  <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
  </svg>
  </button>

  </article>
  `,
})  
export class messageAlert {
  readonly alertService = inject(AlertService);

  alertOption = input<AlertOption>()

  constructor(){
  effect(() => {
    if(this.alertOption()?.isLoad){
    setTimeout(() => {
    this.removeAlert(this.alertOption()?.id || 1)
    },this.alertOption()?.isLoadTime);
    }
  })
  }

  removeAlert(alertId : number) : void {
  this.alertService.alertOption.update((prev) => prev.filter(({id}) => id !== alertId))
  }
}
