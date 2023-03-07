/*
Title: invoice.ts
Author: Professor Krasso
Updated Date: 02/23/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: Invoice model
*/

// import line-item.interface
import { CartService } from "../services/cart.service";
import { ProductService } from "../services/product.service";
import { LineItem } from "./line-item.interface";
import { Product } from "./product.interface";


export class Invoice {
  private username: string;
  private lineItems: LineItem[];
  private orderDate: string;
  private LABOR_RATE: number = 50;

  partsAmount: number;
  laborHours: number;

  adjustedLabor: number;
  adjustedParts: number;

  constructor(username?: string, partsAmount?: number, laborHours?: number, adjustedParts?: number, adjustedLabor?: number) {
    this.username = username || '';
    this.partsAmount = partsAmount || 0;
    this.laborHours = laborHours || 0;
    this.orderDate = new Date().toLocaleDateString();
    this.lineItems = [];
    this.adjustedLabor = adjustedLabor || 0;
    this.adjustedParts = adjustedParts || 0;

  }

  getUsername(): string{
    return this.username;
  }

  setLineItems(lineItems: LineItem[]): void{
    this.lineItems = lineItems;
    this.laborHours = 0;
    for (let i = 0; i < lineItems.length; i++) {
      this.laborHours += Number(lineItems[i].laborHours);
    }
  }

  getLineItems(): LineItem[]{
    return this.lineItems;
  }

  // called in shopping cart for lineItem total price
  getLineItemTotal(): number{
    let total: number = 0;
    for (let lineItem of this.lineItems) {
      total += Number(lineItem.price);
    }
    return Number(total);
  }


  // function for calculating labor amount by labor hours times labor rate.
  getLaborAmount(): number{
    return Number(this.laborHours) * Number(this.LABOR_RATE);
  }

  // function for gaining the current date on invoice page
  getOrderDate(): string{
    return this.orderDate;
  }

  // function for declaring the invoice adjusted labor and adjusted parts
  getAdjustedFees(adjustedLabor: number, adjustedParts: number): void{
   this.adjustedLabor = adjustedLabor;
    this.adjustedParts = adjustedParts;
  }


  // function for calculating the total charge by adding up labor amount, lineItemTotal, adjusted labor fees and parts fees
  getTotal(): number{
    return Number(this.getLaborAmount()) + Number(this.getLineItemTotal() + Number(this.adjustedLabor + this.adjustedParts));
  }


  clear() {
    this.partsAmount = 0;
    this.laborHours = 0;
    this.lineItems = [];
  }

}
