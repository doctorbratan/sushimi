import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import {Howl, Howler} from 'howler';

import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import {SocketService} from '../../services/socket.service';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.css']
})
export class OrdersPageComponent implements OnInit, OnDestroy {

  sound: any = new Howl({ src: ['../../../assets/alert.wav'] })
  interval: any

  loading: boolean = true

  user: any

  soketOrders$!: Subscription
  orders: any[] = []

  callback$!: Subscription

  constructor(
    private orderSerivce: OrderService,
    private authService: AuthService,
    private srv :SocketService
  ) { }

  ngOnInit(): void {


    this.orders = []
    this.soketOrders$ = undefined!
    this.CheckPlayAudio()

    setTimeout(() => {
      this.user = this.authService.getUser()
      this.SoketListen()
    }, 2000);

  }

  ngOnDestroy(): void {
    if (this.soketOrders$) this.soketOrders$.unsubscribe()
    if (this.callback$) this.callback$.unsubscribe()
    clearInterval(this.interval)
  }


  SoketListen() {

      this.soketOrders$ =  this.srv.listen('OrdersUpdate').subscribe(
        (data: any) => {


          if (this.user.type !== 'admin') {

            data = data.filter( (order: any) => {
              if (order.status !== 'В Подтверждении' && order.place._id === this.user.place) {
                return order
              }
            })

          } else {


            data = data.filter( (order: any) => {
              if (order.status !== 'В Подтверждении') {
                return order
              }
            })
            
          }

      
          if (data.length > 0) {
            this.loading = true

            this.orders = data.map( (order: any) => {

              if (order.alert) {
                this.sound.play()
              }

              if (!order.accept) {
                order.time = undefined
                return order
              } else {
                return order
              }
            })
            

          }
          
          this.loading = false
        }
      )

  }

  CheckPlayAudio() {

    this.interval = setInterval( () => {

      this.orders.forEach( (order: any) => {
        if (order.alert) {
          this.sound.play()
        }
      })
  
    }, 5000 )
    
  }

  Alert(order: any) {

    this.loading = true

    const data = {
      _id: order._id,
      alert: order.alert
    }

    this.callback$ = this.orderSerivce.alert(data).subscribe(
      (data) => { },
      error => {
        console.warn(error)
        location.reload()
      }
    )

  }

  Accept(order: any) {

    this.loading = true

    const data = {
      _id: order._id,
      time: order.time
    }

    this.callback$ = this.orderSerivce.accept(data).subscribe(
      (data) => { },
      error => {
        console.warn(error)
        location.reload()
      }
    )

  }

  InWay(_id: string) {
    this.loading = true

    this.callback$ = this.orderSerivce.inway(_id).subscribe(
      (data) => { },
      error => {
        console.warn(error)
        location.reload()
      }
    )
  }

  End(order: any) {
    this.loading = true

    this.callback$ = this.orderSerivce.end(order).subscribe(
      (data) => {
        this.ngOnInit()
       },
      error => {
        console.warn(error)
        location.reload()
      }
    )

  }

  delete(_id: string) {
    this.loading = true

    this.callback$ = this.orderSerivce.delete(_id).subscribe(
      (data) => {
        this.ngOnInit()
      },
      error => {
        location.reload()
      }
    )
  }

}
