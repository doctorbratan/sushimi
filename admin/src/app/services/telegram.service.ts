import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TelegramService {

  constructor(private http: HttpClient) { }

  get(): Observable<any[]> {
    return this.http.get<any[]>('/api/telegram');
  }

  catch(data: any): Observable<any> {
    return this.http.post<any>('/api/telegram/catch', data)
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`/api/telegram/${id}`)
  }

}
