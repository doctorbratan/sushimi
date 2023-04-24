import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  aSub$!: Subscription

  pennding: boolean = false
  message: any

  phone: any
  password: any

  constructor(
    private clientSerive: ClientService,
    private router: Router
  ) { }

  ngOnInit(): void {
    window.scroll({top: 0, left: 0, behavior: 'smooth'})
  }

  ngOnDestroy(): void {
    if (this.aSub$) this.aSub$.unsubscribe()
  }

  login() {
    this.pennding = true

    const user = {
      phone: this.phone,
      password: this.password
    }

    this.aSub$ = this.clientSerive.login(user).subscribe(
      (data) => {
        this.router.navigate(['/user'])
        this.pennding = false
      },
      error => {
        console.warn(error)
        this.message = error.error.message ? error.error.message : error
        setTimeout(() => {
          this.message = undefined
        }, 3000);
        this.pennding = false
      }
    )


  }



}
