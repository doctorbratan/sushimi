import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs'
import {tap} from 'rxjs/operators'
import { Router } from '@angular/router'

export interface login {
  message: any,
  token: string,
  user: any
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private token: any
  private user: any

  constructor(
    private http: HttpClient,
    private router: Router
    ) {
  }


  login(user: any): Observable<login> {
    return this.http.post<login>('/api/user/login', user)
      .pipe(
        tap(
          (data: login) => {
            localStorage.setItem('workspace-token', data.token)
            this.setToken(data.token)
            this.setUser(data.user)
          }
        )
      )
  }

  userData():Observable<any> {
    return this.http.get<any>('/api/user')
      .pipe(
        tap(
          (data: any) => {
            if (data) {
              this.setUser(data)
            }
          }
        )
      )
  }

  setToken(token: any) {
    this.token = token
  }

  navigateUser() {

    if (this.user) {

      if (this.user.type === "admin") {
        this.router.navigate(['/map'])
      } else {
        this.router.navigate(['/orders'])
      }

      return true

    } else {
      return false
    }

  }

  checkAdmin() {
    if (this.user && this.user.type == "admin") {
      return true
    } else {
      this.router.navigate(['/login'])
      return false
    }
  }

  getToken(): string {
    return this.token
  }

  setUser(user: any) {
    this.user = user
  }

  getUser() {
    return this.user
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  logout() {
    this.setToken(null)
    this.setUser(null)
    localStorage.removeItem('workspace-token')
    this.router.navigate(['/login'])
  }

  getUsers(): Observable<any> {
    return this.http.get<any>('/api/user/users')
  }

  cathUser(user: any): Observable<any> {
    return this.http.post<any>('/api/user/catch', user)
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`/api/user/${id}`)
  }

}
