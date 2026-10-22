/*
Title: role-list.component.ts
Author: Professor Krasso
Updated Date: 02/11/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: role list component
*/


import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from '../../shared/services/confirmation.service';
import { Role } from 'src/app/shared/models/role.interface';
import { AppMessage as Message } from '../../shared/app-messages.component';
import { RoleService } from 'src/app/shared/services/role.service';

@Component({
  standalone: false,
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [ConfirmationService]
})
export class RoleListComponent implements OnInit {


  roles: Role[];
  errorMessages: Message[];
  roleForm: FormGroup = this.fb.group({
    text: [null, Validators.compose([Validators.required])]
  });


  constructor(private roleService: RoleService, private confirmationService: ConfirmationService, private fb: FormBuilder) {

    this.roles = [];
    this.errorMessages = [];

    this.roleService.findAllRoles().subscribe({
      next: (res) => {
        this.roles = res.data;
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  ngOnInit(): void {
  }

  create() {
    const newRole: Role = {
      text: this.roleForm.controls['text'].value
    }

    this.roleService.createRole(newRole).subscribe({
      next: (res) => {
        if(res.data) {
          this.roles.push(res.data);
      }
      else {
        this.errorMessages = [{ severity: 'error', summary: 'Error', detail: res.message }]
      }
    },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.roleForm.controls['text'].setErrors({ 'incorrect': false });
      }
    })
  }

  delete(roleId: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this role?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.roleService.deleteRole(roleId).subscribe({
          next: (res) => {
              console.log('role successfully deleted');
              this.roles = this.roles.filter(role => role._id !== roleId);
          },
          error: (e) => {
            console.log(e);
          }
        })
      },
      reject: () => {
        console.log('User canceled this operation');
      }
    })
  }
}
