/*
Title: role.service.ts
Author: Professor Krasso
Updated Date: 02/23/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: Service for role management
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../models/role.interface';


@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) { }

  // findAllRoles Service
  findAllRoles(): Observable<any> {
    return this.http.get('/api/roles');
  }

  // findRoleById Service
  findRoleById(roleId: string): Observable<any> {
    return this.http.get(`/api/roles/${roleId}`);
  }

  // createRole Service
  createRole(role: Role): Observable<any> {
    return this.http.post(`/api/roles`, {
      text: role.text
    });
  }

  // updateRole Service
  updateRole(roleId: string, role: Role): Observable<any> {
    return this.http.put(`/api/roles/${roleId}`, {
      text: role.text
    });
  }

  // deleteRole Service
  // http.delete() request
  deleteRole(roleId: string): Observable<any> {
    return this.http.delete(`/api/roles/${roleId}`);
  }

  // findUserRole Service
  findUserRole(userName: string): Observable<any> {
    console.log('userName from the findUserRole API ' + userName);
    return this.http.get(`/api/users/${userName}/role`);
  }
}
