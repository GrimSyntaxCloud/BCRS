// Original layout by Professor Krasso and the BCRS team.
import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
@Component({ selector: 'app-base-layout', templateUrl: './base-layout.component.html', styleUrls: ['./base-layout.component.css'] })
export class BaseLayoutComponent {
  year = Date.now();
  sessionUserName = '';
  role = 'standard';
  guest = false;
  logoutError = '';
  constructor(private cookies: CookieService, private router: Router, private session: SessionService) {
    this.session.me().subscribe({ next: res => {
      this.sessionUserName = res.data.userName; this.role = res.data.role.text; this.guest = res.data.guest;
      this.cookies.set('sessionuser', res.data.userName, 1, '/', undefined, location.protocol === 'https:', 'Strict');
    }, error: () => { this.cookies.delete('sessionuser', '/'); } });
  }
  logout() {
    this.session.logout().subscribe({ next: () => {
      this.cookies.delete('sessionuser', '/'); this.cookies.delete('cartItems', '/');
      this.router.navigate(['/session/login']).then(() => location.reload());
    }, error: e => { this.logoutError = e.message; } });
  }
  itemCount() {
    try { const items = JSON.parse(this.cookies.get('cartItems') || '[]'); return Array.isArray(items) ? items.length : 0; } catch { return 0; }
  }
}
