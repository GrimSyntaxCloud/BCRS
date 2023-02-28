/*
Title: service-repair.component.ts
Author: April Yang
Date: 02/16/2023
Modified By: Andres Macias/Patrick Wolff
Description: service-repair component
*/


import { Component, OnInit } from '@angular/core';
import { LineItem } from 'src/app/shared/models/line-item.interface';
import { Product } from 'src/app/shared/models/product.interface';
import { Invoice } from 'src/app/shared/models/invoice';
import { Message } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/shared/services/product.service';
import { InvoiceService } from 'src/app/shared/services/invoice.service';
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
  lineItems: LineItem[];
  invoice: Invoice;
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
    this.lineItems = [];
    this.invoice = {} as Invoice;
    this.errorMessages = [];
    this.successMessages = [];

    // only session user can add product to the shopping cart
    this.sessionUserName = this.cookieService.get('sessionuser');

    this.products = this.productService.getProducts();
    this.invoice = new Invoice(this.username);

    console.log(this.products);
  }

  // the product only can be added to the shopping cart once with alert messages
  addToCart(product: Product) {
    let successfullyAdded = this.cartService.addToCart(product);
    if (successfullyAdded) {
      window.alert('Your product has been added to the cart!');
    } else {
      window.alert("Product has already been added.");
    }
  }

  ngOnInit(): void {

  }
}

