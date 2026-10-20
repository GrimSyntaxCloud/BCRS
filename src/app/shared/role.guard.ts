import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { SessionService } from './services/session.service';
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private router: Router, private session: SessionService) {}
  canActivate() {
    return this.session.me().pipe(map(res => res.data.guest ? true : this.router.createUrlTree(['/'])), catchError(() => of(this.router.createUrlTree(['/session/login']))));
  }
}
