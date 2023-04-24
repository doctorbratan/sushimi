import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { CityService } from 'src/app/services/city.service';
import { ClientService } from 'src/app/services/client.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit, OnDestroy {

  global_message: any

  pennding: boolean = false

  password_message: any
  old_password: any
  new_password: any
  repeat_password: any

  callback$!: Subscription

  cities: any[] = []
  cities$!: Subscription

  constructor(
    public clientService: ClientService,
    public orderService: OrderService,
    private cityService: CityService,
  ) { }

  ngOnInit(): void {
    window.scroll({top: 0, left: 0, behavior: 'smooth'})
    this.getCities()
  }

  ngOnDestroy(): void {
    if (this.callback$) this.callback$.unsubscribe()
    if (this.cities$) this.cities$.unsubscribe()
  }

  save() {
    this.pennding = true

    const data = {
      _id: this.clientService.user._id,
      name: this.clientService.user.name,
      city: this.clientService.user.city,
      street: this.clientService.user.street,
      place: this.clientService.user.place
    }

    this.callback$ = this.clientService.userSettings(data).subscribe(
      (data) => {
        this.clientService.setUser(data.user)
        this.pennding = false
        this.global_message = data.message
        setTimeout(() => {
          this.global_message = undefined
        }, 1500);
      },
      error => {
        this.global_message = error.error.message ? error.error.message : error
        this.pennding = false
        setTimeout(() => {
          this.global_message = undefined
        }, 1500);
      }

    )
  }


  change_password() {
    this.pennding = true

    const data = {
      old_password: this.old_password,
      new_password: this.new_password
    }

    this.callback$ = this.clientService.change_password(data).subscribe(
      (data) => {
        this.password_message = data.message
        setTimeout(() => {
          this.clientService.logout()
        }, 2000);
      },
      error => {
        this.password_message = error.error.message ? error.error.message : error
        setTimeout(() => {
          this.password_message = undefined
          this.pennding = false
        }, 2500);
      }
    )
  }

  getCities() {
    this.cities$ = this.cityService.get().subscribe(
      (data) => {
        this.cities = data
      },
      error => console.warn(error)
    )
  }

}
