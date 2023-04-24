import { Injectable } from '@angular/core';
import {io} from 'socket.io-client';
import { isDevMode } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {


  constructor() {  }

  listen(Eventname : string){

    let link = ""

    if ( isDevMode() ) {
      // link = "192.168.0.15:3000"
      // link = "192.168.1.11:3000"
      link = "192.168.100.119:3000"
      // link = "192.168.100.89:3000"
      // link = "localhost:3000"
    } else {
      link = "https://sushimi.herokuapp.com/"
    }

    return new Observable((subscriber)=>{
        io(link).on(Eventname,(data: any )=>{
            subscriber.next(data);
        })
    })
}
}
