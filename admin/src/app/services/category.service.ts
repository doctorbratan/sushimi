import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  get(): Observable<any[]> {
    return this.http.get<any[]>('/api/category');
  }

  catch(data: any): Observable<any> {
    return this.http.post<any>('/api/category/catch', data)
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`/api/category/${id}`)
  }

}
