/*
Title: service-repair.component.ts
Author: April Yang
Date: 02/16/2023
Modified By: Andres Macias/Patrick Wolff
Description: service-repair component
*/


import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/models/product.interface';
import { Message } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/shared/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { CartService } from 'src/app/shared/services/cart.service';
// import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-service-repair',
  templateUrl: './service-repair.component.html',
  styleUrls: ['./service-repair.component.css']
})
export class ServiceRepairComponent implements OnInit {

  // descriptions!: Array<any>
  username: string;
  products: Product[]; //this is the items in the cart
  currentCount: number;
  errorMessages: Message[];
  successMessages: Message[];

  sessionUserName: string;


  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private cookieService: CookieService
  ) {

    this.username = this.cookieService.get('sessionuser') || '';
    this.products = [];
    this.errorMessages = [];
    this.successMessages = [];
    this.currentCount = Number(this.cookieService.get('cartCount') || 0);

    // only session user can add product to the shopping cart
    this.sessionUserName = this.cookieService.get('sessionuser');

    this.products = this.productService.getProducts();
  }

  // the product only can be added to the shopping cart once with alert messages
  addToCart(product: Product) {
    this.currentCount = this.cartService.itemsCount() + 1;


    //set cookie for the cart items
    this.cookieService.set('cartItems', JSON.stringify(this.cartService.addToCart(product)), 1);
    //set cookie for the cart count
    this.cookieService.set('cartCount', JSON.stringify(this.currentCount), 1);

    // used to add the product to the shopping cart
    this.cartService.addToCart(product);
  }

  ngOnInit(): void {

  }
}

