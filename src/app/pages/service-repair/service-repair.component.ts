/*
Title: service-repair.component.ts
Author: April Yang
Date: 02/16/2023
Modified By: Andres Macias/Patrick Wolff
Description: service-repair component
*/


import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-repair',
  templateUrl: './service-repair.component.html',
  styleUrls: ['./service-repair.component.css']
})
export class ServiceRepairComponent implements OnInit {
  // price1: string;
  // price2: string;
  // price3: string;

  descriptions!: Array<any>
  cards: Array<any>;
  item!: object




  constructor() {

    // this.price1 = "5,000";
    // this.price2 = "4,000";
    // this.price3 = "6,000";
    // this.count = [1,2,3];
    this.cards = [
    {
      title: 'Card Title 1',
      // icon:"attach_money",
      price:'29.99',
      descriptions:["Unlimited spyware removal per year","Remote service", "24/7 Support"],
      buttonText: 'Choose'

    },
    {
      title: 'Card Title 2',
      price:'39.99',
      descriptions:["Unlimited spyware removal per year","Remote service", "24/7 Support"],
      buttonText: 'Choose'
    },
    {
      title: 'Card Title 3',
      price:'49.99',
      descriptions:["Unlimited spyware removal per year","Remote service", "24/7 Support"],
      buttonText: 'Choose'
    },
    {
      title: 'Card Title 4',
      price:'59.99',
      descriptions:["Unlimited spyware removal per year","Remote service", "24/7 Support"],
      buttonText: 'Choose'
    },

  ];
  }

  ngOnInit(): void {
   // document.getElementById("price1")!.innerHTML = this.price1;
  }

}
