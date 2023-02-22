/*
Title: login-component.ts
Author: Professor Krasso
Updated Date: 02/10/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: login component
*/


import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SessionService } from 'src/app/shared/services/session.service';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // create a property that contains a form group
  loginForm: FormGroup = this.fb.group({
    userName: [null, Validators.compose([Validators.required])],
    //pattern for password: at least 8 characters, at least one letter, at least one number
    password: [null, Validators.compose([Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$')])]
  });

  // create a property that contains an array of messages
  errorMessages: Message[] = [];



  constructor(private fb: FormBuilder, private router: Router, private cookieService: CookieService, private http: HttpClient,
    private sessionService: SessionService) { }

  ngOnInit(): void {
  }

  /**
   * Description: login function
   * userName: comes from the form input
   * password: comes from the form input
   * details: calls the session service to login
   */
  login() {
    const userName = this.loginForm.controls['userName'].value;
    const password = this.loginForm.controls['password'].value;

    this.sessionService.login(userName, password).subscribe({
      next: (res) => {
        console.log(res);
        this.cookieService.set('sessionuser', res.data.userName, 1);
        this.router.navigate(['']);
      },
      error: (e) => {
        this.errorMessages = [
          { severity: 'error', summary: 'Error', detail: e.message }
        ]
        console.log(e)
      }
    })
  }
}
