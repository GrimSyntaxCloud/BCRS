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
    let alreadyAdded = false;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].id == product.id) {
        alreadyAdded = true;
        break;
      }
    }
    if (!alreadyAdded) {
      this.items.push(product);
    }
    return !alreadyAdded;
  }

  getItems() {
    return this.items;
  }

  itemsCount() {
    return this.items.length;
  }



removeItemFromCart(product: Product) {
  this.items = this.items.filter(item => item.id != product.id);
  return this.items;
  }

  clearCart() {
    this.items = [];
    return this.items;
  }

}
