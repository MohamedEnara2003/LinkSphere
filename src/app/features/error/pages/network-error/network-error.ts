import { Component } from '@angular/core';
import { ErrorOption } from '../../components/error-option';


@Component({
  selector: 'app-network-error',
  imports: [ErrorOption],
  template: `
  <section aria-label="Network Error Page" role="region" class="w-full">
  <app-error-option
  [status]="0"
  errorMsg="Network Error / Unknown Error"
  errorDesc="A connection error occurred. Please check your internet and try again"
  />
  </section>
  `,
})
export class NetworkError {

}
