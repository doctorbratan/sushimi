import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  constructor(private http: HttpClient) { }

  find(data: any): Observable<any[]> {
    return this.http.post<any[]>('/api/position', data)
  }

  catch(data: any): Observable<any> {

    const fd = new FormData()

    if (data._id) {
      fd.append('_id', data._id)
    }

    fd.append('category', JSON.stringify(data.category) )
    fd.append('sub_category', JSON.stringify(data.sub_category) )

    fd.append('name', data.name)
    fd.append('description', data.description)
    fd.append('cost', data.cost)
    fd.append('change_cost', data.change_cost)

    fd.append('composition', JSON.stringify(data.composition))

    fd.append('kit', JSON.stringify(data.kit))
    fd.append('kits', JSON.stringify(data.kits))

    fd.append('recomendations', JSON.stringify(data.recomendations))
    fd.append('imageSrc', data.imageSrc)

    if (data.image) {
      fd.append('image', data.image, data._id)
    }


    return this.http.post<any>('/api/position/catch', fd)
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`/api/position/${id}`)
  }

}
