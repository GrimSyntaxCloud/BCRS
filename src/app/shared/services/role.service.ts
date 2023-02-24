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

  // deleteRole service
  deleteRole(roleId: string): Observable<any> {
    return this.http.delete(`/api/role/${roleId}`);
  }

}
