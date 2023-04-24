import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PlaceService } from 'src/app/services/place.service ';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, OnDestroy {

  loading: boolean = false
  pennding: boolean = false

  user_message: any
  users$!: Subscription
  users: any[] = []

  places$!: Subscription
  places: any[] = []

  _id: any
  login: any
  password: any
  access: boolean = true
  type: any = "seller"
  name: any
  place: any

  response_message: any
  callback$!: Subscription


  constructor(
    private authService: AuthService,
    private placeService: PlaceService
  ) { }

  ngOnInit(): void {
    this.getUsers()
    this.getPlaces()
  }

  ngOnDestroy(): void {
    if (this.users$) this.users$.unsubscribe()
    if (this.places$) this.places$.unsubscribe()
    if (this.callback$) this.callback$.unsubscribe()
  }

  catch() {
    this.pennding = true

    const user = this.zipUser()

    this.callback$ = this.authService.cathUser(user).subscribe(
      (data) => {
        this.getUsers()
        this.response_message = data.message
        this.unZipUser(data.user)
        this.pennding = false

        setTimeout(() => {
          this.response_message = undefined
        }, 2000);
      },
      error => {
        this.pennding = false
        this.response_message = error.error.message ? error.error.message : error
        setTimeout(() => {
          this.response_message = undefined
        }, 2000);
      }
    )

  }

  delete() {
    this.pennding = true

    this.callback$ = this.authService.deleteUser(this._id).subscribe(
      (data) => {
        this.response_message = data.message
        setTimeout(() => {
          this.response_message = undefined
          this.clean()
          this.getUsers()
          this.pennding = false
        }, 2000);
      },
      error => {
        this.pennding = false
        this.response_message = error.error.message ? error.error.message : error
        setTimeout(() => {
          this.response_message = undefined
        }, 2000);
      }
    )
  }

  getPlaces() {
    const data = {
      select: "_id name"
    }

    this.places$ = this.placeService.find(data).subscribe(
      (data) => {
        this.places = data
      },
      error => console.warn(error)
    )
  }

  getUsers() {
    this.loading = true

    this.users$ = this.authService.getUsers().subscribe(
      (data) => {
        this.users = data
        this.loading = false
        if (data.length == 0) {
          this.user_message = "Создайте первого пользователя!"
        }
      },
      error => {
        console.warn(error)
        this.loading = false
        this.user_message = error.error.message ? error.error.message : error
      }
    )
  }

  zipUser() {
    const user = {
      _id: this._id,
      login: this.login,
      password: this.password,
      access: this.access,
      type: this.type,
      name: this.name,
      place: this.place
    }

    return user
  }

  unZipUser(user: any) {
    this._id = user._id
    this.login = user.login
    this.access = user.access
    this.type = user.type
    this.name = user.name
    this.place = user.place
    this.password = undefined
  }

  clean() {
    this._id = undefined
    this.login = undefined
    this.password = undefined
    this.access = true
    this.type = undefined
    this.name = undefined
    this.place = undefined
  }

}
