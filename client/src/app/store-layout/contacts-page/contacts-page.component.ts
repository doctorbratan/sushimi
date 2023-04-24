import { Component, OnInit} from '@angular/core';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-contacts-page',
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.css']
})
export class ContactsPageComponent implements OnInit {

  map!: any

  constructor(
    public orderService: OrderService
  ) { }

  ngOnInit(): void {
  }

}
