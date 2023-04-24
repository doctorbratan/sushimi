import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class CheckSerive {

  constructor() { }

  checkUserInfo(data: any) {

    if (!data.user.phone) {
      return {type: false, message: "Введите номер телефона!"}
    } else if (data.type === "Доставка" && !data.user.city) {
      return {type: false, message: "Выберите город доставки!"}
    } else if (data.type === "Доставка" && !data.user.address) {
      return {type: false, message: "Введите адрес доставки!"}
    } else {
      return {type: true, message: ""}
    }

  }



}
