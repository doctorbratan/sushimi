import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PlaceService } from 'src/app/services/place.service ';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-place-categories',
  templateUrl: './place-categories.component.html',
  styleUrls: ['./place-categories.component.css']
})
export class PlaceCategoriesComponent implements OnInit , OnDestroy {

  loading: boolean = false
  pennding: boolean = false
  place_loading: boolean = false
  response = {
    message: undefined as any,
    type: undefined as any
  }

  places$!: Subscription
  categories$!: Subscription
  callback$!: Subscription

  places!: any[]
  selected_place!: any

  all_categories!: any[]
  selected_category: any

  _id!: any
  categories: any[] = []
  name: any

  constructor(
    private placeService: PlaceService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.findPlaces()
    this.findCategories()
  }

  ngOnDestroy(): void {
    if (this.places$) this.places$.unsubscribe()
    if (this.categories$) this.categories$.unsubscribe()
    if (this.callback$) this.callback$.unsubscribe()
  }

  findPlaces() {
    this.loading = true

    const select = "categories name"
    this.places$ = this.placeService.find({select}).subscribe(
      (data)  => {
        this.places = data

        if (this.places.length > 0) {

          if (!this.selected_place) {
            this.selected_place = this.places[0]
          }

          this.findPlace()
          
        }
        this.loading = false
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
      select: "categories"
    }

    this.places$ = this.placeService.findOne(data).subscribe(
      (data) => {
        this.unZipPlace(data)
        this.place_loading = false
      },
      error => {
        console.warn(error)
      }
    )
  }

  findCategories() {
    this.loading = true

    this.categories$ = this.categoryService.get().subscribe(
      (data)  => {
        this.all_categories = data
        this.loading = false
      },
      error => {
        console.warn(error)
      }
    )
  }

  onPlaceChange(data: any) {
    this.load_place()
    this.selected_category = undefined
    this.unZipPlace(this.places[+data])
  }

  // Добавить Категорию
  addCategory() {
    
    const candidate = this.categories.find( (category) => category._id === this.selected_category._id )

    if (!candidate) {

      const category = Object.assign( {}, {
        display: true,
        _id: this.selected_category._id,
        name: this.selected_category.name,
        sub_categories: [] as any
      })

      for (let item of this.selected_category.sub_categories) {

        const sub_category = Object.assign( {}, {
          display: true,
          _id: item._id,
          name: item.name
        })

        category.sub_categories.push(sub_category)
      }

      this.categories.push(category)

    }

    this.selected_category = undefined
    this.load_place()

  }

  remove(index: number, array: any[]) {
    this.load_place()
    array.splice(index, 1)
  }

  //Поменять Положение
changePosition(arr: any[], old_index: number, new_index: number) {

  this.load_place()

  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
        arr.push(undefined);
    }
  }

  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);

}


  //Утилиты
  ZipPlace() {
    const data = {
      _id: this._id,
      categories: this.categories
    }

    return data
  }

  unZipPlace(data: any) {
    this._id = data._id!
    this.categories = data.categories
  }

  load_place() {
    this.place_loading = true

    setTimeout(() => {
      this.place_loading = false
    }, 1000);
  }

  setMessage(message: any, type: boolean) {
    this.response.message = message
    this.response.type = type


    setTimeout(() => {
      this.response.message = undefined
    }, 2000);
  }

  // Обновить точку
  catch() {

    this.pennding = true

    this.callback$ = this.placeService.catch( this.ZipPlace() ).subscribe(
      (data)  => {
        this.setMessage(data.message, true)
        this.loading = false
        this.findPlace()
      },
      error => {
        this.setMessage( error.error.message ? error.error.message : error , false )
        console.warn(error)
      }
    )

  }


}
