import { Injectable } from '@angular/core';
import { from, fromEvent, Observable, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  #socket!: Socket;

  #initSocket(): Observable<any> {
    if (this.#socket) {
      return from([this.#socket]); 
    }

    return from(import('socket.io-client')).pipe(
      switchMap(({ io }) => {
        this.#socket = io(environment.apiUrl, {
          transports: ['websocket'],
        });
        return from([this.#socket]);
      }),
      takeUntilDestroyed()
    );
  }

  emit(event: string, data?: any) {
    this.#initSocket().subscribe(socket => {
      socket.emit(event, data);
    });
  }

  listen<T>(event: string): Observable<T> {
    return this.#initSocket().pipe(
      switchMap(socket => fromEvent<T>(socket, event))
    );
  }

  disconnect() {
    if (this.#socket) {
      this.#socket.disconnect();
    }
  }
  
}
