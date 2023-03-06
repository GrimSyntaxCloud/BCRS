/*
Title: profile.component.ts
Author: Professor Krasso
Updated Date: 02/11/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: User Profile Information
*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from "../../shared/services/user.service";
import { User } from "../../shared/models/user.interface";
import { ConfirmationService, Message } from 'primeng/api';
import { SessionService } from 'src/app/shared/services/session.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ConfirmationService]
})
export class ProfileComponent implements OnInit {

  user: User;
  userId: string;
  firstName: string;
  errorMessages: Message[];

  form: FormGroup = this.fb.group({
    firstName: [null, Validators.compose([Validators.required])],
    lastName: [null, Validators.compose([Validators.required])],
    phoneNumber: [null, Validators.compose([Validators.required])],
    email: [null, Validators.compose([Validators.required, Validators.email])],
    address: [null, Validators.compose([Validators.required])],
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private cookieService: CookieService,
    private sessionService: SessionService
  ) {

    this.userId = this.route.snapshot.paramMap.get('userId') ?? '';
    this.user = {} as User;
    this.firstName = this.cookieService.get('sessionuser') || '';
    this.errorMessages = [];

    // service needs to be updated to call findUserByUserName()
    this.userService.findUserById(this.userId).subscribe({
      next: (res) => {
        this.user = res.data;
        console.log('user object from findUserById call');
        console.log(this.user);
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.form.controls['firstName'].setValue(this.user.firstName);
        this.form.controls['lastName'].setValue(this.user.lastName);
        this.form.controls['phoneNumber'].setValue(this.user.phoneNumber);
        this.form.controls['email'].setValue(this.user.email);
        this.form.controls['address'].setValue(this.user.address);
        this.form.controls['role'].setValue(this.user.role?.text ?? 'standard');

        console.log(this.user);
      }
    })
  }



  ngOnInit(): void {
  }

  // Saves information entered by user
  saveUser(): void {
    console.log("inside saveUser" + this.form.controls['firstName'].value);
    const updatedUser = {
      firstName: this.form.controls['firstName'].value,
      lastName: this.form.controls['lastName'].value,
      phoneNumber: this.form.controls['phoneNumber'].value,
      email: this.form.controls['email'].value,
      address: this.form.controls['address'].value,
    }

    console.log(updatedUser);

    this.userService.updateUser(this.userId, updatedUser).subscribe({
      next: (res) => {
        console.log("inside userService method" + this.userId);
        this.router.navigate(['/']);
      },
      error: (e) => {
        this.errorMessages = [
          { severity: 'error', summary: 'Error', detail: e.message }
        ]
        console.log(`Node.js server error; httpCode:${e.httpCode};message:${e.message}`)
        console.log(e);
      }
    })
  }
  // Cancel the form and returns to home
  cancel(): void {
    this.router.navigate(['/'])
  }
}
