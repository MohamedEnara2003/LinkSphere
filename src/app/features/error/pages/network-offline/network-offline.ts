import { Component } from '@angular/core';
import { ErrorOption } from '../../components/error-option';


@Component({
  selector: 'app-network-offline',
  imports: [ErrorOption],
  template: `
  <section aria-label="Network Offline Page" role="region" class="w-full">
  <app-error-option
  status="Offline"
  errorMsg="No Internet Connection"
  errorDesc="You are currently offline. Please check your network connection."
  />
  </section>
  `,
})
export class NetworkOffline {

}
