import { Injectable, signal } from "@angular/core";

export interface SettingLink {
  id: string;
  label: string;
  route: string;}


@Injectable()
export class SettingsServices {

    links = signal<SettingLink[]>([
    { id: 'account', label: 'Account', route: '/public/settings/account' },
    { id: 'display', label: 'Display', route: '/public/settings/display'},
    { id: 'apps', label: 'Apps', route: '/public/settings/apps' },
    { id: 'privacy', label: 'Privacy & Security', route: '/public/settings/privacy'},
    ]
    )

}