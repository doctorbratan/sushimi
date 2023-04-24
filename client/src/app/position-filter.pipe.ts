import { Pipe, PipeTransform } from '@angular/core';
import { ClientService } from "./services/client.service";
import { OrderService } from './services/order.service';

export interface Search {
  category: string,
  sub_category: string
}

@Pipe({
  name: 'positionFilter'
})

export class PositionFilterPipe implements PipeTransform {

  constructor (
    private clientService: ClientService,
    private orderService: OrderService
  ) {}

  transform(list: any[], data: any) {


    if (this.orderService.selected_category === "Избранное") {

      list = list.filter( item => this.clientService.user.favorites.some( (e: any) => e === item._id ) )

      return list

    } else {

      if (data.category) {
        list = list.filter(item => item.category._id === data.category)
      }
  
      if (data.sub_category) {
        list = list.filter(item => item.sub_category._id === data.sub_category )
      } 
  
      return list

    }

  

  }

}