import { Component, inject, OnInit } from '@angular/core';
import { ChatSidebarComponent } from "../components/chat-sidebar/chat-sidebar";
import { ChatContainer } from "../components/container-chat/ui/container-chat";
import { MetaService } from '../../../../../core/services/meta/meta.service';


@Component({
  selector: 'app-chats',
  imports: [ChatSidebarComponent, ChatContainer],
  template: `
  <section class="w-full grid grid-cols-1  md:grid-cols-3 md:px-2 md:gap-5">
  <app-chat-sidebar   class="w-full h-svh sticky top-0 col-span-1 md:col-span-1 hidden md:inline-block"/>
  <app-chat-container class="w-full col-span-1 md:col-span-2 "  />
  </section>
  `,

})
export class Chats implements OnInit {
  readonly #metaService = inject(MetaService);

  ngOnInit() {
    this.#metaService.setMeta({
      title: 'Chats | Link Sphere Social',
      description: 'Send and receive messages with your friends on Link Sphere Social. Stay connected in real-time.',
      image: '',
      url: 'chats'
    });
  }

}
