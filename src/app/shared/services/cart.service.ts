import { Injectable } from '@angular/core';
import { Product } from '../models/product.interface';

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
    return this.items.filter(function (item) {
      return item !== product
    })
  }

  clearCart() {
    this.items = [];
    return this.items;
  }

}
