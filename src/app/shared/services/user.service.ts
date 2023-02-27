/*
Title: user.service.ts
Author: Professor Krasso
Updated Date: 02/10/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: Service for user management
*/

import { Injectable } from '@angular/core';
import { User } from '../models/user.interface';
import  { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  // call findAllUsers API
  // http.get() request
  findAllUsers(): Observable<any> {
    return this.http.get('/api/users');
  }

  // call findUserById API
  // http.get() request
  findUserById(userId: string): Observable<any> {
    return this.http.get('/api/users/' + userId);
  }

  // call createUser API
  // http.post() request
  createUser(user: User): Observable<any> {
    return this.http.post('/api/users/', {
      userName: user.userName,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      email: user.email
    })
  }

  // call updateUser API
  // http.put() request
  updateUser(userId: string, user: User): Observable<any> {
    return this.http.put('/api/users/' + userId, {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role?.text ?? 'standard'
    })
  }

  // call deleteUser API
  // http.delete() request
  deleteUser(userId: string): Observable<any> {
      console.log("inside delete" + userId);
    return this.http.delete('/api/users/' + userId);
  }

  // call findUserByUserName API
  // http.get() request
findSelectedSecurityQuestions(username: string): Observable < any > {
  return this.http.get('/api/users/' + username + '/security-questions');
}

}


