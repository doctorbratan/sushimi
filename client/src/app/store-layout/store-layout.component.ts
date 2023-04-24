import { Component, OnInit , OnDestroy } from '@angular/core';
import { ClientService } from '../services/client.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'store-layout',
  templateUrl: './store-layout.component.html',
  styleUrls: ['./store-layout.component.css']
})
export class StoreLayoutComponent implements OnInit, OnDestroy {


  constructor(
    public orderService: OrderService,
    public clientService: ClientService
  ) { }

  ngOnInit(): void {
  }
  
  ngOnDestroy(): void {
  }



}
