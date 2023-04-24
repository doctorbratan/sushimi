import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';
import { Router } from '@angular/router';

import { LocalService } from "./local.service";
import { OrderService } from "./order.service";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  public user: any
  private token: any

  constructor(
    private http: HttpClient,
    private router: Router,
    private localSerivce: LocalService,
    private orderService: OrderService
    ) { }


  favorite(_id: string): Observable<any> {
    return this.http.get<any>(`/api/client/favorite/${_id}`)
  }

  check_number(phone: string): Observable<any> {
    return this.http.get<any>(`/api/client/phone-check/${phone}`)
  }

  change_password(data: any): Observable<any> {
    return this.http.post('/api/client/change-password', data)
  }

  userSettings(data: any): Observable<any> {
    return this.http.post<any>('/api/client/user-settings', data)
  }

  register(user: any): Observable<any> {
    return this.http.post<any>(`/api/client/register`, user)
  }


  login(user: any): Observable<any> {
    return this.http.post<any>('/api/client/login', user)
      .pipe(
        tap(
          (data: any) => {
            this.setToken(data.token)
            this.setUser(data.user)
          }
        )
      )
  }

  clientCheck(): Observable<any> {
    return this.http.get<any>('/api/client')
  }

  setToken(token: any) {
    this.token = token
    localStorage.setItem('user-token', token)
  }

  getToken() {
    return this.token
  }

  setUser(user: any) {
    this.user = user
    this.localSerivce.setJsonValue('user', user)
  }
  
  isAuthenticated(): boolean {
    return !!this.token
  }

  logout() {
    this.setToken(null)
    this.setUser(null)
    this.orderService.selected_category = undefined!
    this.orderService.selected_sub_category = undefined!
    this.orderService.zipQuries()
    this.orderService.clean()
    localStorage.removeItem('user');
    localStorage.removeItem('user-token');
    this.router.navigate(['/login'])
  }


}
