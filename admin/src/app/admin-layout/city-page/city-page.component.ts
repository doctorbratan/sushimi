import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { CityService } from "../../services/city.service";

@Component({
  selector: 'app-city-page',
  templateUrl: './city-page.component.html',
  styleUrls: ['./city-page.component.css']
})

export class CityPageComponent implements OnInit, OnDestroy {

  pending: boolean = false
  loading: boolean = false

  response = 
  {
    message: undefined as any,
    type: undefined as any
  }

  callback$!: Subscription
  cities$!: Subscription

  cities!: any[]

  _id!: any
  name!: any


  constructor(
    private service: CityService
  ) { }

  ngOnInit(): void {
    this.get()
  }

  ngOnDestroy(): void {
    if (this.callback$) this.callback$.unsubscribe()
    if (this.cities$) this.cities$.unsubscribe()
  }

  sendMessage(data: any, type: boolean) {
    this.response.message = data
    this.response.type = type

    setTimeout(() => {
      this.response.message = undefined
    }, 2500);
  }

  get() {
    this.loading = true

    this.cities$ = this.service.get().subscribe(
      (data) => {
        this.cities = data
        this.loading = false
      },
      error => {
        console.warn(error)
      }
    )

  }

  catch() {
    this.pending = true

    this.callback$ = this.service.catch( this.Zip() ).subscribe(
      (data) => {
        this.sendMessage(data.message, true)
        this.get()
        this.clean()
        this.pending = false
      },
      error => {
        this.sendMessage(error.error.message, false)
        console.warn(error)
        this.pending = false
      }
    )

  }

  delete() {
    this.pending = true

    this.callback$ = this.service.delete(this._id).subscribe(
      (data) => {
        this.sendMessage(data.message, true)
        this.get()
        this.clean()
        this.pending = false
      },
      error => {
        this.sendMessage(error.error.message, false)
        console.warn(error)
        this.pending = false
      }
    )
  }

  Zip() {
    const data = {
      _id: this._id,
      name: this.name
    }
    return data
  }

  unZip(item: any) {
    this._id = item._id
    this.name = item.name
  }


  clean() {
    this._id = undefined
    this.name = undefined
  }

}

