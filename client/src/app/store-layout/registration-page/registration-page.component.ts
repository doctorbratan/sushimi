import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})
export class RegistrationPageComponent implements OnInit, OnDestroy {

  global_message: any
  message: any
  pennding: boolean = false

  phone: any
  politic_agree: boolean = false

  aSub$!: Subscription

  constructor(
    private clientService: ClientService
  ) { }

  ngOnInit(): void {
    window.scroll({top: 0, left: 0, behavior: 'smooth'})
  }

  ngOnDestroy(): void {
    if (this.aSub$) this.aSub$.unsubscribe()
  }

  register() {
    this.pennding = true

    const user = {
      phone: this.phone,
      politic_agree: this.politic_agree
    }

    this.aSub$ = this.clientService.register(user).subscribe(
      (data) => {
        window.scroll({top: 0, left: 0, behavior: 'smooth'})
        this.global_message = data.message
        this.pennding = false
      },
      error => {
        window.scroll({top: 0, left: 0, behavior: 'smooth'})
        this.message = error.error.message ? error.error.message : error
        this.pennding = false
        this.phone = undefined
      }
    )
  }

  numberCheck() {

    if ( this.phone[0] === "0" ) {
      this.phone = this.removeCharByIndex(this.phone, 0)
    }

    if ( this.phone[0] !== "6" && this.phone[0] !== "7" ) {
      window.scroll({top: 0, left: 0, behavior: 'smooth'})
      this.phone = undefined
      this.message = "Некорекктный номер телефона!"
      setTimeout(() => {
        this.message = undefined
      }, 2000);
    } else if (this.phone.length !== 8) {
      window.scroll({top: 0, left: 0, behavior: 'smooth'})
      this.phone = undefined
      this.message = "Некорекктный номер телефона!"
      setTimeout(() => {
        this.message = undefined
      }, 2000);
    } else {
      this.aSub$ = this.clientService.check_number(this.phone).subscribe(
        (data) => {
          this.message = data.message
        },
        error => {
          window.scroll({top: 0, left: 0, behavior: 'smooth'})
          this.message = error.error.message ? error.error.message : error
          this.phone = undefined
        }
      )
    }

  }

  removeCharByIndex(str: string,index: number) {
    return str.slice(0,index) + str.slice(index+1);
  }

}
