// Original registration by Professor Krasso and the BCRS team.
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SessionService } from 'src/app/shared/services/session.service';
import { ToastMessageOptions as Message } from 'primeng/api';
@Component({
  standalone: false, selector: 'app-register', templateUrl: './register.component.html', styleUrls: ['./register.component.css'] })
export class RegisterComponent {
  form = this.fb.group({
    userName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9_-]{3,32}')]],
    password: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(128)]],
    firstName: ['Demo', [Validators.required, Validators.maxLength(60)]],
    lastName: ['Customer', [Validators.required, Validators.maxLength(60)]]
  });
  errorMessages: Message[] = [];
  busy = false;
  constructor(private fb: FormBuilder, private session: SessionService, private cookies: CookieService, private router: Router) {}
  register() {
    if (this.busy || this.form.invalid) return;
    this.busy = true;
    const value = this.form.value;
    this.session.register({ userName: value.userName || '', password: value.password || '', firstName: value.firstName || '', lastName: value.lastName || '', email: '', phoneNumber: '', address: '' }).subscribe({
      next: res => {
        this.cookies.set('sessionuser', res.data.userName, 1, '/', undefined, location.protocol === 'https:', 'Strict');
        this.cookies.set('cartItems', '[]', 1, '/');
        this.router.navigate(['/users/profile', res.data.userName]).then(() => location.reload());
      },
      error: e => { this.busy = false; this.errorMessages = [{ severity: 'error', summary: 'Registration failed', detail: e.message }]; }
    });
  }
}
