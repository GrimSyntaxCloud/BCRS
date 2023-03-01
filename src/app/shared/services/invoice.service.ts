/*
Title: invoice.service.ts
Author: Professor Krasso
Updated Date: 02/23/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: Service for invoice management
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../models/invoice'
import { LineItem } from '../models/line-item.interface';
import { Product } from '../models/product.interface';


@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http:HttpClient) { }

  // placeOrder(items: Product[]) {
  //   // create an invoice object
  //   let lineItems = [];
  //   for (let i = 0; i < items.length; i++) {
  //     let lineItem = { title: items[i].title, price: items[i].price, laborFee: items[i].laborFee };
  //     lineItems.push(lineItem);
  //   }
  //   let invoice = new Invoice();
  //   invoice.setLineItems(lineItems);

  //   // insert that object in the mongoDB collection
  //   console.log("posting order to mongo");
  //   return this.http.post(`/api/invoices`, {body: invoice});

  // }

  createInvoice(userName: string, invoice: Invoice): Observable<any> {
    return this.http.post(`/api/invoices/${userName}`, {
      userName: userName,
      lineItems: invoice.getLineItems(),
      partsAmount: invoice.partsAmount,
      laborAmount: invoice.getLaborAmount(),
      lineItemTotal: invoice.getLineItemTotal(),
      total: invoice.getTotal()
    });
  }



// http get() function for purchases-graph
  findPurchasesByServiceGraph(): Observable<any>{
    return this.http.get(`/api/invoices/purchases-graph`);
  }

}
