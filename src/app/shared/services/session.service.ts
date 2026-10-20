import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { VerifySecurityQuestionModel } from '../models/verify-security-question.interface';
@Injectable({ providedIn: 'root' })
export class SessionService {
  constructor(private http: HttpClient) {}
  login(userName: string, password: string): Observable<any> { return this.http.post('/api/session/login', { userName, password }); }
  guest(): Observable<any> { return this.http.post('/api/session/guest', {}); }
  register(user: User): Observable<any> { return this.http.post('/api/session/register', user); }
  me(): Observable<any> { return this.http.get('/api/session/me'); }
  logout(): Observable<any> { return this.http.post('/api/session/logout', {}); }
  verifyUsername(username: string): Observable<any> { return this.http.get('/api/session/verify/users/' + encodeURIComponent(username)); }
  saveProfile(profile: any): Observable<any> { return this.http.put('/api/session/profile', profile); }
  changePassword(currentPassword: string, newPassword: string): Observable<any> { return this.http.post('/api/session/password', { currentPassword, newPassword }); }
  deleteAccount(currentPassword: string): Observable<any> { return this.http.post('/api/session/delete-account', { currentPassword }); }
  // Retained only for undeployed legacy components; the API rejects these routes.
  verifySecurityQuestions(model: VerifySecurityQuestionModel, name: String): Observable<any> { return this.http.post('/api/session/unsupported-recovery', {}); }
  updatePassword(password: string, username: string): Observable<any> { return this.http.post('/api/session/unsupported-recovery', {}); }
}
