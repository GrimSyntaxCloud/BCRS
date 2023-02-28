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
    if (this.items.includes(product)) {
      return this.items;
    }
    else {
      this.items.push(product);
     console.log(this.items);
      return this.items;
    }

  }

  // get items for shopping cart
  getItems() {
       return this.items;
  }

  // items count in shopping cart
  itemsCount() {
    return this.items.length;
  }

  // calculate the total cost of the order by adding up the each product price and labor fee
  getSubtotal(): any{
    let subTotal: number = 0;
    for (let item of this.items) {
      subTotal += Number(item.price);
    }
    return Number(subTotal);
 }


// remove one product from shopping cart
removeItemFromCart(product: Product) {
  // remove the item from the cart cookie
    this.items = JSON.parse(this.cookieService.get('cartItems'));

    
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
