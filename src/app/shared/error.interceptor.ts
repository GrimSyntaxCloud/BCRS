import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, throwError, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err =>{


      if([404].indexOf(err.status) !== -1){
        this.router.navigate(['/sessions/404']);
      }

      if([500].indexOf(err.status) !== -1){
        this.router.navigate(['/sessions/500']);
      }

      const error = {
        message: err.error.message || err.message,
        httpcode: err.error.httpCode || err.status,
        url: err.url
      }

      console.log(`HTTPInterceptor error; origin:${error.url};message:${error.message};httpCode:${error.httpcode}`);

      return throwError(() => error);
    }));
  }
}
