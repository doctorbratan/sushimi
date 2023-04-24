import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PlaceService } from 'src/app/services/place.service ';
import { PositionService } from 'src/app/services/position.service';

@Component({
  selector: 'app-place-positions',
  templateUrl: './place-positions.component.html',
  styleUrls: ['./place-positions.component.css']
})
export class PlacePositionsComponent implements OnInit, OnDestroy {

  loading_places: boolean = false
  place_loading: boolean = false
  positions_loading: boolean = false

  response = {
    message: undefined as any,
    type: undefined as any
  }

  places$!: Subscription
  positions$!: Subscription
  callback$!: Subscription

  places: any[] = []
  selected_place: any
  
  all_positions: any[] = []

  selected_category: any
  selected_position: any
  search_text: any

  _id: any
  categories: any[] = [] as any
  positions: any[] = [] as any


  constructor(
    private placeService: PlaceService,
    private positionsService: PositionService
  ) { }

  ngOnInit(): void {
    this.findPlaces()
    this.findPositions()
  }

  ngOnDestroy(): void {
    if (this.places$) this.places$.unsubscribe()
    if (this.callback$) this.callback$.unsubscribe()
    if (this.positions$) this.positions$.unsubscribe()
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
      select: "categories positions"
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

  findPositions() {
    this.loading_places = true

    this.positions$ = this.positionsService.find({}).subscribe(
      (data) => {
        this.all_positions = data
        this.loading_places = false
      },
      error => {
        console.warn(error)
      }

    )
  }

  addPosition(data: any) {

    const candidate = this.positions.find( (position) => position._id === data._id )

    if (!candidate) {

      const position = Object.assign( {}, {
        display: true,
        imageSrc: data.imageSrc,
        _id: data._id,
        category: data.category,
        sub_category: data.sub_category,
        name: data.name,
        description: data.description,
        composition: data.composition,
        cost: data.cost,
        kit: data.kit,
        kits: data.kits,
        recomendations: data.recomendations,
        new_cost: undefined,
        salle: undefined,
        action: false,
        stop: false,
        order: 0
      })

      let new_index = undefined
      for (let index = 0; index < this.positions.length; index++) {
        const element = this.positions[index];

        if (element.category._id === position.category._id) {
          new_index = index + 1
        }
        
      }

      this.positions_loading = true

      if (new_index && new_index >= 0) {
        this.positions.splice(new_index, 0, position)
      } else {
        this.positions.push(position)
      }

      for (let index = 0; index < this.positions.length; index++) {
        const position = this.positions[index];
        position.order = index + 1
      }

      setTimeout(() => {
        this.positions_loading = false
      }, 500);

    
    }

    this.selected_position = undefined

  
  }


  // Утилиты
  unZip(data: any) {

    this._id = data._id
    this.categories = data.categories
    if (this.categories.length > 0) {
      this.selected_category = this.categories[0]
    }
    this.positions = data.positions.map( (item: any, index: number) => {
      item.order = index + 1
      return item
    })

  }

  Zip() {
    const data = {
      _id: this._id,
      positions: this.positions
    }

    return data
  }

  onCategoryChange() {
    this.LoadPositions()
    this.selected_position = undefined
    this.search_text = undefined
  }

  //Поменять Положение
  changePosition(arr: any[], old_order: number, new_order: number) {
    this.positions_loading = true

    old_order = old_order - 1
    new_order = new_order - 1

    if (new_order >= arr.length) {
      var k = new_order - arr.length + 1;
      while (k--) {
          arr.push(undefined);
      }
    }

    arr.splice(new_order, 0, arr.splice(old_order, 1)[0]);

    for (let index = 0; index < this.positions.length; index++) {
      const position = this.positions[index];
      position.order = index + 1
    }

    setTimeout(() => {
      this.positions_loading = false
    }, 1000);

  }

  manualChange(arr: any[], new_order: number, _id: string) {
    this.positions_loading = true

    if (new_order > 0 && new_order <= arr.length) {

      new_order = new_order - 1
      const old_index = arr.findIndex( (position: any) => position._id === _id  )

      if (new_order >= arr.length) {
        var k = new_order - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
      }
  
      arr.splice(new_order, 0, arr.splice(old_index, 1)[0]);
  
      for (let index = 0; index < this.positions.length; index++) {
        const position = this.positions[index];
        position.order = index + 1
      }

      setTimeout(() => {
        this.positions_loading = false
      }, 500);

    } else {

      for (let index = 0; index < this.positions.length; index++) {
        const position = this.positions[index];
        position.order = index + 1
      }

      alert("Введенно некорректное число!")

      setTimeout(() => {
        this.positions_loading = false
      }, 500);
    }

  }

  setMessage(message: any, type: boolean) {
    this.response.message = message
    this.response.type = type


    setTimeout(() => {
      this.response.message = undefined
    }, 2000);
  }

  //Удалить Позицию
  deletePosition(order: number) {
    this.positions_loading = true

    const index = order - 1
    this.positions.splice(index, 1)
    for (let index = 0; index < this.positions.length; index++) {
      const position = this.positions[index];
      position.order = index + 1
    }

    setTimeout(() => {
      this.positions_loading = false
    }, 1000);
  }

  LoadPositions() {
    this.positions_loading = true

    setTimeout(() => {
      this.positions_loading = false
    }, 700);
  }

}
