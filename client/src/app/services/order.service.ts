import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

import { LocalService } from "./local.service";
import { ClientService } from './client.service';


export interface OrderPosition {
  _id: string,
  imageSrc: string,
  category: 
  {
    _id: string,
    name: string
  },
  sub_category:
  {
    _id: string,
    name: string
  },
  name: string,
  kit: boolean,
  options:
  [
    {
      title: string,
      name: string
    }
  ]
  cost: number,
  action: boolean,
  quantity: number,
  total: number,
  comment: string
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public places: any[] = []
  public selected_place: any

  public loading_menu: boolean = false
  public categories: any[] = []
  public positions: any[] = []

  public selected_category!: any
  public selected_sub_category!: any

  public order = 
  {
    _id: undefined as any,
    list: [] as any[],
    total: 0,
    salle: 0,
    total_price: 0,
    place: undefined as any,
    user: 
    {
      _id: undefined as any,
      name: undefined as any,
      phone: undefined as any,
      city: undefined as any,
      address: undefined as any
    },
    status: "У Клиента",
    type: "Доставка" as string,
    payment: "Наличные" as string,
    note: "" as string,
    verification_code: undefined
  }

  constructor(
    private http: HttpClient,
    private localService: LocalService
  ) { }

  addToOrder(position: any) {

    this.order.place = {_id: this.selected_place._id, name: this.selected_place.name}

    let query =  {
      _id: position._id,
      imageSrc: position.imageSrc,
      category: position.category,
      sub_category: undefined,
      name: position.name,
      kit: position.kit,
      options: [],
      action: position.action,
      cost: 0,
      quantity: position.quantity,
      total: 0,
      comment: ""
    }

    if (position.sub_category) {
      query.sub_category = position.sub_category
    }

    if (position.new_cost) {
      query.cost = position.new_cost
      query.total = query.quantity * query.cost
    } else {
      query.cost = position.cost,
      query.total = query.quantity * query.cost
    }

    if (position.comment) {
      query.comment = position.comment
    }

    if (position.options && position.options.length > 0) {
      query.options = position.options
    }

    const orderPosition = Object.assign( {}, query)

    if (orderPosition.kit) {
      this.order.list.push(orderPosition)
    } else {
      let isDone = false

      for (let element of this.order.list) {
        if (element._id === orderPosition._id && !element.kit) {
          element.quantity = element.quantity + orderPosition.quantity
          element.total = element.cost * element.quantity 
          isDone = true
          break;
        }
      }

      if (!isDone) {
        this.order.list.push(orderPosition)
      }


    }

    this.calculatePrice()

  }

  calculatePrice() {

    this.order.total = this.order.list.reduce( (total, position) => {
      return total += position.total
    }, 0)

    this.order.total = +this.order.total.toFixed(2)

    if (this.order.salle) {

      this.order.total_price = this.order.list.reduce( (total, position) => {
        if (position.action) {
          return total += position.total
        } else {
          return total += position.total - (position.total * (this.order.salle/100) )
        }
      }, 0)

      this.order.total_price = +this.order.total_price.toFixed(2)

    } else {
      this.order.total_price = +this.order.total.toFixed(2)
    }

    this.saveOrder()
  }

  saveOrder() {
    this.localService.setJsonValue('order', this.order)
  }

  clean() {

    this.order =  {
      _id: undefined,
      list: [] as any[],
      total: 0,
      salle: 0,
      total_price: 0,
      user: 
      {
        _id: undefined,
        phone: undefined,
        city: undefined,
        address: undefined,
        name: undefined
      },
      status: "У Клиента",
      type: "Доставка",
      payment: "Наличные",
      note: "",
      place: undefined as any,
      verification_code: undefined
    }

    localStorage.removeItem('order')

  }


  zipQuries() {
    
    const data = {
      selected_place: this.selected_place,
      selected_category: this.selected_category,
      selected_sub_category: this.selected_sub_category
    }

    this.localService.setJsonValue('queirs', data)

  }

  unZipQuries(queirs: any) {
      this.selected_place = queirs.selected_place
      this.selected_category = queirs.selected_category
      this.selected_sub_category = queirs.selected_sub_category
  }


  catch(): Observable<any> {
    return this.http.post<any>('/api/order/catch', this.order)
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`/api/order/${id}`)
  }

  confim(_id: string): Observable<any> {
    return this.http.post<any>('/api/order/confim', {_id})
  }


}
