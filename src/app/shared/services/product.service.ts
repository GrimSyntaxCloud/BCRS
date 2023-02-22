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
      name: 'product 1',
      price:'29.99',
      descriptions:["Unlimited spyware removal per year","Remote service", "24/7 Support"]
    },
    {
      name: 'product 2',
      price:'39.99',
      descriptions:["Unlimited spyware removal per year","Remote service", "24/7 Support"]
    },
    {
      name: 'product 3',
      price:'49.99',
      descriptions:["Unlimited spyware removal per year","Remote service", "24/7 Support"]
    },
    {
      name: 'product 4',
      price:'59.99',
      descriptions:["Unlimited spyware removal per year","Remote service", "24/7 Support"]
    },

  ];


  }

  // function to populate products in the service-repair component
  getProducts(): Product[]{
    return this.products;
 }


}
