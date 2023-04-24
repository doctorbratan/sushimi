import {Component, OnDestroy, OnInit} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {AuthService} from '../services/auth.service'
import {Subscription} from 'rxjs'
import { Router } from '@angular/router'

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form: FormGroup = new FormGroup({
    login: new FormControl(null , [ Validators.required ] ),
    password: new FormControl(null , [ Validators.required ])
  })

  aSub!: Subscription
  error: any

  constructor(
    private auth: AuthService,
    private router: Router
    
    ) { }

  ngOnInit(): void {

    setTimeout(() => {

      if ( this.auth.getUser() ) {
        this.auth.navigateUser()
      } 

    }, 500);

  }

  ngOnDestroy(): void {
    if (this.aSub) this.aSub.unsubscribe()
  }

  Redirect(type: string) {
    if (type == "admin") {
      this.router.navigate(['/map'])
    } else {
      this.router.navigate(['/orders'])
    }
  }

  setError(error: string) {
    this.error = error

    setTimeout(() => {
      this.error = undefined
    }, 300);

  }

  onSubmit() {
    this.form.disable()

    this.aSub = this.auth.login(this.form.value).subscribe(
      (data) => { 
        // console.log(data)
        this.Redirect(data.user.type)
      },
      error => {
        this.setError(error.error.message ? error.error.message : error )
        this.form.enable()
      }
    )
  }


}
