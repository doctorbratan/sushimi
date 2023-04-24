import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderService } from './services/order.service';
import { PlaceService } from './services/place.service ';
import { LocalService } from "./services/local.service";
import { ClientService } from './services/client.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./snow.css']
})
export class AppComponent implements OnInit, OnDestroy {

  places$!: Subscription
  client$!: Subscription

  constructor (
    private localService: LocalService,
    public orderService: OrderService,
    private placeService: PlaceService,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkUser()
    this.checkOrder()
    this.startPlaces()
    this.checkQuries()
  }

  ngOnDestroy(): void {
    if (this.places$) this.places$.unsubscribe()
    if (this.client$) this.client$.unsubscribe()
  }

  checkOrder() {
    const order = this.localService.getJsonValue('order');
    if (order) {
      this.orderService.order = JSON.parse(order)
    } else {
      localStorage.removeItem('order')
    }
  }

  checkUser() {
    const token = localStorage.getItem('user-token');
    if (token) {
      this.clientService.setToken(token)
      this.userToServer()

    }

    const user = this.localService.getJsonValue('user');
    if (user) {
      this.clientService.setUser(JSON.parse(user))
    } else {
      localStorage.removeItem('user')
    }
  }

  userToServer() {
    this.client$ = this.clientService.clientCheck().subscribe(
      (data) => {
        this.clientService.setUser(data)
      },
      error => {
        console.warn(error)
      }
    )
  }

 

  checkQuries() {
    const queirs = this.localService.getJsonValue('queirs')
    if (queirs) {
      this.orderService.unZipQuries(JSON.parse(queirs))
    }
  }


  startPlaces() {
    this.places$ = this.placeService.start().subscribe(
      (data) => {
        this.orderService.places = data

        if (!this.orderService.selected_place) {
          this.router.navigate(['/select-place'])
        }

      }
    )
  }

}
