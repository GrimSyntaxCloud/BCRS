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

  descriptions!: Array<any>
  products: Array<any>

  constructor() {
     this.products = [
       {
      id:100,
      name: 'Password Reset',
      price:'39.99',
      descriptions:["Unlimited password reset per year","Remote service", "24/7 Support"]
    },
       {
      id:101,
      name: 'Spyware Removal',
      price:'99.99',
      descriptions:["Unlimited spyware removal per year","Remote service", "24/7 Support"]
    },
    {
      id:102,
      name: 'RAM Upgrade',
      price:'129.99',
      descriptions:["Three times per year","Free drop-off service", "24/7 Support"]
    },
    {
      id:103,
      name: 'Software Installation',
      price:'49.99',
      descriptions:["Unlimited software installation per year","Remote service", "24/7 Support"]
       },
     {
      id:104,
      name: 'PC Tune-up',
      price:'89.99',
      descriptions:["10 times per year","Remote or free drop-off service", "24/7 Support"]
       },
      {
      id:105,
      name: 'Keyboard Cleaning',
      price:'45.00',
      descriptions:["Unlimited keyboard cleaning per year","Free drop-off service", "24/7 Support"]
       },
       {
      id:106,
      name: 'Disk Clean-up',
      price:'149.99',
      descriptions:["Unlimited disk clean-up per year","Free drop-off service ", "24/7 Support"]
      },

  ];


  }

  // function to populate products in the service-repair component
  getProducts(): Product[]{
    return this.products;
 }


}
