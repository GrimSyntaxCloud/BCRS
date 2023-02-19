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
import { VerifySecurityQuestionModel } from '../models/verify-security-question.interface';

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
      email: user.email,
      selectedSecurityQuestions: user.selectedSecurityQuestions
    })
  }


  // verify username
  // verifyUsername(username: string): Observable<any>{
  //   return this.http.get('/api/session/verify/users/' + username);
  // }


  // verify security questions
  verifySecurityQuestions(model: VerifySecurityQuestionModel, userName: String,): Observable<any>{
    return this.http.post('/api/session/verify/users/' + userName + '/security-questions', {
      questionText1: model.question1,
      questionText2: model.question2,
      questionText3: model.question3,
      answerText1: model.answerToQuestion1,
      answerText2: model.answerToQuestion2,
      answerText3: model.answerToQuestion3,

    })
  }

  /**
   * Description: This function will call the API to update a user's password
   */
  updatePassword(password: string, username: string): Observable<any> {
    return this.http.post('/api/session/users/' + username + '/reset-password', {
      password
    })
  }


}

