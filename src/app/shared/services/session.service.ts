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
import { User } from '../models/user.interface';

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

  /**
   * Description: This function will call the register user api
   */
  register(user: User): Observable<any> {
    return this.http.post('/api/session/register', {
      userName: user.userName,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      email: user.email
    })
  }



  /**
   * Description: This function will call the API to update a user's password
   */
  updatePassword(password: string, userName: string): Observable<any> {
    return this.http.put('/api/session/users/' + userName + '/password', {
      password
    })
  }


}

