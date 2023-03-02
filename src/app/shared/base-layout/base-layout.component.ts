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
import { CartService } from '../services/cart.service';


@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.css']
})
export class BaseLayoutComponent implements OnInit {

  year: number = Date.now();

  sessionUserName: string;

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private cartService: CartService
  ) {
     // from login component
    this.sessionUserName = this.cookieService.get('sessionuser');

    // if the cart cookie exists, do nothing, otherwise, create an empty cart cookie
    if (!this.cookieService.check('cartItems')) {
      this.cookieService.set('cartItems', '[]', 5);
    }



    this.year = Date.now();
  }

  ngOnInit(): void {
  }

    // logout function deletes all cookies and navigate user to the home page by reloading the window
  logout() {
    this.cookieService.deleteAll();
    this.router.navigate(['/']).then(() => { window.location.reload(); });
  }

  itemCount(){
    let cartCount = JSON.parse(this.cookieService.get('cartItems')) || [];
    return cartCount.length;
  }

}
