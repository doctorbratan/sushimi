import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CheckSerive } from 'src/app/services/check.service';
import { ClientService } from 'src/app/services/client.service';
import { OrderService } from 'src/app/services/order.service';
import { PlaceService } from 'src/app/services/place.service ';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css']
})
export class OrderPageComponent implements OnInit, OnDestroy {

  @ViewChild('UserData')
  UserDataRef!: ElementRef

  pennding: boolean = false
  global_message: any

  verification_code: any

  callback$!: Subscription
  cities$!: Subscription
  cities: any[] = []
  message: any

  constructor(
    public orderService: OrderService,
    private placeService: PlaceService,
    private checkService: CheckSerive,
    private clientService: ClientService
  ) { }

  ngOnInit(): void {
    window.scroll({top: 0, left: 0, behavior: 'smooth'})
    this.getCities()
    if (this.orderService.order.list.length == 0) {
      this.orderService.clean()
    } else {
      this.checkUserInfo()
      setTimeout(() => {
        this.orderService.calculatePrice()
      }, 300);
    }
    if (!this.orderService.order.place) {
      this.orderService.order.place = {
        _id: this.orderService.selected_place._id,
        name: this.orderService.selected_place.name
      }
    }
  }

  ngOnDestroy(): void {
    if (this.cities$) this.cities$.unsubscribe()
    if (this.callback$) this.callback$.unsubscribe()
  }

  checkUserInfo() {
    if (this.clientService.user) {
      if (!this.orderService.order.user._id) {
        this.orderService.order.user._id = this.clientService.user._id
        this.orderService.order.user.phone = this.clientService.user.phone
        this.orderService.order.user.name = this.clientService.user.name
        if (this.clientService.user.salle) {
          this.orderService.order.salle = this.clientService.user.salle
        }
      }
    }
  }

  catch() {
    this.pennding = true

    const res = this.checkService.checkUserInfo(this.orderService.order)

    if (!res.type) {
      this.UserDataRef.nativeElement.scrollIntoView({behavior: 'smooth', block: 'center'});
      this.message = res.message
      setTimeout(() => {
        this.message = undefined
        this.pennding = false
      }, 2000);
    } else {

      const city_candidate = this.cities.find( (city) => city._id === this.orderService.order.user.city )
      if (city_candidate) {
        const city = {
          _id: city_candidate._id,
          name: city_candidate.name,
          cost: city_candidate.cost
        }

        this.orderService.order.user.city = city
      }

  
      this.callback$ = this.orderService.catch().subscribe(
        (data) => {
          if (data.order && data.order.status === "В Подтверждении") {
            this.orderService.order = data.order
            this.orderService.saveOrder()
          } else {
            this.global_message = data.message
            this.orderService.clean()
          }
          this.pennding = false
        },
        err => {
          console.warn(err)
          this.global_message = err.error.message ? err.error.message : err
          this.orderService.clean()
        }
      )


    }

  }

  confim() {
    this.pennding = true


    if (this.verification_code === this.orderService.order.verification_code) {

      this.callback$ = this.orderService.confim(this.orderService.order._id).subscribe(
        (data: any) => {
          this.global_message = data.message
          this.orderService.clean()
          this.pennding = false
        },
        error => {
          console.warn(error)
          this.pennding = false
        }
      )
    } else {
      this.UserDataRef.nativeElement.scrollIntoView({behavior: 'smooth', block: 'center'});
      this.message = "Не верный код подтверждения!"
      setTimeout(() => {
        this.message = undefined
      }, 1500);
      this.pennding = false
    }
  }


  clearOrder() {
    this.pennding = true

    if (this.orderService.order._id) {
      this.callback$ = this.orderService.delete(this.orderService.order._id).subscribe(
        (data: any) => {
          this.orderService.clean()
          this.global_message = data.message
          this.pennding = false
        }, 
        err => {
          console.warn(err)
          this.pennding = false
        }
      )
    } else {
      this.orderService.clean()
    }
  }

  cleanAddress() {
    this.orderService.order.user.address = undefined
  }

  numberCheck() {


    if ( this.orderService.order.user.phone[0] === "0" ) {
      this.orderService.order.user.phone = this.removeCharByIndex(this.orderService.order.user.phone, 0)
    }

    if ( this.orderService.order.user.phone[0] !== "6" && this.orderService.order.user.phone[0] !== "7" ) {
      this.UserDataRef.nativeElement.scrollIntoView({behavior: 'smooth', block: 'center'});
      this.orderService.order.user.phone = undefined
      this.message = "Некорекктный номер телефона!"
      setTimeout(() => {
        this.message = undefined
      }, 2000);
    } else if (this.orderService.order.user.phone.length !== 8) {
      this.UserDataRef.nativeElement.scrollIntoView({behavior: 'smooth', block: 'center'});
      this.orderService.order.user.phone = undefined
      this.message = "Некорекктный номер телефона!"
      setTimeout(() => {
        this.message = undefined
      }, 2000);
    } else {
      this.orderService.saveOrder()
    }


  }

  removeCharByIndex(str: string,index: number) {
    return str.slice(0,index) + str.slice(index+1);
  }

  getCities() {
    if (this.orderService.selected_place) {
      this.cities$ = this.placeService.cities(this.orderService.selected_place._id).subscribe(
        (data: any[]) => {

          this.cities = data

          if (!this.orderService.order.user.city)  {

            if (this.orderService.order.user._id ) {

              const city_candidate = this.cities.find( (city: any) => city._id === this.clientService.user.city )
              if (city_candidate) {
                this.orderService.order.user.city = this.clientService.user.city
                this.orderService.order.user.address = this.clientService.user.street
              } else {
                this.orderService.order.user.city = this.cities[0]._id
              }

            } else {
              this.orderService.order.user.city = this.cities[0]._id
            }

           this.orderService.saveOrder()

          } else {
            const city_candidate = this.cities.find( (city: any) => city._id === this.orderService.order.user.city )
            if (!city_candidate) {
              this.orderService.order.user.city = this.cities[0]._id
              this.orderService.order.user.address = undefined
            }
          }
        },
        error => {
          console.warn(error)
        }
      )
    }
  }

  deleteFromList(index: number) {
    this.orderService.order.list.splice(index, 1)

    if (this.orderService.order.list.length == 0) {
      this.orderService.clean()
    } else {
      this.orderService.calculatePrice()
    }

  }

  changeQuantity(type: string, position: any, index: number) {

    if (type === "+") {
      position.quantity = position.quantity + 1
      position.total = position.cost * position.quantity
    } else {
      position.quantity = position.quantity - 1
      if (position.quantity <= 0) {
        this.orderService.order.list.splice(index, 1)
      } else {
        position.total = position.cost * position.quantity
      }
    }

    this.orderService.calculatePrice()

    if (this.orderService.order.list.length == 0) {
      this.orderService.clean()
    }
  }

}
