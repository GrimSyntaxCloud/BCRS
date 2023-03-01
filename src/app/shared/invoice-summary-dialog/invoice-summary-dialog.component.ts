/*
Title: invoice-summary-dialog.component.ts
Author: Professor Krasso
Date: 02/20/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: invoice-summary-dialog component
*/

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Invoice } from '../models/invoice';

@Component({
  selector: 'app-invoice-summary-dialog',
  templateUrl: './invoice-summary-dialog.component.html',
  styleUrls: ['./invoice-summary-dialog.component.css']
})
export class InvoiceSummaryDialogComponent implements OnInit {
invoice: Invoice;
username: string;
orderDate: string;
total: number;
labor: number;
parts: number;



  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.invoice = data.invoice;
    this.username = data.username;
    this.orderDate = data.orderDate;
    this.total = 0;
    this.labor = 0;
    this.parts = 0;

    this.username = this.invoice.getUsername();
    this.orderDate = this.invoice.getOrderDate();
    this.parts = this.invoice.partsAmount;
    this.labor = this.invoice.getLaborAmount();
    this.total = this.invoice.getTotal();

    console.log(this.invoice);
   }

  ngOnInit(): void {
  }

}
