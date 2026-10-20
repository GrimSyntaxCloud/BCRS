import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { SessionService } from './shared/services/session.service';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private session: SessionService) {}
  canActivate() {
    return this.session.me().pipe(map(() => true), catchError(() => of(this.router.createUrlTree(['/session/login']))));
  }
}
