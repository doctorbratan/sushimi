import {Injectable} from '@angular/core'
import {ClientService} from '../services/client.service'
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http'
import {Observable, throwError} from 'rxjs'
import {catchError} from 'rxjs/operators'
import {Router} from '@angular/router'

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private clientSerivce: ClientService, private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if ( this.clientSerivce.isAuthenticated() ) {
      req = req.clone({
        setHeaders: {
          Authorization: this.clientSerivce.getToken()
        }
      })
    }
    
    return next.handle(req).pipe(
      catchError(
        (error: HttpErrorResponse) => this.handleAuthError(error)
      )
    )
  }

  private handleAuthError(error: HttpErrorResponse): Observable<any> {
    if (error.status === 401) this.clientSerivce.logout()
    return throwError(error)
  }
}
