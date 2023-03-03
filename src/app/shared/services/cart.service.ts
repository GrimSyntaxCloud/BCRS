/*
Title: cart.service.ts
Author: Professor Krasso
Updated Date: 02/21/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: Service for cart management
*/



import { Injectable } from '@angular/core';
import { Product } from '../models/product.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // this stores the items in the shopping cart
  items: Product[] = [];

  constructor(private cookieService: CookieService, private router: Router) { }

  // one product only can be added to the shopping cart once
  addToCart(product: Product) {
    // get the items from the cookie and store them in the items array
    this.items = JSON.parse(this.cookieService.get('cartItems')) || '[]';

    if (this.items && this.items.length > 0 && this.items.find(item => item.id === product.id)) {
      alert(product.title + ' is already in your shopping cart, please check it out.');

      this.updateCartCookies();
      return this.items;
    }
    else {
      alert(product.title + ' has been added to your shopping cart.');
      this.items.push(product);

      // update the cart cookie with the new list
      this.updateCartCookies();

      return this.items;
    }
  }

  // get items for shopping cart
  getItems() {
    return this.items;
  }


  // calculate the total cost of the order by adding up the each product price and labor fee
  getSubtotal(): any {
    let subTotal: number = 0;

    // get the items from the cookie and store them in the items array
    this.items = JSON.parse(this.cookieService.get('cartItems')) || 0;

    for (let item of this.items) {
      subTotal += Number(item.price);
    }
    return Number(subTotal);
  }


  // remove one product from shopping cart
  removeItemFromCart(product: Product) {

    this.items = this.items.filter(item => item.id != product.id);
    console.log('inside remove from cart', this.items);


    // update the cart cookie with the new list
    // this.cookieService.set('cartItems', JSON.stringify(this.items));
    this.updateCartCookies();

    return this.items

  }

  updateCartCookies() {
    // update the cart cookie with the new list
    this.cookieService.set('cartItems', JSON.stringify(this.items), 5);

    //update the cookie count
    this.cookieService.set('cartCount', JSON.stringify(this.items.length), 5);


  }




  clearCart() {
    this.items = [];
    return this.items;
  }


}
