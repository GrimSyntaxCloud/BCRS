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

  findAllUsers(): Observable<any> {
    return this.http.get('/api/users');
  }

  findUserById(userId: string): Observable<any> {
    return this.http.get('/api/users/' + userId);
  }

  // add service for findByUsername
  //findUserByUserName(userId: string): Observable<any> {
    //return this.http.get('/api/users/' + userId);
  //}

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

  updateUser(userId: string, user: User): Observable<any> {
    return this.http.put('/api/users' + userId, {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email
    })
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete('/api/users/' + userId);
  }

  deactivateUser(userName: string): Observable<any> {
    console.log("inside deactivate")
    console.log(userName)
    return this.http.delete('/api/users/deactivate/' + userName);
  }

  // find user selected security questions
findSelectedSecurityQuestions(username: string): Observable < any > {
  return this.http.get('/api/users/' + username + '/security-questions');
}

}


