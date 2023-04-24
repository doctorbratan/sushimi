import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PlaceService } from 'src/app/services/place.service ';
import { CityService } from 'src/app/services/city.service';

@Component({
  selector: 'app-place-cities',
  templateUrl: './place-cities.component.html',
  styleUrls: ['./place-cities.component.css']
})
export class PlaceCitiesComponent implements OnInit, OnDestroy {

  loading_places: boolean = false
  place_loading: boolean = false
  loading: boolean = false

  response = {
    message: undefined as any,
    type: undefined as any
  }

  places$!: Subscription
  cities$!: Subscription
  callback$!: Subscription

  places: any[] = []
  selected_place: any

  all_cities: any[] = []
  selected_city: any

  _id: any
  cities: any[] = [] as any


  constructor(
    private placeService: PlaceService,
    private citiesSerivce: CityService
  ) { }

  ngOnInit(): void {
    this.findPlaces()
    this.findCities()
  }

  ngOnDestroy(): void {
    if (this.places$) this.places$.unsubscribe()
    if (this.callback$) this.callback$.unsubscribe()
    if (this.cities$) this.cities$.unsubscribe()
  }

  catch() {
    this.place_loading = true

    this.callback$ = this.placeService.catch( this.Zip() ).subscribe(
      (data) => {
        this.setMessage(data.message, true)
        this.findPlace()
      },
      error => {
        this.setMessage( error.error.message ? error.error.message : error , false )
        console.warn(error)
      }
    )
  }

  findPlaces() {
    this.loading_places = true

    const select = "name"
    this.places$ = this.placeService.find({select}).subscribe(
      (data)  => {
        this.places = data
        this.selected_place = this.places[0]
        setTimeout(() => {
          this.loading_places = false
          this.findPlace()
        }, 1000);
      },
      error => {
        console.warn(error)
      }
    )
  }

  findPlace() {
    this.place_loading = true

    const data = {
      query: { _id: this.selected_place._id },
      select: "cities"
    }

    this.places$ = this.placeService.findOne(data).subscribe(
      (data) => {
        this.unZip(data)
        this.place_loading = false
      },
      error => {
        console.warn(error)
      }
    )
  }

  findCities() {
    this.loading_places = true

    this.cities$ = this.citiesSerivce.get().subscribe(
      (data) => {
        this.all_cities = data
        this.loading_places = false
      },
      error => {
        console.warn(error)
      }

    )
  }

  addCity(data: any) {

    const candidate = this.cities.find( (city) => city._id === data._id )

    if (!candidate) {

      const city = Object.assign( {}, {
        display: true,
        _id: data._id,
        name: data.name,
        cost: 0
      }) 

      this.cities.push(city)

    }

    this.selected_city = undefined


  }

   // Утилиты
   unZip(data: any) {

    this._id = data._id
    this.cities = data.cities

  }

  Zip() {
    const data = {
      _id: this._id,
      cities: this.cities
    }

    return data
  }

  //Поменять Положение
  changePosition(arr: any[], old_index: number, new_index: number) {

    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
          arr.push(undefined);
      }
    }

    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);

  }

    //Удалить Город
    deleteCity(index: number) {
      this.cities.splice(index, 1)
    }

    setMessage(message: any, type: boolean) {
      this.response.message = message
      this.response.type = type
  
  
      setTimeout(() => {
        this.response.message = undefined
      }, 2000);
    }



}
