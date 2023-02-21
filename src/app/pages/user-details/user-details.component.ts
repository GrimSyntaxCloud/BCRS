/*
Title: user-details.component.ts
Author: Professor Krasso
Updated Date: 02/11/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description:User detail component
*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from "../../shared/services/user.service";
import { User } from "../../shared/models/user.interface";
import { ConfirmationService, ConfirmEventType, Message } from 'primeng/api';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
  providers: [ConfirmationService]
})
export class UserDetailsComponent implements OnInit {

  user: User;
  userId: string;
  userName: string;
  errorMessages: Message[];

  form: FormGroup = this.fb.group({
    firstName: [null, Validators.compose([Validators.required])],
    lastName: [null, Validators.compose([Validators.required])],
    phoneNumber: [null, Validators.compose([Validators.required])],
    email: [null, Validators.compose([Validators.required, Validators.email])],
    address: [null, Validators.compose([Validators.required])],
  });

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private userService: UserService, private confirmationService: ConfirmationService) {
    this.userName = this.route.snapshot.paramMap.get('userName') ?? '';
    this.userId = ''
    this.user = {} as User;
    this.errorMessages = [];

    // service needs to be updated to call findUserByUserName()
    this.userService.findUserById(this.userId).subscribe({
      next: (res) => {
        this.user = res.data;
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

        this.userId = this.user._id ?? ''
        console.log('oncomplete: ' + this.userId + '; ' + this.userName)
      }
    })
   }

  ngOnInit(): void {
  }

  // Saves information entered by user
  saveUser(): void {
    const updatedUser = {
      firstName: this.form.controls['firstName'].value,
      lastName: this.form.controls['lastName'].value,
      phoneNumber: this.form.controls['phoneNumber'].value,
      email: this.form.controls['email'].value,
      address: this.form.controls['address'].value
    }

    this.userService.updateUser(this.userId, updatedUser).subscribe({
      next: (res) => {
        this.router.navigate(['/users']);
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

  // Deactivate a user record
  deactivateUser() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this record?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deactivateUser(this.userName).subscribe({
          next: (res) => {
            console.log('User deleted successfully');
            this.router.navigate(["/"])
          },
          error: (e) => {
            console.log(e);
          }
        })
      },
      reject: (type: any) => {
        switch(type) {
          case ConfirmEventType.REJECT:
            console.log('User rejected this operation');
            break;
          case ConfirmEventType.CANCEL:
            console.log('User canceled this operation');
            break;
        }
      }
    });
  }

}
