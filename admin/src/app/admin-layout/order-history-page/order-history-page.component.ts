import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { CityService } from 'src/app/services/city.service';
import { PlaceService } from 'src/app/services/place.service ';
import { StatisticService } from 'src/app/services/statistic.service';

@Component({
  selector: 'app-order-history-page',
  templateUrl: './order-history-page.component.html',
  styleUrls: ['./order-history-page.component.css']
})
export class OrderHistoryPageComponent implements OnInit, OnDestroy {

  places$!: Subscription
  places: any[] = []

  cities$!: Subscription
  cities: any[] = []

  date_start: any
  date_end: any
  place: any
  type: any
  city: any

  loading: boolean = false

  orders$!: Subscription
  orders!: any[]

  constructor(
    private placeSerivces: PlaceService,
    private cityService: CityService,
    private statisticService: StatisticService
  ) { }

  ngOnInit(): void {

 /*    const candidate = localStorage.getItem('orders')
    if (candidate) {
      this.orders = JSON.parse(candidate)
    } */

    this.findPlaces()
    this.findCities()
  }

  ngOnDestroy(): void {
    if (this.places$) this.places$.unsubscribe()
    if (this.cities$) this.cities$.unsubscribe()
    if (this.orders$) this.orders$.unsubscribe()
  }

  findOrders() {
    this.loading = true

    const data = {
      date_start: this.date_start,
      date_end: this.date_end,
      place: this.place,
      type: this.type,
      city: this.city
    }

    this.orders$ = this.statisticService.orderHistory(data).subscribe(
      (data) => {
        this.orders = data
        this.loading = false

        // localStorage.setItem('orders', JSON.stringify(this.orders))
      },
      error => console.warn(error)
    )

  }

  findPlaces() {

    const data = {
      select: "_id name"
    }

    this.places$ = this.placeSerivces.find(data).subscribe(
      (data) => {
        this.places = data
      },
      error => console.warn(error)
    )
  }

  findCities() {

    this.cities$ = this.cityService.get().subscribe(
      (data) => {
        this.cities = data
      },
      error => {
        console.warn(error)
      }
    )

  }

}
