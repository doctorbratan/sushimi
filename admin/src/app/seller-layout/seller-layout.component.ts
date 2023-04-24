import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-seller-layout',
  templateUrl: './seller-layout.component.html',
  styleUrls: ['./seller-layout.component.css']
})
export class SellerLayoutComponent implements OnInit {

  user: any

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.user = this.authService.getUser()
    }, 2000);

  }

  logout() {
    this.authService.logout()
  }

  navigateToAdmin() {
    if (this.user && this.user.type === 'admin') {
      this.router.navigate(['/map'])
    }
  }

}
