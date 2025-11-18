import { Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertService } from './core/services/alert.service';
import { messageAlert } from "./shared/components/message-alert/message-alert";
import { LanguageService } from './core/services/translations/language.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, messageAlert],
  template : `

  <main class="bg-light dark:bg-dark ">
    
  <!-- Alert And confirm Popup -->
  @if(alertService.alertOption().length > 0){
  <nav role="navigation"
  class="w-full fixed top-2 left-0  z-[100] flex flex-col items-center  sm:items-end gap-2 p-5 sm:px-8">
  @for (alert of alertService.alertOption(); track alert.id) {
  <app-message-alert class="w-[95%] sm:w-100" [alertOption]="alert"/>
  }
  </nav>
  }
  
  <router-outlet/>
  </main>
  `
})
export class App {
  readonly alertService = inject(AlertService);
  private readonly languageService = inject(LanguageService);


  constructor(){
  this.languageService.initSetDefaultLanguage();
  }
}
