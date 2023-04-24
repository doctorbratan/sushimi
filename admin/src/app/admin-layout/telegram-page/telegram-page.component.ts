import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlaceService } from 'src/app/services/place.service ';
import { TelegramService } from 'src/app/services/telegram.service';

@Component({
  selector: 'app-telegram-page',
  templateUrl: './telegram-page.component.html',
  styleUrls: ['./telegram-page.component.css']
})
export class TelegramPageComponent implements OnInit, OnDestroy {

  loading: boolean = false
  
  telegram$!: Subscription
  telegrams: any[] = []

  places$!: Subscription
  places: any[] = []

  callback$!: Subscription

  constructor(
    private telegramService: TelegramService,
    private placeSerivces: PlaceService
  ) { }

  ngOnInit(): void {
    this.loading = true

    setTimeout(() => {
      this.get()
    }, 2000);

    this.findPlaces()
  }

  ngOnDestroy(): void {
    if (this.telegram$) this.telegram$.unsubscribe()
    if (this.callback$) this.callback$.unsubscribe()
    if (this.places$) this.places$.unsubscribe()
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

  get() {
    this.loading = true

    this.telegram$ = this.telegramService.get().subscribe(
      (data) => {

        this.telegrams = data.map( (item: any) => {
          item.selected_place = undefined 
          return item
        })

        this.loading = false
      },
      error => {
        console.warn(error)
      }
    )
  }

  placeAdd(telegram: any) {
    const candidate = telegram.places.find( (place: any) => place._id === telegram.selected_place._id )

    if (!candidate) {

      const place = Object.assign({}, {
        _id: telegram.selected_place._id,
        name: telegram.selected_place.name
      })

      telegram.places.push(place)
    }

    telegram.selected_place = undefined

  }

  deletePlace(index: number, telegram: any) {
    telegram.places.splice(index, 1)
  }

  catch(telegram: any) {
    this.loading = true

    const data = {
      _id: telegram._id,
      name: telegram.name,
      places: telegram.places,
      alert: telegram.alert
    }

    this.callback$ = this.telegramService.catch(data).subscribe(
      (data) => {
        console.log(data)
        this.get()
      },
      error => console.warn(error)
    )
  }

  delete(_id: string) {
    this.loading = true

    this.callback$ = this.telegramService.delete(_id).subscribe(
      (data) => {
        console.log(data)
        this.get()
      },
      error => console.warn(error)
    )
  }

}
