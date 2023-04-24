import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PlaceService } from 'src/app/services/place.service ';

@Component({
  selector: 'app-place-edit',
  templateUrl: './place-edit.component.html',
  styleUrls: ['./place-edit.component.css']
})
export class PlaceEditComponent implements OnInit, OnDestroy {

  loading: boolean = false
  pennding: boolean = false

  callback$!: Subscription

  places$!: Subscription
  places!: any[]


  _id!: string
  name!: string
  address!: string
  phone!: string
  map!: string
  hour_start!: string
  hour_end!: string
  rests: any[] = []
  display: boolean = true

  constructor(
    private placeService: PlaceService,
  ) { }

  ngOnInit(): void {
    this.getPlaces()
  }

  ngOnDestroy(): void {
    if (this.callback$) this.callback$.unsubscribe()
    if (this.places$) this.places$.unsubscribe()
  }

getPlaces() {
  this.loading = true

  this.places = undefined!

  const select = "name address phone map hour_start hour_end rests display"
  this.places$ = this.placeService.find({select}).subscribe(
    (data) => {

      this.places = data

      const place = {
        _id: undefined,
        name: "Новая Точка",
        display: true,
        address: undefined,
        phone: undefined,
        map: undefined,
        hour_start: undefined,
        hour_end: undefined,
        rests: []
      }

      this.places.push(place)
      
      if (this._id) {
        const candidate = this.places.find( (place) => place._id === this._id )
        this.UnZipPlace(candidate)
      } else {
        this.UnZipPlace(this.places[0])
      }

      this.loading = false
    },
    error => {
      console.warn(error)
      this.loading = false
    }
  )
}



UnZipPlace(item: any) {
  this._id = item._id!
  this.display = item.display
  this.name = item.name
  this.address = item.address
  this.phone = item.phone
  this.map = item.map
  this.hour_start = item.hour_start
  this.hour_end = item.hour_end
  this.rests = item.rests
}

ZipPlace() {
  const data = {
    _id: this._id,
    display: this.display,
    name: this.name,
    address: this.address,
    phone : this.phone,
    map: this.map,
    hour_start: this.hour_start,
    hour_end: this.hour_end,
    rests: this.rests
  }

  return data
}


// Робота с Выходыми
removeRest(i: number) {
  this.rests.splice(i, 1)
}

trackByIdx(index: number, obj: any): any {
  return index;
}

pushRest() {
  this.rests.push(undefined)
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


catch() {
    this.loading = true

    this.callback$ = this.placeService.catch( this.ZipPlace() ).subscribe(
      (data) => {
        this.getPlaces()
      },
      error => {
        console.warn(error)
      }
    )
  }

  delete() {
    this.loading = true

    this.callback$ = this.placeService.delete(this._id).subscribe(
      (data) => {
        this.getPlaces()
      },
      error => {
        console.warn(error)
      }
    )
  }

 
}
 