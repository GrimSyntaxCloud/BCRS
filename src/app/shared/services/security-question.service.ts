/*
Title: security-question.service.ts
Author: Professor Krasso
Updated Date: 02/11/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: Service for security-question management
*/

import { Injectable } from '@angular/core';
import { SecurityQuestion } from '../models/security-question.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SecurityQuestionService {

  constructor(private http: HttpClient) { }


  // call findAllSecurityQuestions API
  // http.get() request
  findAllSecurityQuestions(): Observable<any>{
    return this.http.get('/api/security-questions');
  }

   // call findSecurityQuestionById API
  // http.get() request
  findSecurityQuestionById(questionId: string): Observable<any> {
    return this.http.get('/api/security-questions/' + questionId);
     }

  // call createSecurityQuestion API
  // http.get() request
  createSecurityQuestion(newSecurityQuestion: SecurityQuestion): Observable<any>{
      return this.http.post('/api/security-questions', {
         text: newSecurityQuestion.text
       })
    }

  updateSecurityQuestion(questionId: string, updatedSecurityQuestion: SecurityQuestion): Observable < any > {
      return this.http.put('/api/security-questions/' + questionId, {
        text: updatedSecurityQuestion.text
      })
    }

  // call deleteSecurityQuestion API
  // http.get() request
  deleteSecurityQuestion(questionId: string): Observable<any>{
    return this.http.delete('/api/security-questions/' + questionId);
  }

}
