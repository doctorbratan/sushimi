import { Injectable } from '@angular/core';
import* as CryptoJS from "crypto-js";
const SECRET_KEY = 'alliance-ge';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  // Encrypt the localstorage data
  encrypt(data: any) {
      data = CryptoJS.AES.encrypt(data, SECRET_KEY);
      data = data.toString();
      return data;
  }

  // Decrypt the encrypted data
  decrypt(data: any) {
      try {
        data = CryptoJS.AES.decrypt(data, SECRET_KEY);
        data = data.toString(CryptoJS.enc.Utf8);
        return data;
      } catch (error) {
        return false
      }

  }
 
}

 