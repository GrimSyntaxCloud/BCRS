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
import { LineItem } from '../models/line-item.interface';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  items: Product[] = [];
  //lineItems = Array<LineItem>;



  constructor(
   // private lineItems: LineItem[],
    private ProductService: ProductService

  ) {
    //this.lineItems = [];
  }

  // one product only can be added to the shopping cart once
  addToCart(product: Product) {
    let alreadyAdded = false;
    // loop over products to search if the product has already been added to the shopping cart
    // if find the product has already been added to the shopping cart, then stop the search
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].id === product.id) {
        alreadyAdded = true;
        break;
      }
    }
    // if the product has not been added to the shopping cart, then push the product to the shopping cart
    if (!alreadyAdded) {
      this.items.push(product);
    }
    return !alreadyAdded;
  }

  // get items for shopping cart
  getItems() {
    return this.items;
  }

  // items count in shopping cart
  itemsCount() {
    return this.items.length;
  }


  // setLineItems service / ?
  // setLineItems(lineItems: LineItem[]): void {
  //   lineItems = lineItems;
  // }

   // getLineItems service
  // getLineItems(): LineItem[] {
  //   return this.lineItems;
  // }

  // getLineItemTotal service
  // getLineItemTotal(): number {
  //   let lineItemTotal: number = 0;

  //   for (let lineItem of this.products) {
  //     lineItemTotal += lineItem.price;
  //   }
  //   return Number(lineItemTotal);
  // }

  getSubtotal(): any{
    let subTotal: number = 0;
    for (let i = 0; i < this.items.length; i++) {
      subTotal += Number(this.items[i].price) + Number(this.items[i].laborFee);
    }
    return Number(subTotal);
    // let itemTotalPrice += this.items.price + this.items.laborFee;

    // for (let product)

 }


// remove one product from shopping cart
removeItemFromCart(product: Product) {
  this.items = this.items.filter(item => item.id != product.id);
  return this.items;
  }

  clearCart() {
    this.items = [];
    return this.items;
  }

}
