import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CityService } from 'src/app/services/city.service';

import { ClientService } from 'src/app/services/client.service';



@Component({
  selector: 'app-user-edit',
  templateUrl: './client-page.component.html',
  styleUrls: ['./client-page.component.css']
})
export class ClientPageComponent implements OnInit, OnDestroy {

  loading: boolean = false
  pennding: boolean = false


  cities$!: Subscription
  cities: any[] = []

  find_phone: any
  find_city: any

  clients$!: Subscription
  clients!: any[]


  created: any
  _id: any
  phone: any
  access: any
  politic_agree: any
  name: any
  city: any
  street: any
  salle: any

  response_message: any
  callback$!: Subscription


  constructor(
    private clientService: ClientService,
    private cityService: CityService
  ) { }

  ngOnInit(): void {
    this.getCities()
  }

  ngOnDestroy(): void {
    if (this.clients$) this.clients$.unsubscribe()
    if (this.cities$) this.cities$.unsubscribe()
    if (this.callback$) this.callback$.unsubscribe()
  }

  catch() {
    this.pennding = true

    const client = this.zipClient()

    this.callback$ = this.clientService.catch(client).subscribe(
      (data) => {
        this.find()
        this.response_message = data.message
        this.unZipClient(data.client)
        this.pennding = false

        setTimeout(() => {
          this.response_message = undefined
        }, 2000);
      },
      error => {
        this.pennding = false
        this.response_message = error.error.message ? error.error.message : error
        setTimeout(() => {
          this.response_message = undefined
        }, 2000);
      }
    )

  }

  delete() {
    this.pennding = true

    this.callback$ = this.clientService.delete(this._id).subscribe(
      (data) => {
        this.response_message = data.message
        setTimeout(() => {
          this.response_message = undefined
          this.clean()
          this.find()
          this.pennding = false
        }, 2000);
      },
      error => {
        this.pennding = false
        this.response_message = error.error.message ? error.error.message : error
        setTimeout(() => {
          this.response_message = undefined
        }, 2000);
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

  find() {
    this.loading = true

    const data = {
      phone: this.find_phone,
      city: this.find_city
    }

    this.clients$ = this.clientService.find(data).subscribe(
      (data) => {
        this.clients = data
        this.loading = false
      },
      error => {
        console.warn(error)
      }
    )
  }

  zipClient() {
    const user = {
      _id: this._id,
      access: this.access,
      salle: this.salle,
      phone: this.phone
    }

    return user
  }

  unZipClient(client: any) {
    this.created = client.created
    this._id = client._id
    this.phone = client.phone
    this.access = client.access
    this.politic_agree = client.politic_agree
    this.name = client.name
    this.city = client.city
    this.street = client.street
    this.salle = client.salle
  }

  clean() {
    this.created = undefined
    this._id = undefined
    this.phone = undefined
    this.access = true
    this.politic_agree = undefined
    this.name = undefined
    this.city = undefined
    this.street = undefined
    this.salle = undefined
  }

}