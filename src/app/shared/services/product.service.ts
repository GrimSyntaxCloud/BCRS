/*
Title: product.service.ts
Author: Professor Krasso
Updated Date: 02/22/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: Service for product management
*/


import { Injectable } from '@angular/core';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // define products and descriptions types as array
  products: Product[];
  descriptions!: Array<any>

  constructor() {

    // Create array of available products
    this.products = [
      {
        id: 100,
        title: 'Password Reset',
        price: 39.99,
        descriptions: ["Unlimited password reset per year", "Remote service", "24/7 Support"],
        // laborFee:'30.00'
        laborHours: 1
      },
      {
        id: 101,
        title: 'Spyware Removal',
        price: 99.99,
        descriptions: ["Unlimited spyware removal per year", "Remote service", "24/7 Support"],
        // laborFee:'50.00'
        laborHours: 2
      },
      {
        id: 102,
        title: 'RAM Upgrade',
        price: 129.99,
        descriptions: ["Three times per year", "Free drop-off service", "24/7 Support"],
        // laborFee:'50.00'
        laborHours: 2
      },
      {
        id: 103,
        title: 'Software Installation',
        price: 49.99,
        descriptions: ["Unlimited software installation per year", "Remote service", "24/7 Support"],
        // laborFee:'30.00'
        laborHours: 1
      },
      {
        id: 104,
        title: 'PC Tune-up',
        price: 89.99,
        descriptions: ["10 times per year", "Remote or free drop-off service", "24/7 Support"],
        // laborFee:'50.00'
        laborHours: 2
      },
      {
        id: 105,
        title: 'Keyboard Cleaning',
        price: 45.00,
        descriptions: ["Unlimited keyboard cleaning per year", "Free drop-off service", "24/7 Support"],
        // laborFee:'30.00'
        laborHours: 1
      },
      {
        id: 106,
        title: 'Disk Clean-up',
        price: 149.99,
        descriptions: ["Unlimited disk clean-up per year", "Free drop-off service ", "24/7 Support"],
        // laborFee:'50.00'
        laborHours: 2
      },
    ];
  }

  // function to populate products in the service-repair component
  getProducts(): Product[] {
    return this.products;
  }
}
