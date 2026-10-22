/*
 Title: purchases-by-service.component.ts
 Author: Professor Krasso
 Date: 02/25/2023
 Modified By: Andres Macias/Patrick Wolff/April Yang
 Description: purchases-by-service page component
 */

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { InvoiceService } from 'src/app/shared/services/invoice.service';

@Component({
  standalone: false,
  selector: 'app-purchases-by-service-graph',
  templateUrl: './purchases-by-service-graph.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./purchases-by-service-graph.component.css']
})
export class PurchasesByServiceGraphComponent implements OnInit {

  loading = true;
  error = '';
  purchases: any;
  data: any;
  itemCount: number[];
  labels: string[];

  constructor(private invoiceService: InvoiceService) {

    this.purchases = [];
    this.data = {};
    this.itemCount = [];
    this.labels = [];

    this.invoiceService.findPurchasesByServiceGraph().subscribe({
    next: (res) => {
      this.purchases = res.data;
      this.loading = false;

      for(const item of this.purchases) {

        let title = item._id.title;
        let count = item.count;

        this.labels.push(title);
        this.itemCount.push(count);
      }

      // build the object for the Chart.js pie chart
      this.data = {
        labels: this.labels,
        datasets: [
          {
            backgroundColor: [
              "#a94025",
              "#416b62",
              "#c59b4b",
              "#7a738c",
              "#6d834f",
              "#5b8290",
              "#8e5c54",
            ],
            hoverBackgroundColor: [
              "#a94025",
              "#416b62",
              "#c59b4b",
              "#7a738c",
              "#6d834f",
              "#5b8290",
              "#8e5c54",
            ],
            data: this.itemCount
          },
        ]
   };
  //  verify the data object structure matches the Chart.js pie chart format
    },
    error: (e) => {
      this.loading = false;
      this.error = e.message;
    }

  });


  }


  ngOnInit(): void {
  }

}
