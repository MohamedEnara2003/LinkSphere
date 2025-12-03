import { Component,  } from '@angular/core';
import { SharedModule } from '../../../../../../shared/modules/shared.module';

@Component({
    selector: 'app-notifications-settings',
    imports : [SharedModule],
    template : `
    <article class="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8" role="region" 
    aria-labelledby="notifications-settings-heading">

    <header class="mb-6 border-b border-brand-color/10 pb-3">
    <h1 id="account-settings-heading" class="text-2xl md:text-3xl font-bold">
    {{ 'settings.notifications.title' | translate }}
    </h1>
    <p class="text-sm text-gray-400">{{ 'settings.notifications.subtitle' | translate }}</p>
    </header>


    
    </article>
    `
})
export class NotificationSettings{

}
