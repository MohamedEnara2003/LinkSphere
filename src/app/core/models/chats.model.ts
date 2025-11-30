import { Author } from "./user.model";
export type IChatType = "ovo" | "group" ;

export interface IMessage {
    sender: Author;
    isMyMessage: boolean;
    _id: string;
    content: string;
    createdBy: string;
    seen: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface IParticipant extends Author{}

export interface IChat {
_id: string;
participants: IParticipant[];
createdBy: string;
messages: IMessage[];
createdAt: string;
updatedAt: string;
__v: number;
}


export interface ICreateMessage {
    content: string ,
    sendTo : string,
}
