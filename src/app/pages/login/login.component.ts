// Original login component by Professor Krasso; adapted by the BCRS team.
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SessionService } from 'src/app/shared/services/session.service';
import { AppMessage as Message } from '../../shared/app-messages.component';
@Component({
  standalone: false, selector: 'app-login', templateUrl: './login.component.html', changeDetection: ChangeDetectionStrategy.Eager,
 styleUrls: ['./login.component.css'] })
export class LoginComponent {
  loginForm = this.fb.group({ userName: ['', Validators.required], password: ['', Validators.required] });
  errorMessages: Message[] = [];
  busy = false;
  constructor(private fb: FormBuilder, private router: Router, private cookies: CookieService, private session: SessionService) {}
  login(guest = false) {
    if (this.busy || (!guest && this.loginForm.invalid)) return;
    this.busy = true;
    const request = guest ? this.session.guest() : this.session.login(this.loginForm.value.userName || '', this.loginForm.value.password || '');
    request.subscribe({ next: res => {
      // This is a display hint only. The API verifies its HttpOnly session cookie.
      this.cookies.set('sessionuser', res.data.userName, 1, '/', undefined, location.protocol === 'https:', 'Strict');
      this.cookies.set('cartItems', '[]', 1, '/');
      this.router.navigate(['/']).then(() => location.reload());
    }, error: e => { this.busy = false; this.errorMessages = [{ severity: 'error', summary: 'Unable to sign in', detail: e.message }]; } });
  }
}
