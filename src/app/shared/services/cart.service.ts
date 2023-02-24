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

@Injectable({
  providedIn: 'root'
})
export class CartService {

  items: Product[] = [];

  constructor() { }


addToCart(product: Product) {
    this.items.push(product);
  }

  getItems() {
    return this.items;
  }

  itemsCount() {
    return this.items.length;
  }

  // removeCartItem(product: Product) {
  //   return this.items.filter(function (item) {
  //     return item !== product
  //   })
  // }

  // not sure function is correct
removeItemFromCart(product: Product) {
    return this.items.filter(function (name) {
      return name !== name
    })
  }

  clearCart() {
    this.items = [];
    return this.items;
  }

}
