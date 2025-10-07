import { Injectable, signal } from "@angular/core";

export interface SettingLink {
  id: string;
  label: string;
  route: string;}


@Injectable()
export class SettingsServices {

    links = signal<SettingLink[]>([
    { id: 'account', label: 'settings.account.title', route: '/public/settings/account' },
    { id: 'display', label: 'settings.display.title', route: '/public/settings/display'},
    { id: 'log-out', label: 'settings.logout.title', route: '/public/settings/log-out'},
    ]
    )

}