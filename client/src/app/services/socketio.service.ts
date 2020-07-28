import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket;
  commentsUpdated = new Subject();
  // TODO: this usually goes into env variables
  private baseURL = "http://localhost:3000"

  constructor() {
    this.socket = io(this.baseURL);
    // listen on comments update from server
    this.socket.on('comments-updated', (data: string) => {
      this.commentsUpdated.next();
    });
  }

}
