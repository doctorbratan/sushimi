import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor(private storageService: StorageService) { }

  // Set the json data to local storage
  setJsonValue(key: string, value: any) {
    localStorage.setItem(key, this.storageService.encrypt(JSON.stringify(value)) )
  }

  // Get the json value from local storage
  getJsonValue(key: string) {
    const data = localStorage.getItem(key)

    if (data) {
      return this.storageService.decrypt(data)
    } else {
      return false
    }

  } 


}
