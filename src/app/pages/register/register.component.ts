/*
Title: register.component.ts
Author: Professor Krasso
Date: 02/19/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: allows the user to register/sign up to create an account
*/


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { SecurityQuestion } from 'src/app/shared/models/security-question.interface';
import { SelectedSecurityQuestion } from 'src/app/shared/models/selected-security-question.interface';
import { User } from 'src/app/shared/models/user.interface';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SecurityQuestionService } from 'src/app/shared/services/security-question.service';
import { SessionService } from 'src/app/shared/services/session.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    },
  ]
})
export class RegisterComponent implements OnInit {

  errorMessages: Message[];
  user: User;
  securityQuestions: SecurityQuestion[];
  selectedSecurityQuestions: SelectedSecurityQuestion[];

  //first form
  contactForm: FormGroup = this.fb.group({
    firstName: [null, Validators.compose([Validators.required])],
    lastName: [null, Validators.compose([Validators.required])],
    // phone number must be a valid format of xxx-xxx-xxxx and have 10 digits
    phoneNumber: [null, Validators.compose([Validators.required, Validators.pattern('^\\d{3}-\\d{3}-\\d{4}$')])],
    address: [null, Validators.compose([Validators.required])],
    // zip code must be a valid format of xxxxx or xxxxx-xxxx and have 5 digits
    zip: [null, Validators.compose([Validators.required, Validators.pattern('^\\d{5}(?:[-\\s]\\d{4})?$')])],
    city: [null, Validators.compose([Validators.required])],
    state: [null, Validators.compose([Validators.required])],
    // email must be a valid format
    email: [null, Validators.compose([Validators.required, Validators.email])],
  });

  //second form
  securityQuestionsForm: FormGroup = this.fb.group({
    securityQuestion1: [null, Validators.compose([Validators.required])],
    securityQuestion2: [null, Validators.compose([Validators.required])],
    securityQuestion3: [null, Validators.compose([Validators.required])],
    securityQuestionAnswer1: [null, Validators.compose([Validators.required])],
    securityQuestionAnswer2: [null, Validators.compose([Validators.required])],
    securityQuestionAnswer3: [null, Validators.compose([Validators.required])]
  });

  //third form
  credentialsForm: FormGroup = this.fb.group({
    userName: [null, Validators.compose([Validators.required])],
    // password must be 8 characters long, contain at least one letter and one number
    password: [null, Validators.compose([Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$')])],
  });



  constructor(private router: Router, private fb: FormBuilder, private cookieService: CookieService, private securityQuestionsService: SecurityQuestionService, private sessionService: SessionService) {
    this.securityQuestions = [];
    this.errorMessages = [];
    this.user = {} as User;
    this.selectedSecurityQuestions = [];


    this.securityQuestionsService.findAllSecurityQuestions().subscribe({
      next: (res) => {
        this.securityQuestions = res.data;
      },
      error: (e) => {
        console.log(e);
      }
    });
   }

  ngOnInit(): void {
  }


  register() {
    const contactInformation = this.contactForm.value;
    const securityQuestions = this.securityQuestionsForm.value;
    const credentials = this.credentialsForm.value;

    this.selectedSecurityQuestions = [
      {
        questionText: securityQuestions.securityQuestion1,
        answerText: securityQuestions.securityQuestionAnswer1
      },
      {
        questionText: securityQuestions.securityQuestion2,
        answerText: securityQuestions.securityQuestionAnswer2
      },
      {
        questionText: securityQuestions.securityQuestion3,
        answerText: securityQuestions.securityQuestionAnswer3
      }
    ]

    this.user = {
      userName: credentials.userName,
      password: credentials.password,
      firstName: contactInformation.firstName,
      lastName: contactInformation.lastName,
      phoneNumber: contactInformation.phoneNumber,
      address: contactInformation.address + ' ' + contactInformation.city + ', ' + contactInformation.state + ' ' + contactInformation.zip,
      email: contactInformation.email,
      selectedSecurityQuestions: this.selectedSecurityQuestions
  }

  this.sessionService.register(this.user).subscribe({
    next: (res) => {
      this.cookieService.set('sessionuser', credentials.userName, 1);
      this.router.navigate(['/']);
    },
    error: (err) => {
      this.errorMessages = [
        { severity: 'error', summary: 'Error', detail: err.message }
      ]
      console.log(`Node.js Server Error: ${err.message}`);
      console.log(err);
    }
    });
  }

  removeSelectedSecurityQuestion(index: number) {
    this.selectedSecurityQuestions.splice(index, 1);
  }
}
