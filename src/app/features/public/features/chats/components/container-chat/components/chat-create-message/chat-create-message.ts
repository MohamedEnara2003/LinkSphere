import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgControl } from "../../../../../../../../shared/components/ng-control/ng-control.";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-chat-create-message',
  imports: [ReactiveFormsModule, NgControl, TranslateModule],
  template: `
    <form 
      [formGroup]="messageForm"
      (ngSubmit)="onSendMessage()"
      class="w-full flex justify-between items-center gap-2 p-3 border-t border-brand-color/50  "
      role="form"
      aria-label="Create new chat message"
    >

      <!-- Input -->
      <label for="chat-message-input" class="sr-only ">{{ 'chats.type_message' | translate }}</label>
      <app-ng-control 
      [option]="{
      type : 'text' ,
      formControlName : 'message' ,
      id : 'message' ,
      name : 'message' ,
      placeHolder : ('chats.write_message' | translate) ,
      inputClass : 'w-full input input-neutral   bg-dark '
      }"
      [form]="messageForm"
      [isShowValidationsError]="false"
      class="w-full"/>

      <!-- Send Button -->
      <button
        type="submit"
        [disabled]="messageForm.invalid"
        class="ngBtn"
        [attr.aria-label]="'chats.send_message' | translate"
      >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>

    </button>
    </form>
  `
})
export class ChatCreateMessageComponent {
  messageForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.messageForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  onSendMessage() {
    if (this.messageForm.valid) {
      const msg = this.messageForm.value.message.trim();
      if (!msg) return;

      console.log('Message sent:', msg);

      // Reset the form
      this.messageForm.reset();
    }
  }
}
