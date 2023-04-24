import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  find(data: any): Observable<any[]> {
    return this.http.post<any[]>('/api/client/find', data);
  }

  catch(data: any): Observable<any> {
    return this.http.post<any>('/api/client/catch', data)
  }

  delete(_id: string): Observable<any> {
    return this.http.delete<any>(`/api/client/${_id}`)
  }

}
