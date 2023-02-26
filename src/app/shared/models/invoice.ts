/*
Title: invoice.ts
Author: Professor Krasso
Updated Date: 02/23/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: Invoice model
*/

// import line-item.interface
import { LineItem } from "./line-item.interface";

export class Invoice {
  private username: string;
  private lineItems: LineItem[];
  private orderDate: string;
  private LABOR_RATE: number = 50;

  //partsAmount: number;
  //laborHours: number;

  constructor(username?: string) {
    this.username = username || '';
    // this.partsAmount = partsAmount || 0;
    // this.laborHours = laborHours || 0;
    this.orderDate = new Date().toLocaleDateString();
    this.lineItems = [];
  }

  getUsername(): string{
    return this.username;
  }

  setLineItems(lineItems: LineItem[]): void{
    this.lineItems = lineItems;
  }

  getLineItems(): LineItem[]{
    return this.lineItems;
  }

  // called in shopping cart for
  getLineItemTotal(): number{
    let total: number = 0;
    for (let lineItem of this.lineItems) {
      total += lineItem.price;
    }
    return Number(total);
  }


  getLaborAmount(): number{
    //return Number(this.laborHours) * Number(this.LABOR_RATE);
    return 0;
  }

  getOrderDate(): string{
    return this.orderDate;
  }

  getTotal(): number{
    //return Number(this.partsAmount) + Number(this.getLaborAmount()) + Number(this.getLineItemTotal());
    return 0;
  }

  clear() {
    //this.partsAmount = 0;
    //this.laborHours = 0;
    this.lineItems = [];
  }

}
