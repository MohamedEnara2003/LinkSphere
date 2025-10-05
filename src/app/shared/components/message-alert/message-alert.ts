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
    {{'alerts.' + alertOption()?.alertMessage | translate}}
  </span>
  </p>
  <button (click)="removeAlert(alertOption()?.id ||  1)" type="button" role="button" aria-label="Button Close Model"
  class="material-icons btn btn-sm md:btn-md btn-circle">
    close
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
