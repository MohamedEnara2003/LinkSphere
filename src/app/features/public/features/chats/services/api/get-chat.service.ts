import { inject, Injectable } from '@angular/core';
import { AppChatsService } from '../app/app-chat.service';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { IChat, IMessage } from '../../../../../../core/models/chats.model';
import { ChatsStateService } from '../state/chats-state.service';
import { Author } from '../../../../../../core/models/user.model';

@Injectable()

export class GetChatService {
readonly #appChatsService = inject(AppChatsService);
readonly #chatsStateService = inject(ChatsStateService);


getUserChats(
userId : string,
page : number = 1,
limit : number = 12,
) : Observable<IMessage[] | null> {

return this.#appChatsService.singleTonApi.find<{data : {chat :IChat}}>
(`users/${userId}/chat?page=${page}&limit=${limit}`).pipe(
map(({data : {chat}}) => {

const userId = (this.#appChatsService.userProfile.user()?._id || '')
const messages = chat.messages.map((message) => {
const sender = chat.participants.find((u) => u._id === chat.createdBy)! as Author
return {
...message ,
sender,
isMyMessage : userId === chat.createdBy
}
})
return messages
}),
tap((chat) => {
this.#chatsStateService.updateGetUserChat(chat);
}),catchError(() => of(null))
)
}


}