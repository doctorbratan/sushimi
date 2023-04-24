import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements AfterViewInit {

  constructor(private authService: AuthService) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.authService.checkAdmin()
    }, 1500);
  }

  logout() {
    this.authService.logout()
  }


}
