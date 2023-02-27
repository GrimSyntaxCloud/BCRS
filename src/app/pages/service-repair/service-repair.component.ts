/*
Title: service-repair.component.ts
Author: April Yang
Date: 02/16/2023
Modified By: Andres Macias/Patrick Wolff
Description: service-repair component
*/


import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/models/product.interface';
import { ProductService } from 'src/app/shared/services/product.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';



@Component({
  selector: 'app-service-repair',
  templateUrl: './service-repair.component.html',
  styleUrls: ['./service-repair.component.css']
})
export class ServiceRepairComponent implements OnInit {

  // descriptions!: Array<any>
  products: Array<any>;
  sessionUserName: string;


  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private cookieService: CookieService,

  ) {
    // populate products that are listed in the product.service.ts to the html
    this.products = this.productService.getProducts();
    // only seesion user can add product to the shopping cart
    this.sessionUserName = this.cookieService.get('sessionuser');
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
