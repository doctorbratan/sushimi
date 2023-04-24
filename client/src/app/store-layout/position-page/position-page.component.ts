import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-position-page',
  templateUrl: './position-page.component.html',
  styleUrls: ['./position-page.component.css']
})
export class PositionPageComponent implements OnInit {

  loading: boolean = false
  message!: string

  position: any

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    window.scroll({top: 0, left: 0, behavior: 'smooth'})
    this.loading = true

    this.activatedRoute.params.subscribe( params => {
      const _id = params['_id']
      if (!_id) {
        this.router.navigate(['/menu'])
      } else {

        this.position = this.orderService.positions.find( (item) => item._id === _id )

      /*   const candidate = localStorage.getItem('position')
        if (!this.position && candidate) {
          this.position = JSON.parse(candidate)
        } */
       
        if (this.position) {

          // localStorage.setItem('position', JSON.stringify(this.position))
        
          // Обработка Опций
          if (this.position.kits && this.position.kits.length > 0) {

            this.position.kits.forEach( (element: any) => {

              
              element.options = element.options.map( (option: any) => {
                option.selected = false
                return option
              })

              if (element.required) {
                element.options[0].selected = true
              }

            });
          }


          //Обработка Рекомендаций
          const recomendations = [] as any
          if (this.position.recomendations && this.position.recomendations.length > 0) {
            this.position.recomendations.forEach( (element: any) => {
              const candidate = this.orderService.positions.find( (item) => item._id === element._id )
              if (candidate) {
                const recomendation = Object.assign( {}, {
                  _id: candidate._id,
                  image: candidate.imageSrc,
                  category: candidate.category.name,
                  name: candidate.name,
                  cost: candidate.new_cost ? candidate.new_cost : candidate.cost,
                  quantity: 1,
                  total: candidate.new_cost ? candidate.new_cost : candidate.cost
                })
                recomendations.push(recomendation)
              }
            });
          }
          this.position.recomendations = recomendations

          if (this.position.new_cost) {
            this.position.cost = this.position.new_cost
          }

          this.calculatePrice()
          this.loading = false
        } else {
          this.router.navigate(['/menu'])
        } 

      }
    })
  }

  addRecomandation(position: any) {
    const candidate = this.orderService.positions.find( (item) => item._id === position._id )
    if (candidate) {
      candidate.quantity = position.quantity
      this.orderService.addToOrder(candidate)
      candidate.quantity = 1
      position.quantity = 1
    }
  }

  addToOrder() {
    this.loading = true

    const options = [] as any
    let kit_cost = 0
    this.position.kits.forEach( (element: any) => {

      element.options.forEach( (option: any) => {
        if (option.selected) {

          kit_cost = kit_cost + option.cost

          const obj = Object.assign({}, {
            title: element.name,
            name: option.name
          })

          options.push(obj)

        }
      })

    })

    let kit = false

    if (options.length > 0) {
      kit = true
    }

    const position = Object.assign({}, {
      _id: this.position._id,
      imageSrc: this.position.imageSrc,
      category: this.position.category,
      sub_category: this.position.sub_category,
      name: this.position.name,
      kit: kit,
      options: options,
      action: this.position.action,
      cost: this.position.cost + kit_cost,
      quantity: this.position.quantity,
    })

    this.position.options = options

    this.orderService.addToOrder(position)

    /* setTimeout(() => {
      if (this.position.recomendations && this.position.recomendations.length > 0) {
        this.position.recomendations.forEach( (position: any) => {
          if (position.quantity > 0) {
            const candidate = this.orderService.positions.find( (item) => item._id === position._id )
            if (candidate) {
              candidate.quantity = position.quantity
              this.orderService.addToOrder(candidate)
              candidate.quantity = 1
            }
          }
        })
      }
    }, 300); */

    setTimeout(() => {
      this.calculatePrice()
      this.loading = false
      this.message = "Добавленно в заказ!"
      if (this.position.recomendations.length == 0) {
        this.router.navigate(['/menu'])
      }
    }, 500);
  }

  changeRecomendationQuantity(position: any, type: boolean) {
    if (type) {
      position.quantity = position.quantity + 1
    } else {
      position.quantity = position.quantity - 1
    }
    position.total = position.quantity * position.cost
  }

  changeQuantity(add: boolean) {

    if (add) {
      this.position.quantity = this.position.quantity + 1
    } else {
      if (this.position.quantity > 1) {
        this.position.quantity = this.position.quantity - 1
      }
    }

    this.calculatePrice()

  }

  selectOption(kit: any, option_index: number) {

    const option = kit.options[option_index]

    if (kit.single) {

      kit.options.forEach( (option: any) => {
        option.selected = false
      })

      option.selected = true

    } else {
      option.selected = !option.selected
    }

    this.calculatePrice()
  }


  buttonAdditive(item: any) {
    if (item.selected) {
      return "option-selected"
    } else {
      return "option"
    }
  }

  calculatePrice() {

    let kits_cost = 0
    // Обработка Опций
    if (this.position.kits && this.position.kits.length > 0) {

      this.position.kits.forEach( (element: any) => {

        element.options.forEach( (option: any) => {
             if (option.selected) {
                kits_cost = kits_cost + option.cost
             }
        })

        });

   }

   this.position.total = (this.position.cost + kits_cost) * this.position.quantity

  }



}
