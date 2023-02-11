/*
Title: session-service.ts
Author: Professor Krasso
Updated Date: 02/10/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: Service for session management
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private http: HttpClient) { }
  /**
   * Description: This function will call the API to login a user
   */
  login(userName: string, password: string): Observable<any> {
    return this.http.post('/api/session/login', {
      userName,
      password
    })
  }
}
