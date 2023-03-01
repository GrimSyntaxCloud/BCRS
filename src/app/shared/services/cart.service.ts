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

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // this stores the items in the shopping cart
  items: Product[] = [];

  constructor(private cookieService: CookieService) { }

  // one product only can be added to the shopping cart once
  addToCart(product: Product) {
    // check if the product is already in the cart and if so, do not add it again to the cart
    // if not, add the product to the cart
    if (this.items && this.items.length > 0 && this.items.find(item => item.id === product.id)) {
      return this.items;
    }
    else {
      // alert(product.title + ' has been added to the cart');
      this.items.push(product);
      this.cookieService.set('cartItems', JSON.stringify(this.items));
      return this.items;
    }
  }

  // get items for shopping cart
  getItems() {
    return this.items;
  }

  // items count in shopping cart
  itemsCount() {
    /**
     * TODO:
     * The cartCount cookie is not being updated when the user adds or removes items from the cart.
     * unless the page is refreshed.
     */
    this.cookieService.set('cartCount', JSON.stringify(this.items.length), 1);
    console.log(this.items.length);
    return this.items.length;
  }

  // calculate the total cost of the order by adding up the each product price and labor fee
  getSubtotal(): any {
    let subTotal: number = 0;
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
    this.cookieService.set('cartItems', JSON.stringify(this.items));

    return this.items;
  }

  clearCart() {
    this.items = [];
    return this.items;
  }

}
