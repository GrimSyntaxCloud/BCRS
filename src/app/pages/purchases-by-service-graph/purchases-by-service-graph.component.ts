/*
 Title: purchases-by-service.component.ts
 Author: Professor Krasso
 Date: 02/25/2023
 Modified By: Andres Macias/Patrick Wolff/April Yang
 Description: purchases-by-service page component
 */

import { Component, OnInit } from '@angular/core';
import { InvoiceService } from 'src/app/shared/services/invoice.service';

@Component({
  selector: 'app-purchases-by-service-graph',
  templateUrl: './purchases-by-service-graph.component.html',
  styleUrls: ['./purchases-by-service-graph.component.css']
})
export class PurchasesByServiceGraphComponent implements OnInit {

  purchases: any;
  data: any;
  itemCount: string[];
  labels: string[];

  constructor(private invoiceService: InvoiceService) {

    this.purchases = [];
    this.data = {};
    this.itemCount = [];
    this.labels = [];

    this.invoiceService.findPurchasesByServiceGraph().subscribe({
    next: (res) => {
      this.purchases = res.data;
      console.log(this.purchases);

      for(const item of this.purchases) {
        console.log('item object')
        console.log(item._id);

        let title = item._id.title;
        let count = item.count;

        this.labels.push(title);
        this.itemCount.push(count);
      }

      // build the object for the primeng pie chart
      this.data = {
        labels: this.labels,
        datasets: [
          {
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#6C757D",
              "#28A745",
              "#17A2B8",
              "#DC3545",
            ],
            hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#6C757D",
              "#28A745",
              "#17A2B8",
              "#DC3545",
            ],
            data: this.itemCount
          },
        ]
   };
  //  verify the data object structure matches the primeng pie chart format
  console.log('data object')
  console.log(this.data);
    },
    error: (e) => {
      console.log(e);
    }

  });


  }


  ngOnInit(): void {
  }

}
