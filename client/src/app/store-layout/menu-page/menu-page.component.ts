import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ClientService } from 'src/app/services/client.service';
import { OrderService } from 'src/app/services/order.service';
import { PlaceService } from 'src/app/services/place.service ';

@Component({
  selector: 'app-menu-page',
  templateUrl: './menu-page.component.html',
  styleUrls: ['./menu-page.component.css']
})
export class MenuPageComponent implements OnInit, OnDestroy {
  menu$!: Subscription
  callback$!: Subscription

  pennding: boolean = false

  categories: any[] = []
  positions: any[] = []
  


  constructor(
    public orderService: OrderService,
    public clientService: ClientService,
    private placeService: PlaceService
  ) { }

  ngOnInit(): void {
    window.scroll({top: 0, left: 0, behavior: 'smooth'})
    this.findMenu()
  }

  ngOnDestroy(): void {
    if (this.menu$) this.menu$.unsubscribe()
    if (this.callback$) this.callback$.unsubscribe()
  }

  addToOrder(position: any) {
    this.pennding = true

    this.orderService.addToOrder(position)

    setTimeout(() => {
      position.quantity = 1
      position.total = position.cost
      this.pennding = false
    }, 500);


  }

  changeQuantity(position: any, type: string) {
    if (type === "+") {
      position.quantity = position.quantity + 1
      position.total = position.quantity * position.cost
    } else {
      if (position.quantity > 1) {
        position.quantity = position.quantity - 1
        position.total = position.quantity * position.cost
      }
    }

  }

  selectCategory(item: any) {
    this.orderService.selected_category = item
    this.orderService.selected_sub_category = undefined!
    this.orderService.zipQuries()
  }

  selectSubCategory(item: any) {
    this.orderService.selected_sub_category = item
    this.orderService.zipQuries()
  }

  show_favorites() {
    this.orderService.selected_category = "Избранное"
    this.orderService.selected_sub_category = undefined!
    this.orderService.zipQuries()
  }

  favoriteClass() {
    if (this.orderService.selected_category == "Избранное") {
      return "favorite-button  favorite-button-selected"
    } else {
      return "favorite-button"
    }
  }

  buttonSubCategoryClass(item: any) {
    if (this.orderService.selected_sub_category && this.orderService.selected_sub_category._id === item._id) {
      return "sub-category-selected"
    } else {
      return "sub-category"
    }
  }

  buttonCategoryClass(item: any) {
    if (this.orderService.selected_category && this.orderService.selected_category._id === item._id) {
      return "category-seleted"
    } else {
      return "category-select"
    }
  }

  buttonFavories(_id: string) {
    const candidate = this.clientService.user.favorites.find( (item: any) => item === _id )

    if (candidate) {
      return "favorite"
    } else {
      return "add-favorite"
    }
  }

  addToFavorites(_id: string) {
    this.callback$ = this.clientService.favorite(_id).subscribe(
      (data) => {
        this.clientService.user.favorites = data.favorites
      },
      error => {
        console.warn(error)
        location.reload()
      }
    )
  }
  

  findMenu() {
    this.orderService.loading_menu = true

    this.menu$ = this.placeService.menu(this.orderService.selected_place._id).subscribe(
        (data) => {

          this.orderService.categories = data.categories

          if (!this.orderService.selected_category) {
            this.orderService.selected_category = this.orderService.categories[0]
          }

          if (!this.orderService.selected_sub_category) {
            if (this.orderService.selected_category.sub_categories) {
              this.orderService.selected_sub_category = this.orderService.selected_category.sub_categories[0]
            }
          }
          
          this.orderService.zipQuries()

          this.orderService.positions = data.positions.map( (item: any) => {
            item.quantity = 1
            item.total = item.cost
            return item
          }  )

          
          if (this.orderService.order.place && this.orderService.order.place._id !== this.orderService.selected_place._id) {

            const deleted = [] as any[]

            this.orderService.order.list.forEach( element => {

              const candidate = this.orderService.positions.find( (item) => item._id === element._id )

              /* if (candidate) {

                element.action = candidate.action
                if (candidate.new_cost) {
                  element.cost = candidate.new_cost
                } else {
                  element.cost = candidate.cost
                }
                element.total = element.quantity * element.cost

              } else {
                deleted.push(element._id)
              } */

              if (candidate) {
                element.action = candidate.action

                if (!element.kit) {
                  if (candidate.new_cost) {
                    element.cost = candidate.new_cost
                  } else {
                    element.cost = candidate.cost
                  }
                  element.total = element.quantity * element.cost
                }
              } else {
                deleted.push(element._id)
              }

            })

            if (deleted.length > 0) {
              deleted.forEach( _id => {
                const index = this.orderService.order.list.findIndex( (item) => item._id === _id )
                this.orderService.order.list.splice(index, 1)
              })
            }

            
            this.orderService.order.place = undefined
            this.orderService.calculatePrice()

            
          }

          setTimeout(() => {
            this.orderService.loading_menu = false
          }, 1500);
        },
        error => {
          console.warn(error)
        }
      )
  }

}
