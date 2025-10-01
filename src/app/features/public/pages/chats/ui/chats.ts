import { Component } from '@angular/core';
import { ChatSidebarComponent } from "../components/chat-sidebar/chat-sidebar";
import { ChatContainer } from "../components/container-chat/ui/container-chat";


@Component({
  selector: 'app-chats',
  imports: [ChatSidebarComponent, ChatContainer],
  template: `
  <section class="w-full grid grid-cols-1  md:grid-cols-3 md:px-2 md:gap-5">
  <app-chat-sidebar   class="w-full col-span-1 md:col-span-1"/>

  <app-chat-container class="w-full col-span-1 md:col-span-2 "  />
  </section>
  `,

})
export class Chats {

}
