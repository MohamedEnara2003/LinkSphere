import { Component,  effect,  inject, input } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { AlertOption, AlertService } from '../../../core/services/alert.service';


@Component({
  selector: 'app-message-alert',
  imports: [SharedModule],
  template: `
  <article aria-label="Model Alert"  role="alert" aria-modal="true" 
  class="w-full  h-15  alert flex justify-between items-center animate-down z-[100]"
  [ngClass]="alertOption()?.alertType || 'alert-success'">

  <p class="flex  items-center gap-2"> 

  <span class="text-dark/50">
  @switch(alertOption()?.alertType){
  @case ('alert-success') {
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
    </svg>
  }
  @case ('alert-error') {
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
  </svg>
  }
  @case ('alert-warning') {
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </svg>
  }
  }
  </span>

  <span aria-label="Alert Message" role="alert" class="sm:text-lg font-semibold text-dark">
    {{alertOption()?.alertMessage }}
  </span>
  </p>

  <button  (click)="removeAlert(alertOption()?.id ||  1)"
  type="button" role="button" aria-label="Button Close Model"
  class=" btn btn-sm md:btn-sm btn-circle border-transparent  text-dark bg-light">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
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
