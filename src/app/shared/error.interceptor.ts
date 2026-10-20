import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { catchError, throwError, Observable } from 'rxjs';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.startsWith('/api/') && ['POST', 'PUT', 'DELETE'].includes(request.method)) request = request.clone({ setHeaders: { 'X-BCRS-Request': '1' } });
    return next.handle(request).pipe(catchError(err => throwError(() => ({ message: err.error?.message || err.message, httpcode: err.status }))));
  }
}
