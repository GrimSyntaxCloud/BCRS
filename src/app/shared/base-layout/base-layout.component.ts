/*
Title: base-layout.component.ts
Author: Professor Krasso
Date: 02/09/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: application layout component
*/


import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.css']
})
export class BaseLayoutComponent implements OnInit {





  year: number = Date.now();

  sessionUserName: string;

  constructor(private cookieService: CookieService, private router: Router) {
     // from login component
    this.sessionUserName = this.cookieService.get('session_user');
    console.log('we  are in the const')
    console.log(this.sessionUserName)


    this.year = Date.now();
  }

  ngOnInit(): void {
  }

    // logout function deletes all cookies and navigate user to login page
  logout() {
    this.cookieService.deleteAll();
    this.router.navigate(['/session/login']);
  }



}
