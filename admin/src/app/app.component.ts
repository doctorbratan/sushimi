import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  authSub$!: Subscription

  constructor(
    private auth: AuthService
  ) {}

  ngOnInit(): void { 

    const potentialToken = localStorage.getItem('workspace-token');
    if (potentialToken) {
      this.auth.setToken(potentialToken)
      this.authSub$ =  this.auth.userData().subscribe()
    }

  }

  ngOnDestroy(): void {
    if (this.authSub$) this.authSub$.unsubscribe()
  }


}
