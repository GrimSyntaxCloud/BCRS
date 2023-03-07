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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ConfirmationService]
})
export class ProfileComponent implements OnInit {

  user: User;
  userName: string;
  userId: string;
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
    private sessionService: SessionService
  ) {

    this.userName = this.route.snapshot.paramMap.get('userName') ?? '';
    this.user = {} as User;
    this.errorMessages = [];
    this.userId = this.user._id?.toString() ?? '';
    this.form.disable();

    // service needs to be updated to call findUserByUserName()
    this.sessionService.verifyUsername(this.userName).subscribe({
      next: (res) => {
        this.user = res.data;
        this.userId = res.data._id;
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

      }
    });
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
      role: {
        text: this.user.role?.text ?? '',
      }
    }

    console.log(this.user._id);
    console.log(updatedUser);

    this.userService.updateUser(this.userId, updatedUser).subscribe({
      next: (res) => {
        console.log("inside userService method" + this.userId);
        // reload the window
        this.router.navigate(['/users/profile/' + this.user.userName]);
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
    this.router.navigate(['/users/profile/' + this.user.userName])
    this.form.disable();
  }

  toggleForm(): void {
    // toggle the form status
    if (this.form.disabled) {

    this.form.enable();
    } else {
    this.form.disable();
    }
  }


}
