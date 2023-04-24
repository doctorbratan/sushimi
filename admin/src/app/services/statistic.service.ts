import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  constructor(private http: HttpClient) { }

  orderHistory(data: any): Observable<any> {
    return this.http.post<any>('/api/statistic/order-history', data)
  }
  
}
