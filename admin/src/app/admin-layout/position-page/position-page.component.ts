import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { CategoryService } from "../../services/category.service";
import { PositionService } from "../../services/position.service";

@Component({
  selector: 'app-position-page',
  templateUrl: './position-page.component.html',
  styleUrls: ['./position-page.component.css']
})
export class PositionPageComponent implements OnInit, OnDestroy {

  @ViewChild('input') inputRef!: ElementRef

  loading: boolean = false
  pennding: boolean = false
  response = 
  {
    message: undefined as any,
    type: undefined as any
  }

  categories$!: Subscription
  categories!: any[]
  sub_categories: any[] = []

  _id: any

  image: any
  imageSrc: any = "/uploads/placeholder.png"

  category: any = undefined
  sub_category: any = undefined
  kit: boolean = false
  
  name: any
  description: any = ""
  cost!: number
  change_cost: boolean = true

  composition: string[] = []

  kits: any[] = []
  recomendations: any[] = []


  callback$!: Subscription
  positions$!: Subscription

  positions!: any[]

  search_category!: any
  search_name!: any

  constructor(
    private categoryService: CategoryService,
    private positionService: PositionService
  ) { }

  ngOnInit(): void {
    this.getCategories()
  }

  ngOnDestroy(): void {
    if (this.positions$) this.positions$.unsubscribe()
    if (this.categories$) this.categories$.unsubscribe()
    if (this.callback$) this.callback$.unsubscribe()
  }

// Поиск всех Позиций
  find() {
    
    this.loading = true


    this.positions$ = this.positionService.find({}).subscribe(
      (data) => {
        this.positions = data
        this.loading = false
      },
      error => {
        this.loading = false
        console.warn(error)
      }
    )

  }
// Поиск всех Позиций

// Конеченое Редактирвоание
  catch() {

    this.pennding = true

    this.callback$ = this.positionService.catch( this.zipPosition() ).subscribe(
      (data: any) => {
        this.sendMessage(data.message, true)
        this.clean()
        this.pennding = false
        this.find()
      },
      error => {
        this.sendMessage(error.error.message, false)
        this.pennding = false
      }
    )

  }

  delete() {
    this.pennding = true

    this.callback$ = this.positionService.delete(this._id).subscribe(
      (data) => {
        this.sendMessage(data.message, true)
        this.find()
        this.clean()
        this.pennding = false
      },
      error => {
        this.sendMessage(error.error.message, false)
        console.warn(error)
        this.pennding = false
      }
    )
  }
// Конеченое Редактирвоание

//Управление Конструктором
addToConstructor() {

  const obj = {
    name: "Введите Название",
    required: true,
    single: true,
    options: []
  }

  this.kits.push(obj)

}


addOption( kit_index: number ) {
  const obj = {
    name: "",
    cost: 0
  }

  this.kits[kit_index].options.push(obj)

}


// Управление Составом
addToComposition() {
  this.composition.push("Новый компонент!")
}

trackByIdx(index: number, obj: any): any {
  return index;
}
// Управление Составом

// Утилиты

sendMessage(data: any, type: boolean) {
  this.response.message = data
  this.response.type = type

  setTimeout(() => {
    this.response.message = undefined
  }, 2500);
}

deleteFromArray(arr: any[], index: number ) {
  arr.splice(index, 1)
}

zipPosition() {

  const data = {
    _id: this._id,
    category: this.category,
    sub_category: this.sub_category,
    name: this.name,
    description: this.description,
    composition: this.composition,
    cost: this.cost,
    change_cost: this.change_cost,
    kit: this.kit,
    kits: this.kits,
    recomendations: this.recomendations,
    imageSrc: this.imageSrc,
    image: this.image
  }

  return data

}

unZipPosition(data: any) {
  this._id = data._id
  this.imageSrc = data.imageSrc

  this.category = data.category
  this.sub_category = data.sub_category
  this.kit = data.kit

  this.name = data.name
  this.description = data.description
  this.cost = data.cost

  this.composition = data.composition

  this.kits = data.kits
  this.recomendations = data.recomendations,


  this.change_cost = true

  window.scroll({top: 0, left: 0, behavior: 'smooth'})

}

clean() {
  this._id = undefined
  this.category = undefined
  this.sub_category = undefined
  this.name = undefined
  this.description = ""
  this.imageSrc = "/uploads/placeholder.png"
  this.cost = undefined!
  this.change_cost = true

  this.kit = false

  this.composition = []
  this.kits = []
  this.recomendations = []

  this.image = undefined
}



addRecomedation(data: any) {

  const position = Object.assign( {}, {
    _id: data._id,
    category: data.category.name,
    name: data.name
  })

  const candidate = this.recomendations.find( (item) => item._id === position._id )

  if (!candidate) {
    this.recomendations.push(position)
  }

}

deleteRecomedation(index: number) {
  this.recomendations.splice(index, 1)
}



// Работа с Картинкой
  triggerClick() {
    this.inputRef.nativeElement.click()
  }

  onFileUpload(event: any) {
    const file = event.target.files[0]
    this.image = file

    const reader = new FileReader()

    reader.onload = () => {
      this.imageSrc = reader.result
    }

    reader.readAsDataURL(file)
  }


  // Работа с Категориями
  getCategories() {

    this.categories$ = this.categoryService.get().subscribe(
      (data) => {
        
        this.categories = data.map( (category) => {

          const obj = {
            _id: category._id,
            name: category.name
          }

          return obj

        })

        this.search_category = this.categories[0]._id
        this.find()

        data.forEach(category => {

          if (category.sub_categories && category.sub_categories.length > 0) {

            category.sub_categories.forEach( (element: any) => {

              const obj = {
                category_id: category._id,
                _id: element._id,
                name: element.name
              }

              this.sub_categories.push(obj)
            });

          }

        });

      
      },
      error => {
        console.warn(error)
      }

    )
  }

}

