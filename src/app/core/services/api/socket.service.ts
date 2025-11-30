import { inject, Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { io, Socket } from 'socket.io-client';
import { StorageService } from '../storage/locale-storage.service';
import { AuthToken } from '../../models/auth.model';
import { DomService } from '../document/dom.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
    readonly #storageService = inject(StorageService);
    readonly #domService = inject(DomService);
    #socket!: Socket;


  constructor() {
  if(this.#domService.isBrowser()) {
  this.#initSocket()
  }
  }

  #initSocket(): void {
  const {access_token} = this.#storageService.getItem<AuthToken>('auth')!;
  const auth =  { auth: { authorization: `Bearer ${access_token}` }}

  this.#socket = io(environment.apiUrl, auth);
  this.#socket.on('connect_error', (err: any) => {
  console.error('Socket Connect Error' , err);

  this.disconnect()
    
    });
  }


  on<T = unknown>(event: string): Observable<T> {
    return fromEvent<T>(this.#socket, event);
  }

  // Emit messages
  emit<T = unknown>(event: string, data?: T, callback?: (response: any) => void) {
    this.#socket.emit(event, data, callback);
  }


  disconnect() {
    if (this.#socket) {
      this.#socket.disconnect();
    }
  }
  
}
