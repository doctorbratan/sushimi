import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  constructor(private http: HttpClient) { }

  find(data: any): Observable<any[]> {
    return this.http.post<any[]>( '/api/place', data );
  }

  findOne(data: any): Observable<any> {
    return this.http.post<any>('/api/place/findOne', data)
  }

  catch(data: any): Observable<any> {
    return this.http.post<any>('/api/place/catch', data)
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`/api/place/${id}`)
  }

}
