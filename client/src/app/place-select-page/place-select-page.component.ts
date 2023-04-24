import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-place-select-page',
  templateUrl: './place-select-page.component.html',
  styleUrls: ['./place-select-page.component.css']
})
export class PlaceSelectPageComponent implements OnInit {

  constructor(
    public orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    window.scroll({top: 0, left: 0, behavior: 'smooth'})
  }

  buttonClass(item: any) {
    if (this.orderService.selected_place && this.orderService.selected_place._id === item._id) {
      return "selected"
    } else {
      return ""
    }
  }

  select(item: any) {
    this.orderService.selected_place = item
    this.orderService.selected_category = undefined
    this.orderService.selected_sub_category = undefined
    this.orderService.zipQuries()
    this.router.navigate(['/menu'])
  }

}
