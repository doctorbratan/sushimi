import { Pipe, PipeTransform } from '@angular/core';

export interface Search {
  category: string,
  sub_category: string,
  name: string
}

@Pipe({
  name: 'positionFilter'
})

export class PositionFilterPipe implements PipeTransform {

  transform(list: any[], data: any) {

    if (data.category) {
      list = list.filter(item => item.category._id === data.category)
    }

    if (data.sub_category) {
      list = list.filter(item => item.sub_category._id === data.sub_category )
    } 

    if (data.name) {
      return list ? list.filter(item => item.name.search(new RegExp(data.name, 'i')) > -1) : [];
    } else {
      return list
    }

  }

}