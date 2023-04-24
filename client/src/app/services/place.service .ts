import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  constructor(private http: HttpClient) { }

  start(): Observable<any[]> {
    return this.http.get<any[]>('/api/place/start')
  }

  menu(_id: string): Observable<any> {
    return this.http.post<any>('/api/place/menu', {_id})
  }

  cities(_id: string): Observable<any> {
    return this.http.post<any>('/api/place/cities', {_id})
  }


}
