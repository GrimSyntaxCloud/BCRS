// Profile editing adapted from the original BCRS team component.
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SessionService } from 'src/app/shared/services/session.service';
import { ToastMessageOptions as Message } from 'primeng/api';
@Component({
  standalone: false, selector: 'app-profile', templateUrl: './profile.component.html', styleUrls: ['./profile.component.css'] })
export class ProfileComponent {
  userName = '';
  guest = false;
  busy = false;
  errorMessages: Message[] = [];
  form = this.fb.group({ firstName: ['', [Validators.required, Validators.maxLength(60)]], lastName: ['', [Validators.required, Validators.maxLength(60)]], email: ['', [Validators.email, Validators.maxLength(120)]], phoneNumber: ['', Validators.maxLength(30)], address: ['', Validators.maxLength(240)] });
  passwordForm = this.fb.group({ currentPassword: ['', Validators.required], newPassword: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(128)]] });
  deletePassword = '';
  deleteConfirmed = false;
  constructor(private fb: FormBuilder, private session: SessionService, private cookies: CookieService, private router: Router) {
    this.session.me().subscribe({ next: res => { this.userName = res.data.userName; this.guest = res.data.guest; this.form.patchValue(res.data); }, error: e => this.error(e) });
  }
  error(e: any) { this.busy = false; this.errorMessages = [{ severity: 'error', summary: 'Unable to save', detail: e.message }]; }
  saveUser() {
    if (this.busy || this.form.invalid) return;
    this.busy = true;
    this.session.saveProfile(this.form.value).subscribe({ next: () => { this.busy = false; this.errorMessages = [{ severity: 'success', summary: 'Saved', detail: 'Your profile was saved to the database.' }]; }, error: e => this.error(e) });
  }
  finish() {
    this.cookies.delete('sessionuser', '/'); this.cookies.delete('cartItems', '/');
    this.router.navigate(['/session/login']).then(() => location.reload());
  }
  changePassword() {
    if (this.busy || this.passwordForm.invalid) return;
    this.busy = true;
    this.session.changePassword(this.passwordForm.value.currentPassword || '', this.passwordForm.value.newPassword || '').subscribe({ next: () => this.finish(), error: e => this.error(e) });
  }
  deleteAccount() {
    if (this.busy || !this.deleteConfirmed || !this.deletePassword) return;
    this.busy = true;
    this.session.deleteAccount(this.deletePassword).subscribe({ next: () => this.finish(), error: e => this.error(e) });
  }
}
